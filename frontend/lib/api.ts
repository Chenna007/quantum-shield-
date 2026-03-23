import Cookies from 'js-cookie';

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user store (browsing session)
const getMockUser = () => ({
  id: 'user_123',
  name: 'Demo User',
  email: 'demo@quantumshield.com',
  company: 'Quantum Innovations Ltd.',
});

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  signup: async (data: any) => {
    await delay(1000);
    Cookies.set('qs_token', 'mock_token_abc123');
    return { data: { user: { ...getMockUser(), ...data }, token: 'mock_token_abc123' } };
  },
  login: async (data: any) => {
    await delay(800);
    Cookies.set('qs_token', 'mock_token_abc123');
    return { data: { user: getMockUser(), token: 'mock_token_abc123' } };
  },
  me: async () => {
    await delay(300);
    return { data: getMockUser() };
  },
};

// ── Scanner ───────────────────────────────────────────────
export const scannerApi = {
  scan: async (domain: string) => {
    await delay(2500); // Scans take longer
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore > 70 ? 'CRITICAL' : riskScore > 40 ? 'HIGH' : riskScore > 20 ? 'MEDIUM' : 'LOW';
    
    return {
      data: {
        id: Math.random().toString(36).substring(7),
        domain,
        tls_version: 'TLS 1.2',
        cipher_suite: 'ECDHE-RSA-AES128-GCM-SHA256',
        key_exchange: 'RSA 2048-bit (Vulnerable)',
        cert_signature: 'sha256WithRSAEncryption',
        cert_expiry: '2025-12-31',
        risk_score: riskScore,
        risk_level: riskLevel,
        recommendations: [
          'Upgrade to TLS 1.3 to support modern cipher suites.',
          'Replace RSA-2048 with CRYSTALS-Kyber for quantum-resistant key exchange.',
          'Update root certificates to support post-quantum signatures.',
        ],
        details: [
          { label: 'Protocols', value: 'TLS 1.0, 1.1, 1.2', status: 'warning' },
          { label: 'Key Exchange', value: 'RSA 2048-bit', status: 'danger' },
          { label: 'Cipher Suite', value: 'AES-128-GCM', status: 'warning' },
          { label: 'PQC Readiness', value: 'Non-compliant', status: 'danger' },
        ],
      },
    };
  },
  history: async (limit = 20) => {
    await delay(500);
    return {
      data: Array.from({ length: limit }).map((_, i) => ({
        id: `scan_${i}`,
        domain: ['google.com', 'github.com', 'microsoft.com', 'amazon.com', 'apple.com'][i % 5],
        risk_score: [85, 42, 12, 67, 91][i % 5],
        risk_level: ['CRITICAL', 'MEDIUM', 'SAFE', 'HIGH', 'CRITICAL'][i % 5],
        tls_version: 'TLS 1.2',
        cipher_suite: 'AES-128-GCM',
        created_at: new Date(Date.now() - i * 86400000).toISOString(),
      })),
    };
  },
  getScan: async (id: string) => {
    await delay(500);
    return {
      data: {
        id,
        domain: 'example.com',
        risk_score: 65,
        risk_level: 'HIGH',
      },
    };
  },
};

// ── Reports ───────────────────────────────────────────────
export const reportsApi = {
  list: async (limit = 50) => {
    await delay(600);
    return {
      data: {
        reports: Array.from({ length: 15 }).map((_, i) => ({
          id: `report_${i}`,
          domain: `enterprise-${i}.network`,
          risk_score: Math.floor(Math.random() * 100),
          risk_level: i % 3 === 0 ? 'CRITICAL' : i % 3 === 1 ? 'HIGH' : 'MEDIUM',
          tls_version: 'TLS 1.2',
          cipher_suite: 'ECDHE-RSA-AES256-SHA384',
          created_at: new Date(Date.now() - i * 3600000 * 5).toISOString(),
        })),
      },
    };
  },
  stats: async () => {
    await delay(400);
    return {
      data: {
        total_scans: 124,
        this_month: 28,
        avg_risk_score: 42,
        by_risk_level: {
          CRITICAL: 12,
          HIGH: 24,
          MEDIUM: 45,
          LOW: 30,
          SAFE: 13,
        },
      },
    };
  },
  exportCsv: async (scanId: string) => {
    await delay(1000);
    return { data: new Blob(['mock,csv,data'], { type: 'text/csv' }) };
  },
  exportPdf: async (scanId: string) => {
    await delay(1500);
    return { data: new Blob(['mock pdf data'], { type: 'application/pdf' }) };
  },
};

