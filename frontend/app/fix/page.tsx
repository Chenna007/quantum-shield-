'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Wrench, Calendar, ClipboardList, Rocket, ChevronRight, Check, Shield } from 'lucide-react';

const services = [
  {
    id: 'consult',
    icon: Calendar,
    title: 'Schedule Consultation',
    price: 'Free',
    desc: '30-minute session with a quantum cryptography expert to assess your situation and create an action plan.',
    color: '#3B82F6',
    features: ['Risk overview', 'Prioritization guidance', 'Migration timeline', 'Q&A session'],
  },
  {
    id: 'audit',
    icon: ClipboardList,
    title: 'Security Audit',
    price: 'From $2,500',
    desc: 'Comprehensive audit of your entire cryptographic infrastructure with detailed remediation roadmap.',
    color: '#7C3AED',
    features: ['Full infra assessment', 'Algorithm inventory', 'Risk scoring', 'Written report', 'Executive summary'],
    popular: true,
  },
  {
    id: 'migration',
    icon: Rocket,
    title: 'Quantum-Safe Migration',
    price: 'Custom pricing',
    desc: 'End-to-end migration service. Our engineers handle everything — from planning to deployment of PQC algorithms.',
    color: '#10B981',
    features: ['Implementation', 'Key management', 'TLS upgrade', 'CI/CD integration', 'Staff training', 'Post-migration monitoring'],
  },
];

export default function FixPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', domain: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitted(true);
  };

  return (
    <AppLayout title="Fix My Security">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#3B82F6]/10 border border-[#7C3AED]/20 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-[#7C3AED]/20 rounded-2xl flex items-center justify-center">
              <Wrench size={26} className="text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">We Fix It For You</h2>
              <p className="text-white/50 leading-relaxed max-w-xl">
                Our quantum cryptography experts handle the entire migration process — from identifying vulnerabilities to deploying post-quantum safe algorithms in production.
              </p>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {services.map((svc) => (
            <div
              key={svc.id}
              onClick={() => setSelected(svc.id)}
              className={`relative bg-[#0D1121] rounded-2xl p-5 border cursor-pointer transition-all ${
                selected === svc.id
                  ? 'border-[#7C3AED]/60 shadow-lg shadow-[#7C3AED]/10'
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {svc.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
              )}
              {selected === svc.id && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-[#7C3AED] rounded-full flex items-center justify-center">
                  <Check size={12} />
                </div>
              )}

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: svc.color + '20', color: svc.color }}>
                <svc.icon size={18} />
              </div>
              <h3 className="font-semibold mb-1">{svc.title}</h3>
              <div className="text-sm font-bold mb-2" style={{ color: svc.color }}>{svc.price}</div>
              <p className="text-xs text-white/40 mb-4 leading-relaxed">{svc.desc}</p>
              <div className="space-y-1.5">
                {svc.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-white/60">
                    <Check size={11} style={{ color: svc.color }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Request Form */}
        {!submitted ? (
          <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Shield size={18} className="text-[#3B82F6]" />
              Request Enterprise Support
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Jane Smith' },
                  { key: 'company', label: 'Company', placeholder: 'Acme Corp' },
                  { key: 'email', label: 'Work Email', placeholder: 'jane@acme.com' },
                  { key: 'domain', label: 'Primary Domain', placeholder: 'acme.com' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">{field.label}</label>
                    <input
                      type={field.key === 'email' ? 'email' : 'text'}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Describe your security needs</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your infrastructure, current cryptography setup, and what you need help with..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors resize-none"
                />
              </div>

              {selected && (
                <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl px-4 py-3 text-sm text-white/60">
                  Selected service: <span className="text-[#A78BFA] font-medium">{services.find((s) => s.id === selected)?.title}</span>
                </div>
              )}

              <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90">
                Submit Request
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#0D1121] border border-[#10B981]/30 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-[#10B981]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
            <p className="text-white/40 text-sm max-w-sm mx-auto">
              Our security team will review your request and reach out within 1 business day to schedule your engagement.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
