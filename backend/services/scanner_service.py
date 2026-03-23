import ssl
import socket
import asyncio
from datetime import datetime
from typing import Optional
import json

# Quantum risk classification database
ALGORITHM_RISK = {
    # Key exchange
    "RSA": {"risk": "CRITICAL", "score": 95, "reason": "Broken by Shor's algorithm on quantum computers"},
    "DH": {"risk": "CRITICAL", "score": 90, "reason": "Discrete log vulnerable to quantum attacks"},
    "ECDH": {"risk": "HIGH", "score": 75, "reason": "Elliptic curve discrete log vulnerable to Shor's algorithm"},
    "ECDHE": {"risk": "HIGH", "score": 70, "reason": "Elliptic curve key exchange vulnerable to quantum attacks"},
    "X25519": {"risk": "HIGH", "score": 65, "reason": "Elliptic curve based - quantum vulnerable"},
    "X448": {"risk": "HIGH", "score": 65, "reason": "Elliptic curve based - quantum vulnerable"},
    # Symmetric (less affected - Grover's halves effective key size)
    "AES-128": {"risk": "MEDIUM", "score": 40, "reason": "Grover's reduces to 64-bit effective security"},
    "AES-256": {"risk": "LOW", "score": 15, "reason": "Grover's reduces to 128-bit - still acceptable"},
    "CHACHA20": {"risk": "LOW", "score": 15, "reason": "256-bit symmetric - adequate quantum resistance"},
    # Post-quantum safe
    "KYBER": {"risk": "SAFE", "score": 5, "reason": "NIST PQC standard - quantum resistant"},
    "CRYSTALS-KYBER": {"risk": "SAFE", "score": 5, "reason": "NIST PQC standard"},
    "DILITHIUM": {"risk": "SAFE", "score": 5, "reason": "NIST PQC signature standard"},
    "CRYSTALS-DILITHIUM": {"risk": "SAFE", "score": 5, "reason": "NIST PQC signature standard"},
    "FALCON": {"risk": "SAFE", "score": 5, "reason": "NIST PQC signature standard"},
    "SPHINCS+": {"risk": "SAFE", "score": 5, "reason": "NIST PQC signature standard"},
}

CIPHER_RISK = {
    "TLS_AES_256_GCM_SHA384": {"risk": "LOW", "score": 15},
    "TLS_AES_128_GCM_SHA256": {"risk": "MEDIUM", "score": 35},
    "TLS_CHACHA20_POLY1305_SHA256": {"risk": "LOW", "score": 15},
    "ECDHE-RSA-AES256-GCM-SHA384": {"risk": "HIGH", "score": 70},
    "ECDHE-RSA-AES128-GCM-SHA256": {"risk": "HIGH", "score": 72},
    "RSA-AES256-GCM-SHA384": {"risk": "CRITICAL", "score": 90},
}

RECOMMENDATIONS_MAP = {
    "CRITICAL": [
        "URGENT: Replace RSA/DSA certificates with CRYSTALS-Dilithium or hybrid PQC scheme",
        "Migrate key exchange to CRYSTALS-Kyber (NIST FIPS 203)",
        "Implement crypto-agility framework for rapid algorithm transition",
        "Rotate all long-term cryptographic keys immediately",
        "Conduct full cryptographic inventory audit",
    ],
    "HIGH": [
        "Plan migration from elliptic curve to post-quantum key exchange",
        "Implement hybrid PQC+classical TLS (e.g., X25519+Kyber768)",
        "Upgrade certificate signatures to CRYSTALS-Dilithium",
        "Set 12-month migration timeline for all ECC-based systems",
        "Evaluate NIST PQC standards: Kyber, Dilithium, Falcon, SPHINCS+",
    ],
    "MEDIUM": [
        "Upgrade AES-128 to AES-256 for symmetric encryption",
        "Evaluate post-quantum migration roadmap",
        "Monitor NIST PQC standardization updates",
        "Test hybrid PQC solutions in staging environment",
    ],
    "LOW": [
        "Continue monitoring cryptographic standards",
        "Plan long-term migration to post-quantum algorithms",
        "Subscribe to NIST PQC update notifications",
    ],
    "SAFE": [
        "Maintain current post-quantum cryptographic configuration",
        "Document PQC implementation for compliance records",
        "Continue monitoring for new vulnerabilities",
    ],
}