// ── Alerts ────────────────────────────────────────────────
export const alertsApi = {
  list: async (unreadOnly = false) => {
    await delay(400);
    const allAlerts = [
      {
        id: 'alt_1',
        alert_type: 'CRITICAL',
        domain: 'api.production.internal',
        title: 'Quantum Vulnerability Detected',
        description: 'Hardcoded RSA-2048 keys found in handshake configuration.',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 'alt_2',
        alert_type: 'HIGH',
        domain: 'auth.service.com',
        title: 'Weak Cipher Suite',
        description: 'Server supports 3DES which is vulnerable to Sweet32.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    return { data: unreadOnly ? allAlerts.filter(a => !a.is_read) : allAlerts };
  },
  markRead: async (id: string) => {
    await delay(200);
    return { data: { success: true } };
  },
  markAllRead: async () => {
    await delay(500);
    return { data: { success: true } };
  },
};

// ── Subscriptions ─────────────────────────────────────────
export const subscriptionsApi = {
  create: async (plan: string) => {
    await delay(2000);
    return { data: { success: true, plan } };
  },
  cancel: async () => {
    await delay(1000);
    return { data: { success: true } };
  },
  status: async () => {
    await delay(300);
    return { data: { plan: 'FREE', status: 'active' } };
  },
};

// ── Contact ───────────────────────────────────────────────
export const contactApi = {
  submit: async (data: any) => {
    await delay(1000);
    return { data: { success: true } };
  },
};

// ── Fix My Security ───────────────────────────────────────
export const fixApi = {
  submit: async (data: any) => {
    await delay(1200);
    return { data: { success: true, request_id: 'fix_999' } };
  },
  myRequests: async () => {
    await delay(500);
    return { data: [] };
  },
};

// ── Assets ────────────────────────────────────────────────
export const assetsApi = {
  list: async () => {
    await delay(600);
    return {
      data: [
        { id: 1, name: 'Main Corporate Website', address: 'quantumshield.com', type: 'domain', risk_level: 'SAFE', last_scan: new Date().toISOString(), vulnerabilities: 0, readiness: 98 },
        { id: 2, name: 'API Gateway - Prod', address: 'api.quantumshield.com', type: 'domain', risk_level: 'HIGH', last_scan: new Date(Date.now() - 86400000).toISOString(), vulnerabilities: 3, readiness: 65 },
        { id: 3, name: 'Customer Portal', address: 'portal.quantumshield.com', type: 'domain', risk_level: 'MEDIUM', last_scan: new Date(Date.now() - 172800000).toISOString(), vulnerabilities: 1, readiness: 82 },
        { id: 4, name: 'Internal Auth Server', address: '10.0.4.22', type: 'ip', risk_level: 'CRITICAL', last_scan: new Date(Date.now() - 3600000 * 5).toISOString(), vulnerabilities: 5, readiness: 30 },
        { id: 5, name: 'Legacy Data Vault', address: 'vault-legacy.internal', type: 'domain', risk_level: 'HIGH', last_scan: new Date(Date.now() - 604800000).toISOString(), vulnerabilities: 8, readiness: 45 },
        { id: 6, name: 'Cloud Storage Bridge', address: 'storage.quantumshield.com', type: 'domain', risk_level: 'SAFE', last_scan: new Date().toISOString(), vulnerabilities: 0, readiness: 95 },
      ]
    };
  }
};

const api = {
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
};

export default api;


