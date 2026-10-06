'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  BookOpen, Star, CheckCircle2, CreditCard, Clock, IdCard,
  MessageCircle, Users, Shield, Bell, Instagram, Twitter, Facebook, Linkedin,
  TrendingUp, ArrowRight, Play, Building2, BarChart3, QrCode,
  ChevronRight, Menu, X, Sparkles, Zap, BookMarked, ChevronDown,
} from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
  { q: 'Kya main multiple library branches manage kar sakta hoon?', a: 'Bilkul! LibraryOS mein aap ek hi dashboard se unlimited branches manage kar sakte hain. Har branch ke liye alag inventory, members aur reports — sab ek account se.' },
  { q: 'Book return reminders kaise kaam karte hain?', a: 'Due date se 3 din pehle, 1 din pehle aur due date pe automatic WhatsApp reminder jaata hai. Late return pe fine bhi automatically calculate hota hai.' },
  { q: 'Kya digital library card print ho sakta hai?', a: 'Haan! Member photo, ID number, validity aur QR code ke saath professional library card ek click mein generate hota hai.' },
  { q: 'Agar member overdue book nahi lauta toh?', a: 'System automatic fine calculate karta hai aur escalation alerts bhejta hai. Member ka borrowing privilege bhi temporarily suspend ho sakta hai.' },
  { q: 'Kya ghar se library manage kar sakte hain?', a: 'Haan! 100% cloud-based hai. Mobile ya laptop — kahin se bhi real-time inventory, members aur reports dekh sakte hain.' },
  { q: 'New books catalog mein kaise add karte hain?', a: 'ISBN scan karo — book ka naam, author, genre, publisher sab automatically fill ho jaata hai. Manual entry bhi possible hai.' },
];

const features = [
  { title: 'Smart Book Catalog', desc: 'ISBN scan se instant book entry. Author, genre, publisher sab auto-fill. 10 lakh+ books.', icon: BookOpen, gradient: 'from-cyan-500 to-blue-600', glow: 'rgba(34,211,238,0.3)', delay: 0 },
  { title: 'Member Management', desc: 'Student, staff, VIP — alag membership plans. Photo ID card with QR code ek click mein.', icon: Users, gradient: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.3)', delay: 0.1 },
  { title: 'Issue & Return Tracking', desc: 'QR/barcode scan se instant checkout. Return due dates, overdue alerts sab automatic.', icon: QrCode, gradient: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.3)', delay: 0.2 },
  { title: 'Fee & Fine Collection', desc: 'Membership fee, late fine — dono track. Online ya cash. WhatsApp pe receipt auto-send.', icon: CreditCard, gradient: 'from-violet-500 to-purple-600', glow: 'rgba(139,92,246,0.3)', delay: 0.3 },
  { title: 'WhatsApp Automation', desc: 'Due reminders, new arrivals, event alerts — sab automatic WhatsApp pe. Zero effort.', icon: MessageCircle, gradient: 'from-green-500 to-emerald-600', glow: 'rgba(34,197,94,0.3)', delay: 0.4 },
  { title: 'Multi-Shift Reading Rooms', desc: 'Morning, Evening, Night — alag seats, fees, attendance. Ek dashboard se manage karo.', icon: Clock, gradient: 'from-cyan-500 to-indigo-600', glow: 'rgba(99,102,241,0.3)', delay: 0.5 },
  { title: 'Attendance & Analytics', desc: 'Daily footfall, peak hours, popular books — real-time insights for growth.', icon: BarChart3, gradient: 'from-rose-500 to-pink-600', glow: 'rgba(244,63,94,0.3)', delay: 0.6 },
  { title: 'Digital Library Cards', desc: 'QR-code powered smart cards. Scanner se instant member verify aur book issue.', icon: IdCard, gradient: 'from-amber-500 to-yellow-600', glow: 'rgba(245,158,11,0.3)', delay: 0.7 },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Librarian', org: 'Gyan Mandir Library, Delhi', text: 'Pehle book issue-return register mein likhna padta tha. Ab QR scan se 5 second mein ho jaata hai. WhatsApp pe reminder aata hai toh book time pe waapis aati hai.', rating: 5, books: '3,200', avatar: 'PS', color: 'from-cyan-400 to-blue-500' },
  { name: 'Ramesh Gupta', role: 'Owner', org: 'Success Library, Patna', text: 'Teen branches hain meri. Pehle teen alag registers the. Ab ek screen pe teeno ka data. Revenue bhi 40% badh gaya kyunki koi book ab kho nahi jaati.', rating: 5, books: '8,500', avatar: 'RG', color: 'from-violet-400 to-purple-500' },
  { name: 'Anita Joshi', role: 'Head Librarian', org: 'City Public Library, Pune', text: 'ISBN scan karke book add karo — naam, author, publisher sab auto-fill. ID card print, membership renew — sab ek jagah. Mera kaam half ho gaya.', rating: 5, books: '12,000', avatar: 'AJ', color: 'from-emerald-400 to-teal-500' },
];