async def scan_domain(domain: str) -> dict:
    """
    Perform TLS scan on a domain and analyze quantum vulnerability.
    Returns structured scan results.
    """
    # Clean domain
    domain = domain.replace("https://", "").replace("http://", "").split("/")[0]

    result = {
        "domain": domain,
        "tls_version": None,
        "cipher_suite": None,
        "key_exchange": None,
        "cert_signature": None,
        "cert_expiry": None,
        "cert_issuer": None,
        "hsts_enabled": False,
        "ocsp_stapling": False,
        "risk_level": "UNKNOWN",
        "risk_score": 0,
        "recommendations": [],
        "details": [],
        "error": None,
    }

    try:
        # Create SSL context
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE

        loop = asyncio.get_event_loop()
        
        def do_handshake():
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    tls_version = ssock.version()
                    cipher = ssock.cipher()
                    cert = ssock.getpeercert()
                    return tls_version, cipher, cert

        tls_version, cipher_info, cert = await loop.run_in_executor(None, do_handshake)

        # Parse TLS version
        result["tls_version"] = tls_version or "Unknown"

        # Parse cipher suite
        if cipher_info:
            result["cipher_suite"] = cipher_info[0] if cipher_info[0] else "Unknown"

        # Parse certificate
        if cert:
            # Expiry
            if "notAfter" in cert:
                try:
                    expiry = datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
                    result["cert_expiry"] = expiry.strftime("%Y-%m-%d")
                except Exception:
                    result["cert_expiry"] = cert.get("notAfter", "Unknown")

            # Issuer
            if "issuer" in cert:
                issuer_parts = dict(x[0] for x in cert["issuer"])
                result["cert_issuer"] = issuer_parts.get("organizationName", "Unknown")

            # Signature algorithm (derived from cipher info)
            if cipher_info and "RSA" in str(cipher_info):
                result["cert_signature"] = "RSA"
            elif cipher_info and "ECDSA" in str(cipher_info):
                result["cert_signature"] = "ECDSA"
            else:
                result["cert_signature"] = "Unknown"

        # Key exchange
        if cipher_info and cipher_info[0]:
            cipher_name = cipher_info[0].upper()
            if "ECDHE" in cipher_name:
                result["key_exchange"] = "ECDHE"
            elif "DHE" in cipher_name or "EDH" in cipher_name:
                result["key_exchange"] = "DHE"
            elif "RSA" in cipher_name and "ECDHE" not in cipher_name:
                result["key_exchange"] = "RSA"
            else:
                result["key_exchange"] = "Unknown"

        # Calculate quantum risk score
        risk_score, risk_level = calculate_risk(result)
        result["risk_score"] = risk_score
        result["risk_level"] = risk_level
        result["recommendations"] = RECOMMENDATIONS_MAP.get(risk_level, [])

        # Build details array
        result["details"] = build_details(result)

    except socket.timeout:
        result["error"] = "Connection timed out"
        result["risk_level"] = "UNKNOWN"
    except ssl.SSLError as e:
        result["error"] = f"SSL error: {str(e)}"
        result["risk_level"] = "UNKNOWN"
    except Exception as e:
        result["error"] = f"Scan failed: {str(e)}"
        result["risk_level"] = "UNKNOWN"

    return result


def calculate_risk(scan_data: dict) -> tuple[int, str]:
    """Calculate quantum risk score from scan results."""
    scores = []

    # Key exchange risk
    key_exchange = (scan_data.get("key_exchange") or "").upper()
    for algo, info in ALGORITHM_RISK.items():
        if algo in key_exchange:
            scores.append(info["score"])
            break

    # Certificate signature risk
    cert_sig = (scan_data.get("cert_signature") or "").upper()
    for algo, info in ALGORITHM_RISK.items():
        if algo in cert_sig:
            scores.append(info["score"])
            break

    # Cipher suite risk
    cipher = scan_data.get("cipher_suite") or ""
    if cipher in CIPHER_RISK:
        scores.append(CIPHER_RISK[cipher]["score"])
    elif "AES-128" in cipher or "AES128" in cipher:
        scores.append(35)
    elif "AES-256" in cipher or "AES256" in cipher:
        scores.append(15)

    # TLS version penalty
    tls_ver = scan_data.get("tls_version") or ""
    if "1.0" in tls_ver or "1.1" in tls_ver:
        scores.append(85)
    elif "1.2" in tls_ver:
        scores.append(30)

    if not scores:
        return 50, "MEDIUM"

    final_score = max(scores)  # Take worst case

    if final_score >= 85:
        return final_score, "CRITICAL"
    elif final_score >= 65:
        return final_score, "HIGH"
    elif final_score >= 35:
        return final_score, "MEDIUM"
    elif final_score >= 10:
        return final_score, "LOW"
    else:
        return final_score, "SAFE"


def build_details(scan_data: dict) -> list:
    """Build structured details array for display."""
    details = []

    if scan_data.get("tls_version"):
        tls = scan_data["tls_version"]
        status = "safe" if "1.3" in tls else ("warning" if "1.2" in tls else "danger")
        details.append({"label": "TLS Version", "value": tls, "status": status})

    if scan_data.get("key_exchange"):
        kex = scan_data["key_exchange"]
        status = "danger" if "RSA" in kex.upper() else "warning"
        details.append({"label": "Key Exchange", "value": kex, "status": status})

    if scan_data.get("cipher_suite"):
        details.append({"label": "Cipher Suite", "value": scan_data["cipher_suite"], "status": "info"})

    if scan_data.get("cert_signature"):
        sig = scan_data["cert_signature"]
        status = "danger" if "RSA" in sig.upper() else ("warning" if "ECDSA" in sig.upper() else "info")
        details.append({"label": "Certificate Signature", "value": sig, "status": status})

    if scan_data.get("cert_expiry"):
        details.append({"label": "Certificate Expiry", "value": scan_data["cert_expiry"], "status": "info"})

    if scan_data.get("cert_issuer"):
        details.append({"label": "Certificate Issuer", "value": scan_data["cert_issuer"], "status": "info"})

    details.append({"label": "HSTS Enabled", "value": "Yes" if scan_data.get("hsts_enabled") else "No",
                    "status": "safe" if scan_data.get("hsts_enabled") else "warning"})

    return details
