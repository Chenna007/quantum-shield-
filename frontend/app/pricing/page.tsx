'use client';
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Check, Zap, Shield, Building2, ArrowRight } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 49, annual: 39 },
    icon: Zap,
    color: '#3B82F6',
    desc: 'Perfect for small teams and startups getting started with quantum security.',
    features: [
      '10 domain scans/month',
      'Basic risk reports',
      'Email alerts',
      'TLS version detection',
      'Cipher suite analysis',
      'PDF report export',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: { monthly: 199, annual: 159 },
    icon: Shield,
    color: '#7C3AED',
    desc: 'For growing organizations serious about quantum-safe security.',
    features: [
      '100 domain scans/month',
      'Advanced risk reports',
      'Real-time monitoring',
      'Priority email alerts',
      'CSV + PDF export',
      'Risk trend analysis',
      'API access',
      'Slack integration',
    ],
    cta: 'Get Professional',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 999, annual: 799 },
    icon: Building2,
    color: '#10B981',
    desc: 'Complete quantum security for large organizations and critical infrastructure.',
    features: [
      'Unlimited domain scans',
      'Infrastructure monitoring',
      'Priority 24/7 support',
      'Security consulting',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise option',
      'Custom reporting',
      'Quantum migration service',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <AppLayout title="Pricing">
      <div className="max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
          <p className="text-white/40 mb-6">Choose the plan that fits your organization's security needs</p>

          {/* Toggle */}
          <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? 'bg-[#3B82F6] text-white' : 'text-white/50 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? 'bg-[#3B82F6] text-white' : 'text-white/50 hover:text-white'}`}
            >
              Annual
              <span className="text-xs bg-[#10B981]/20 text-[#10B981] px-1.5 py-0.5 rounded">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-[#0D1121] rounded-2xl p-6 border transition-all ${plan.popular
                  ? 'border-[#7C3AED]/50 shadow-lg shadow-[#7C3AED]/10'
                  : 'border-white/5 hover:border-white/10'
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: plan.color + '20', color: plan.color }}>
                  <plan.icon size={18} />
                </div>
                <span className="font-bold text-lg">{plan.name}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${annual ? plan.price.annual : plan.price.monthly}</span>
                  <span className="text-white/40">/month</span>
                </div>
                {annual && (
                  <div className="text-xs text-[#10B981] mt-1">Billed annually (${(annual ? plan.price.annual : plan.price.monthly) * 12}/yr)</div>
                )}
              </div>

              <p className="text-white/40 text-sm mb-6">{plan.desc}</p>

              <div className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm text-white/70">
                    <Check size={14} style={{ color: plan.color }} className="shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all"
                style={
                  plan.popular
                    ? { background: `linear-gradient(135deg, #3B82F6, #7C3AED)`, color: 'white' }
                    : { backgroundColor: plan.color + '20', color: plan.color, border: `1px solid ${plan.color}30` }
                }
              >
                {plan.cta}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Feature comparison note */}
        <div className="mt-10 bg-[#0D1121] border border-white/5 rounded-2xl p-6 text-center">
          <p className="text-white/40 text-sm">All plans include a 14-day free trial. No credit card required to start.</p>
          <p className="text-white/40 text-sm mt-1">
            Need a custom plan?{' '}
            <a href="/fix" className="text-[#3B82F6] hover:underline">Contact our sales team</a>
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