const steps = [
  { step: '01', title: 'Library Setup Karo', desc: 'Naam, logo, branches, membership plans — 10 minute mein configure karo.' },
  { step: '02', title: 'Books Catalog Mein Daalo', desc: 'ISBN scan karo ya CSV upload karo. 10,000 books bhi 30 minute mein ready.' },
  { step: '03', title: 'Members Enroll Karo', desc: 'Photo, contact, plan select karo. Library card instantly generate.' },
  { step: '04', title: 'Issue & Return Start Karo', desc: 'QR scan se instant checkout. Due date set karo. Reminder automatic jaata hai.' },
  { step: '05', title: 'Reports & Growth Dekho', desc: 'Daily visitors, popular books, revenue trends — data se apni library grow karo.' },
];

const pricingPlans = [
  { name: 'Starter', price: '699', period: '/mo', desc: 'Naye libraries ke liye', savings: null, features: ['Up to 500 books', '100 members', 'WhatsApp alerts', 'Basic reports', 'Email support'], cta: 'Start Free Trial', popular: false },
  { name: 'Professional', price: '1,799', period: '/3mo', desc: 'Growing libraries ke liye', savings: 'Save Rs.297 vs monthly', features: ['Unlimited books', 'Unlimited members', 'WhatsApp + SMS alerts', 'Smart ID cards', 'QR checkout', 'Analytics dashboard', 'Priority support'], cta: 'Start 7-Day Free Trial', popular: true },
  { name: 'Enterprise', price: '3,299', period: '/6mo', desc: 'Multi-branch libraries ke liye', savings: 'Save Rs.895 vs monthly', features: ['Everything in Professional', 'Multi-branch support', 'Advanced analytics', 'Custom reports', 'Dedicated onboarding'], cta: 'Contact Sales', popular: false },
];

