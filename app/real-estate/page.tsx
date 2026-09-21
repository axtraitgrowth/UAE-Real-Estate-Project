import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { AXTRAIT_OFFER } from "@/config/offer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  Building2,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "UAE Real Estate Lead Generation & CRM System | AXTRAIT",
  description:
    "AXTRAIT helps UAE real-estate companies generate, capture and manage qualified leads through custom landing pages, paid acquisition, and CRM systems.",
};

export default function RealEstateSolutionPage() {
  const { company, offerName, coreStages, optionalAddons, targetSegments } = AXTRAIT_OFFER;

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 selection:bg-[#B39266]/25 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#1E2638] bg-[#0B0E14]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/real-estate" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#B39266] text-xs font-black text-[#0B0E14]">
              AX
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-white">AXTRAIT</span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A880]">
                Growth Engineering
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <a href="#problem" className="hover:text-[#C5A880] transition-colors">The Challenge</a>
            <a href="#system" className="hover:text-[#C5A880] transition-colors">8-Stage System</a>
            <a href="#segments" className="hover:text-[#C5A880] transition-colors">Who We Help</a>
            <a href="#deliverables" className="hover:text-[#C5A880] transition-colors">What We Build</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Client Portal
              </Button>
            </Link>
            <a href="#contact">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Request Sales Audit
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-[#1E2638] py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded border border-[#B39266]/30 bg-[#B39266]/10 px-3 py-1 text-[11px] font-mono text-[#C5A880]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              <span>SPECIALIZED FOR UAE REAL ESTATE MARKET</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Predictable Lead Generation & CRM Infrastructure for Dubai Real Estate.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {company.positioningStatement}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a href="#contact">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Schedule 15-Min Discovery Call
                </Button>
              </a>
              <a href="#system">
                <Button variant="secondary" size="lg">
                  Explore The 8-Stage Architecture
                </Button>
              </a>
            </div>

            <div className="pt-6 border-t border-[#1E2638] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-400">
              <div>
                <p className="font-mono text-white text-base font-bold">&lt; 60s</p>
                <p className="text-[11px] text-slate-400">Lead Assignment SLA</p>
              </div>
              <div>
                <p className="font-mono text-white text-base font-bold">100%</p>
                <p className="text-[11px] text-slate-400">Attribution Transparency</p>
              </div>
              <div>
                <p className="font-mono text-white text-base font-bold">Meta + Google</p>
                <p className="text-[11px] text-slate-400">Paid Media Engine</p>
              </div>
              <div>
                <p className="font-mono text-white text-base font-bold">DLD / RERA</p>
                <p className="text-[11px] text-slate-400">Regulatory Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Real Estate Problem Section */}
      <section id="problem" className="border-b border-[#1E2638] py-16 bg-[#07090E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">The Market Friction</p>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Why Generic Marketing Fails UAE Real Estate Companies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Most property developers and brokerages burn marketing budgets on uncoordinated digital services that leak buyers at every handover point.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-rose-900/30">
              <CardHeader>
                <div className="flex h-9 w-9 items-center justify-center rounded bg-rose-950/40 text-rose-400 border border-rose-800/40 mb-2">
                  1
                </div>
                <CardTitle className="text-base">Disconnected Traffic</CardTitle>
                <CardDescription>
                  Ad agencies drive clicks to generic portals or slow websites. There is no dedicated project narrative, zero mobile conversion focus, and no verified buyer qualification.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-rose-900/30">
              <CardHeader>
                <div className="flex h-9 w-9 items-center justify-center rounded bg-rose-950/40 text-rose-400 border border-rose-800/40 mb-2">
                  2
                </div>
                <CardTitle className="text-base">Lead Decay & No Follow-Up</CardTitle>
                <CardDescription>
                  In Dubai, a lead not contacted within 15 minutes is 70% less likely to convert. Leads sit in email inboxes or WhatsApp groups without automated distribution or manager tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-rose-900/30">
              <CardHeader>
                <div className="flex h-9 w-9 items-center justify-center rounded bg-rose-950/40 text-rose-400 border border-rose-800/40 mb-2">
                  3
                </div>
                <CardTitle className="text-base">Zero Revenue Attribution</CardTitle>
                <CardDescription>
                  Leadership cannot tell which campaign, creative, or agent generated signed Sale & Purchase Agreements (SPA). Marketing blames sales; sales blames lead quality.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* The Core 8-Stage Closed-Loop System */}
      <section id="system" className="border-b border-[#1E2638] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#C5A880]">The AXTRAIT Solution</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The 8-Stage Real Estate Lead-to-CRM Closed-Loop System
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We engineer every link in the chain—from the first ad impression on Instagram or Google through to the signed contract in your CRM.
            </p>
          </div>

          {/* System Process Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreStages.map((stage) => (
              <Card key={stage.id} className="relative flex flex-col justify-between hover:border-[#B39266]/50 transition-colors">
                <CardHeader className="p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-[#151B28] text-xs font-mono font-bold text-[#C5A880] border border-[#232C42]">
                      0{stage.step}
                    </span>
                    <Badge variant="neutral" size="sm">
                      {stage.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm sm:text-base font-semibold text-white">
                    {stage.name}
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {stage.shortDescription}
                  </p>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 pt-0 border-t border-[#1E2638] mt-3">
                  <div className="pt-3 space-y-2">
                    <p className="text-[10px] font-mono uppercase text-[#C5A880] font-semibold">Primary Output:</p>
                    <p className="text-xs font-mono text-slate-300">{stage.keyMetric}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Optional Advanced Add-on Banner */}
          <div className="mt-8 rounded-lg border border-[#232C42] bg-[#10141E] p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A880]" />
                  <h3 className="text-sm font-semibold text-white">
                    {optionalAddons[0].name}
                  </h3>
                  <Badge variant="brass" size="sm">Optional Upgrade</Badge>
                </div>
                <p className="text-xs text-slate-400 max-w-2xl">
                  {optionalAddons[0].shortDescription} Positioned strictly as an advanced tier once your fundamental lead-to-CRM system is operating cleanly.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400 self-start md:self-auto shrink-0">
                <span>Multi-Language • 24/7 Response • WhatsApp Business</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Segments Section */}
      <section id="segments" className="border-b border-[#1E2638] py-20 bg-[#07090E]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">Market Focus</p>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              Engineered for Three Real Estate Operators
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Every segment requires a specialized operational architecture. We tailor the funnel to your specific commercial model.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {targetSegments.map((segment) => (
              <Card key={segment.id} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#C5A880]" />
                    <CardTitle className="text-lg">{segment.title}</CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-400">
                    {segment.subtitle}
                  </CardDescription>

                  <div className="mt-4 pt-4 border-t border-[#1E2638] space-y-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      Core Friction Solved:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {segment.primaryPains.slice(0, 3).map((pain, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1E2638] space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#C5A880] font-semibold">
                      AXTRAIT System Deployment:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {segment.solutionFocus.map((sol, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="rounded bg-[#0B0E14] p-3 border border-[#1E2638] text-xs text-slate-300 italic">
                    &quot;{segment.positioningHook}&quot;
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables Breakdown */}
      <section id="deliverables" className="border-b border-[#1E2638] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">Scope & Deliverables</p>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
              What We Actually Build and Hand Over
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              No vague retainer promises. You receive concrete, measurable sales infrastructure that your team owns.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C5A880]" />
                  <CardTitle className="text-base">Front-End Acquisition Layer</CardTitle>
                </div>
                <CardDescription>Everything required to drive and convert high-intent traffic.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom responsive project landing page (speed optimized for mobile 5G)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Meta Ads Manager & Google Ads account architecture with Conversion API</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>High-yield video renders and architectural carousel ad creatives</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Multi-step investor qualification forms with phone verification</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#C5A880]" />
                  <CardTitle className="text-base">Back-End Sales Operations Layer</CardTitle>
                </div>
                <CardDescription>Everything required to supervise, route, and close leads.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Custom CRM pipeline setup tailored to Dubai property buying milestones</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Under-60-second automated round-robin lead routing engine</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Instant WhatsApp alerts to assigned brokers with full lead profile</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time marketing-to-SPA revenue attribution dashboard</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="contact" className="py-20 bg-[#07090E]">
        <div className="mx-auto max-w-4xl px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded border border-[#B39266]/30 bg-[#B39266]/10 px-3 py-1 text-[11px] font-mono text-[#C5A880]">
            <span>READY TO AUDIT YOUR LEAD FLOW?</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white">
            Schedule a 15-Minute Real Estate Sales Discovery Call
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            We will evaluate your current acquisition funnels, inspect your speed-to-lead response, and present 3 specific opportunities to increase qualified buyer conversions.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button variant="primary" size="lg" leftIcon={<PhoneCall className="w-4 h-4" />}>
                Request Prospect Audit & Discovery Call
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                View Supervision Demo Workspace
              </Button>
            </Link>
          </div>

          <div className="pt-8 border-t border-[#1E2638] flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <span>AXTRAIT Digital Growth FZ-LLC</span>
            <span>•</span>
            <span>Dubai, United Arab Emirates</span>
            <span>•</span>
            <span>Zero Long-Term Lock-in</span>
          </div>
        </div>
      </section>
    </div>
  );
}
