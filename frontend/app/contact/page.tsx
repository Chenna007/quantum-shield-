'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Mail, Building, Globe, MessageSquare, ArrowRight, Check, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', domain: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AppLayout title="Contact">
      <div className="max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Get in Touch</h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Our team of quantum security experts is ready to help you prepare for the post-quantum era.
              </p>
            </div>

            {[
              { icon: Mail, label: 'Email', value: 'security@quantumshield.io', color: '#3B82F6' },
              { icon: Phone, label: 'Phone', value: '+1 (888) QTM-SAFE', color: '#7C3AED' },
              { icon: MapPin, label: 'HQ', value: 'San Francisco, CA', color: '#10B981' },
            ].map((c) => (
              <div key={c.label} className="bg-[#0D1121] border border-white/5 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: c.color + '20', color: c.color }}>
                  <c.icon size={16} />
                </div>
                <div>
                  <div className="text-xs text-white/30">{c.label}</div>
                  <div className="text-sm font-medium">{c.value}</div>
                </div>
              </div>
            ))}

            <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-5">
              <div className="text-xs text-white/40 mb-2">Response Time</div>
              <div className="text-sm font-medium text-[#10B981]">Within 4 business hours</div>
              <div className="text-xs text-white/30 mt-1">Enterprise: 1 business hour SLA</div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {!submitted ? (
              <div className="bg-[#0D1121] border border-white/5 rounded-2xl p-7">
                <h3 className="font-semibold text-lg mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { key: 'name', label: 'Full Name', icon: Building, placeholder: 'John Smith' },
                      { key: 'company', label: 'Company', icon: Building, placeholder: 'Acme Corporation' },
                      { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'john@acme.com' },
                      { key: 'domain', label: 'Domain / Infrastructure', icon: Globe, placeholder: 'acme.com' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-xs font-medium text-white/50 mb-1.5">{field.label}</label>
                        <div className="relative">
                          <field.icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                          <input
                            type={field.key === 'email' ? 'email' : 'text'}
                            placeholder={field.placeholder}
                            value={form[field.key as keyof typeof form]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Message</label>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3 top-3.5 text-white/20" />
                      <textarea
                        rows={5}
                        placeholder="Describe your security concerns, current infrastructure, or questions for our team..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-[#3B82F6]/50 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-[#0D1121] border border-[#10B981]/30 rounded-2xl p-16 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-4">
                  <Check size={28} className="text-[#10B981]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-white/40 text-sm max-w-xs">
                  Thank you for reaching out. Our security team will respond within 4 business hours.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