const CSS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; }
  .gradient-text { background: linear-gradient(135deg, #a78bfa 0%, #6366f1 40%, #22d3ee 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .dot-grid { background-image: radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px); background-size: 28px 28px; }
  .aurora-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .aurora-blob-1 { width: 800px; height: 800px; background: radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%); animation: aurora-move 12s ease-in-out infinite alternate; }
  .aurora-blob-2 { width: 600px; height: 600px; background: radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%); animation: aurora-move 15s ease-in-out infinite alternate-reverse; }
  .aurora-blob-3 { width: 500px; height: 500px; background: radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%); animation: aurora-move 10s ease-in-out infinite alternate; }
  @keyframes aurora-move { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(60px,40px) scale(1.1); } }
  .glass-card { background: rgba(15,15,30,0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.15); }
  .feature-card { background: rgba(10,10,25,0.7); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.05); transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
  .feature-card:hover { border-color: rgba(99,102,241,0.4); transform: translateY(-8px); box-shadow: 0 20px 60px rgba(99,102,241,0.15); }
  @keyframes float-1 { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-18px) rotate(2deg); } }
  @keyframes float-2 { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(-1deg); } }
  .anim-float-1 { animation: float-1 7s ease-in-out infinite; }
  .anim-float-2 { animation: float-2 5s ease-in-out infinite 1s; }
  .anim-float-3 { animation: float-1 9s ease-in-out infinite 2s; }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .shimmer-btn { background: linear-gradient(90deg, #6366f1, #8b5cf6, #22d3ee, #6366f1); background-size: 200% auto; animation: shimmer 3s linear infinite; }
  .glow-indigo { box-shadow: 0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.1); }
  .nav-link { position: relative; color: rgba(255,255,255,0.6); transition: color 0.2s; text-decoration: none; }
  .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: linear-gradient(90deg, #6366f1, #22d3ee); border-radius: 2px; transition: width 0.3s ease; }
  .nav-link:hover { color: #fff; }
  .nav-link:hover::after { width: 100%; }
  .pricing-popular { background: linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%); border: 1px solid rgba(99,102,241,0.4) !important; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #030712; }
  ::-webkit-scrollbar-thumb { background: #2d2d5e; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
  @keyframes badge-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); } }
  .badge-live { animation: badge-pulse 2s ease-in-out infinite; }
  .hero-mock { background: rgba(8,8,20,0.9); border: 1px solid rgba(99,102,241,0.2); border-radius: 16px; backdrop-filter: blur(20px); box-shadow: 0 40px 120px rgba(0,0,0,0.8), 0 0 60px rgba(99,102,241,0.1); }
  .faq-item { background: rgba(15,15,30,0.5); border: 1px solid rgba(255,255,255,0.05); transition: border-color 0.3s; }
  .faq-item:hover { border-color: rgba(99,102,241,0.3); }
  .faq-item[data-state='open'] { background: rgba(99,102,241,0.05); border-color: rgba(99,102,241,0.3); }
`;

const avatarColors = ['bg-gradient-to-br from-cyan-400 to-blue-500','bg-gradient-to-br from-violet-400 to-purple-500','bg-gradient-to-br from-emerald-400 to-teal-500','bg-gradient-to-br from-amber-400 to-orange-500','bg-gradient-to-br from-rose-400 to-pink-500'];

export default function LibraryOSLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | undefined>(undefined);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#030712]" />;

  return (
    <div className="bg-[#030712] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: CSS_STYLES }} />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-[#030712]/85 backdrop-blur-2xl border-b border-indigo-500/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-black tracking-tight">Library<span className="gradient-text">OS</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item, i) => (
              <a key={i} href={`#${['features','how','pricing','faq'][i]}`} className="nav-link text-sm font-medium">{item}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5">Sign In</Link>
            <Link href="/auth/login" className="shimmer-btn text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-[0.97]">Get Started Free</Link>
          </div>
          <button id="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#070718]/95 backdrop-blur-xl border-b border-indigo-500/10 px-6 pb-6">
              <div className="flex flex-col gap-4 pt-4">
                {['Features','How It Works','Pricing','FAQ'].map((item, i) => (
                  <a key={i} href={`#${['features','how','pricing','faq'][i]}`} onClick={() => setMobileMenuOpen(false)} className="text-slate-300 hover:text-white font-medium py-1">{item}</a>
                ))}
                <Link href="/auth/login" className="shimmer-btn text-white text-sm font-bold px-5 py-3 rounded-xl text-center mt-2">Get Started Free</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-60" />
        <div className="aurora-blob aurora-blob-1" style={{ top: '-200px', left: '-200px' }} />
        <div className="aurora-blob aurora-blob-2" style={{ top: '20%', right: '-150px' }} />
        <div className="aurora-blob aurora-blob-3" style={{ bottom: '10%', left: '20%' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#030712]" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full badge-live">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Trusted by 2,400+ Libraries Across India
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              The <span className="gradient-text">Smartest</span>
              <br />Library OS
              <br /><span className="text-3xl md:text-4xl font-bold text-slate-400">for Modern India</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
              Books manage karo, members track karo, WhatsApp automations chalao — sab ek powerful dashboard se. No register, no mess.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex flex-wrap gap-2">
              {['QR Checkout', 'WhatsApp Alerts', 'Smart ID Cards', 'Multi-Branch', 'Cloud-Based'].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  <CheckCircle2 size={11} />{f}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="flex flex-wrap gap-4 items-center">
              <Link id="hero-cta-btn" href="/auth/login" className="shimmer-btn text-white font-black text-base px-8 py-4 rounded-2xl glow-indigo hover:scale-105 active:scale-[0.97] transition-all duration-300 flex items-center gap-2">
                <Sparkles size={18} />Start Free Trial
              </Link>
              <button className="flex items-center gap-3 text-slate-300 hover:text-white font-semibold transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                  <Play size={16} className="ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['PS','RG','AJ','MK','SL'].map((init, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#030712] flex items-center justify-center text-[10px] font-black ${avatarColors[i]}`}>{init}</div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                  <span className="text-xs font-bold text-amber-400 ml-1">4.9/5</span>
                </div>
                <p className="text-xs text-slate-500">from 500+ library owners</p>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="hidden lg:block relative">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-600/20 rounded-full blur-2xl" />
            <div className="hero-mock p-4 anim-float-1">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-xs text-slate-500 font-mono">libraryos.app/dashboard</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Total Books', val: '12,847', change: '+124 this week', color: 'text-cyan-400', bg: 'rgba(34,211,238,0.1)' },
                  { label: 'Active Members', val: '1,293', change: '+18 today', color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)' },
                  { label: 'Due Today', val: '47', change: '12 overdue', color: 'text-amber-400', bg: 'rgba(245,158,11,0.1)' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: s.bg }}>
                    <div className="text-[10px] text-slate-400 font-medium mb-1">{s.label}</div>
                    <div className={`text-lg font-black ${s.color}`}>{s.val}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{s.change}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl overflow-hidden border border-white/5">
                <div className="bg-indigo-500/10 px-3 py-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Issues</span>
                  <span className="text-[9px] text-indigo-400 font-semibold">View All</span>
                </div>
                {[
                  { book: 'Wings of Fire', member: 'Ravi K.', due: 'Oct 3', status: 'Active', sc: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { book: 'Rich Dad Poor Dad', member: 'Sneha M.', due: 'Oct 1', status: 'Due Soon', sc: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { book: 'Atomic Habits', member: 'Arjun S.', due: 'Sep 28', status: 'Overdue', sc: 'text-rose-400', bg: 'bg-rose-500/10' },
                  { book: 'The Alchemist', member: 'Priya R.', due: 'Oct 8', status: 'Active', sc: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-t border-white/5">
                    <div>
                      <div className="text-[11px] font-semibold text-white">{row.book}</div>
                      <div className="text-[9px] text-slate-500">{row.member} · Due {row.due}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${row.sc} ${row.bg}`}>{row.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -left-14 top-1/3 glass-card rounded-2xl p-3 anim-float-2 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Bell size={14} className="text-emerald-400" /></div>
                <div><div className="text-[10px] font-bold text-white">WhatsApp Sent</div><div className="text-[9px] text-emerald-400">47 reminders today</div></div>
              </div>
            </div>
            <div className="absolute -right-12 bottom-1/4 glass-card rounded-2xl p-3 anim-float-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center"><QrCode size={14} className="text-violet-400" /></div>
                <div><div className="text-[10px] font-bold text-white">QR Scanned</div><div className="text-[9px] text-violet-400">23 checkouts today</div></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-slate-500 font-medium">Scroll to explore</span>
          <ChevronDown size={16} className="text-slate-500 animate-bounce" />
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-14 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-transparent to-violet-950/30" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 2400, suffix: '+', label: 'Libraries Trust Us', dec: 0 },
              { value: 18, suffix: 'L+', label: 'Books Catalogued', dec: 0 },
              { value: 99.9, suffix: '%', label: 'Uptime SLA', dec: 1 },
              { value: 40, suffix: '%', label: 'Revenue Increase', dec: 0 },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-4xl md:text-5xl font-black gradient-text mb-1">
                  <CountUp end={stat.value} duration={2.5} decimals={stat.dec} suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
                </div>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 relative">
        <div className="aurora-blob aurora-blob-2" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.5 }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-bold uppercase tracking-widest mb-3 block">Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Library ka poora <span className="gradient-text">ecosystem</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Ek platform — books se leke members, fees se leke analytics. Sab kuch.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: f.delay }} className="feature-card rounded-2xl p-6 group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} p-0.5 mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: `0 8px 24px ${f.glow}` }}>
                  <div className="w-full h-full bg-[#080818] rounded-[10px] flex items-center justify-center">
                    <f.icon size={22} className="text-white" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-3 block">Simple Setup</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">5 steps mein <span className="gradient-text">live ho jao</span></h2>
            <p className="text-slate-400 text-lg">Setup se launch tak — sirf kuch ghante</p>
          </motion.div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="glass-card rounded-2xl p-6 flex items-start gap-6 group hover:border-indigo-500/30 transition-colors cursor-pointer">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/25 flex items-center justify-center group-hover:from-indigo-500/30 group-hover:to-violet-500/30 transition-all">
                  <span className="text-sm font-black text-indigo-300">{step.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
                <ChevronRight size={20} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 relative">
        <div className="aurora-blob aurora-blob-1" style={{ bottom: 0, right: 0, opacity: 0.3 }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3 block">Real Stories</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Library owners <span className="gradient-text">love us</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="glass-card rounded-3xl p-7 flex flex-col gap-5 hover:border-indigo-500/25 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-black text-white shadow-lg`}>{t.avatar}</div>
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black gradient-text">{t.books}</div>
                    <div className="text-[10px] text-slate-500">books</div>
                  </div>
                </div>
                <div className="flex gap-0.5">{[...Array(t.rating)].map((_, j) => <Star key={j} size={13} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="text-xs text-slate-500 font-medium border-t border-white/5 pt-4">{t.org}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 relative">
        <div className="absolute inset-0 dot-grid opacity-25" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-3 block">Transparent Pricing</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Apni library ke liye <span className="gradient-text">sahi plan</span> chuno</h2>
            <p className="text-slate-400 text-lg">7-day free trial. No credit card required.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={`relative rounded-3xl p-7 flex flex-col ${plan.popular ? 'pricing-popular' : 'glass-card'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="shimmer-btn text-white text-xs font-black px-4 py-1.5 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-5xl font-black ${plan.popular ? 'gradient-text' : 'text-white'}`}>Rs.{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                {plan.savings && <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full inline-block mb-5">{plan.savings}</span>}
                <div className="h-px bg-white/5 my-5" />
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 size={15} className="text-indigo-400 shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/login" className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all active:scale-[0.98] block ${plan.popular ? 'shimmer-btn text-white glow-indigo' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 relative">
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-violet-400 text-sm font-bold uppercase tracking-widest mb-3 block">Got Questions?</span>
            <h2 className="text-4xl md:text-5xl font-black mb-4"><span className="gradient-text">Aksar pooche</span> jaane waale sawaal</h2>
          </motion.div>
          <Accordion.Root type="single" collapsible value={openFaq} onValueChange={setOpenFaq} className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Accordion.Item value={`item-${i}`} className="faq-item rounded-2xl overflow-hidden">
                  <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left group">
                    <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                    <ChevronDown size={18} className="text-indigo-400 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                  <Accordion.Content className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">{faq.a}</Accordion.Content>
                </Accordion.Item>
              </motion.div>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="aurora-blob aurora-blob-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-3xl p-12 md:p-16">
            <span className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/25 text-indigo-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
              <Zap size={12} className="text-amber-400" />7-Day Free Trial — No Credit Card
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-5">Apni library ko <span className="gradient-text">future-ready</span> banao aaj</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">2,400+ library owners ka trust. 10 minutes mein setup. Results pehle din se.</p>
            <Link href="/auth/login" className="shimmer-btn text-white font-black text-lg px-10 py-4 rounded-2xl glow-indigo hover:scale-105 active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-2">
              <Sparkles size={20} />Start For Free<ArrowRight size={18} />
            </Link>
            <p className="text-xs text-slate-500 mt-6">No setup fee. Cancel anytime. 24/7 support.</p>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-[#020610]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center"><BookOpen size={18} className="text-white" /></div>
              <span className="text-lg font-black">Library<span className="gradient-text">OS</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              {['Privacy Policy','Terms of Service','Contact','Blog'].map((l) => <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>)}
            </div>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all"><Icon size={15} /></a>
              ))}
            </div>
          </div>
          <div className="text-center mt-8 text-xs text-slate-600">2026 LibraryOS. All rights reserved. Made with love in India.</div>
        </div>
      </footer>
    </div>
  );
}