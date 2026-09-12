import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaGraduationCap, FaUsers, FaProjectDiagram, FaRocket,
  FaLinkedin, FaYoutube, FaInstagram, FaTwitter, FaGithub,
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle,
  FaArrowRight, FaDownload, FaBook, FaTimes, FaChartBar, FaBookOpen
} from 'react-icons/fa';
import InstituteNavbar from '../components/common/InstituteNavbar';
import HomeRadar from '../components/common/HomeRadar';
import PillarsSection from '../components/home/PillarsSection';
import ProgramsSection from '../components/home/ProgramsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

// ─────────────────────── DATA ───────────────────────

const PROGRAMS = [
  {
    id: 'fullstack',
    icon: <FaBookOpen size={24} />,
    bannerColor: 'linear-gradient(90deg, #15803D, #34d399)',
    title: 'Full-Stack Web Development',
    duration: '6 Months | Hybrid (Online + Offline)',
    description:
      'Master the complete web development ecosystem—from crafting responsive frontends to building production-grade APIs and deploying on cloud infrastructure. You will graduate with a portfolio of real-world applications.',
    skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'React 18', 'Node.js', 'PostgreSQL', 'Docker', 'Git & CI/CD'],
    syllabus: [
      { unit: 'Unit 1', title: 'Web Foundations', topics: 'HTML5 Semantics, CSS3 Flexbox & Grid, Responsive Design Principles' },
      { unit: 'Unit 2', title: 'JavaScript Mastery', topics: 'ES6+, Async/Await, Closures, Prototypes, DOM Manipulation' },
      { unit: 'Unit 3', title: 'React Engineering', topics: 'React 18, Hooks, State Management, React Router, Vite' },
      { unit: 'Unit 4', title: 'Backend with Node.js & Python', topics: 'Express APIs, FastAPI, REST Architecture, Middleware, Auth' },
      { unit: 'Unit 5', title: 'Databases & ORM', topics: 'PostgreSQL, SQL Joins & Aggregates, SQLAlchemy, Alembic Migrations' },
      { unit: 'Unit 6', title: 'DevOps & Deployment', topics: 'Docker, Linux Servers, Nginx, GitHub Actions CI/CD, Cloud Hosting' },
      { unit: 'Capstone', title: 'Portfolio Project', topics: 'Build and deploy a complete full-stack SaaS application end-to-end' },
    ],
    highlights: ['Live weekly code reviews', 'Dedicated 1:1 mentorship', '3 production-grade projects'],
  },
  {
    id: 'data-analytics',
    icon: <FaChartBar size={24} />,
    bannerColor: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
    title: 'Data Analytics & Engineering',
    duration: '5 Months | Hybrid (Online + Offline)',
    description:
      'Transform raw data into actionable business insights. We take you from Python fundamentals through advanced SQL, ETL pipelines, and business intelligence dashboards—the skills employers are actively looking for.',
    skills: ['Python 3.12', 'Advanced SQL', 'Pandas & NumPy', 'Power BI', 'ETL Pipelines', 'PostgreSQL', 'Matplotlib'],
    syllabus: [
      { unit: 'Unit 1', title: 'Python for Data Analysis', topics: 'Python OOP, List Comprehensions, File I/O, Error Handling' },
      { unit: 'Unit 2', title: 'Data Wrangling', topics: 'Pandas DataFrames, Data Cleaning, Merging, Pivot Tables' },
      { unit: 'Unit 3', title: 'Advanced SQL & Databases', topics: 'Window Functions, CTEs, Stored Procedures, Optimization' },
      { unit: 'Unit 4', title: 'Visualization & BI', topics: 'Matplotlib, Seaborn, Power BI Dashboards, Storytelling' },
      { unit: 'Unit 5', title: 'ETL Pipelines', topics: 'Data Ingestion, Transformation Workflows, Scheduling, APIs' },
      { unit: 'Capstone', title: 'Business Intelligence Project', topics: 'End-to-end analytics project with executive dashboard presentation' },
    ],
    highlights: ['Real company datasets', 'BI Dashboard certification', 'Industry mentor sessions'],
  },
  {
    id: 'applied-ai',
    icon: <FaProjectDiagram size={24} />,
    bannerColor: 'linear-gradient(90deg, #6d28d9, #a78bfa)',
    title: 'Applied AI & Machine Learning',
    duration: '4 Months | Hybrid (Online + Offline)',
    description:
      'Step into the era of intelligent applications. Learn to build LLM-powered agents, retrieval-augmented generation systems, and custom machine learning pipelines—skills that command the highest market demand today.',
    skills: ['Python', 'FastAPI', 'LangChain', 'OpenAI API', 'ChromaDB', 'RAG', 'Docker', 'Prompt Engineering'],
    syllabus: [
      { unit: 'Unit 1', title: 'AI Foundations & Python', topics: 'NumPy, Linear Algebra for ML, Scikit-Learn Essentials' },
      { unit: 'Unit 2', title: 'LLM Engineering', topics: 'Prompt Engineering, OpenAI API, Anthropic Claude, Function Calling' },
      { unit: 'Unit 3', title: 'Autonomous AI Agents', topics: 'LangChain LCEL, ReAct Agents, Tool Calling, Memory Systems' },
      { unit: 'Unit 4', title: 'Vector DBs & RAG Systems', topics: 'Embeddings, ChromaDB, Pinecone, Retrieval-Augmented Generation' },
      { unit: 'Capstone', title: 'AI Production Application', topics: 'Build and ship a full-stack AI-powered application with a React frontend' },
    ],
    highlights: ['Hands-on with GPT-4 & Claude', 'Build real AI agents', 'Deploy on cloud infrastructure'],
  },
];

const TESTIMONIALS = [
  {
    quote: "The project-based approach gave me the confidence to crack my first developer interview. I walked in with a GitHub full of real applications—that made all the difference.",
    name: 'Rahul Sharma',
    role: 'Software Engineer at TechCorp',
    initials: 'RS',
    avatarBg: '#15803D',
    outcome: 'Placed within 3 months',
  },
  {
    quote: "The mentorship is unparalleled. I went from being a complete beginner with zero coding background to a job-ready data analyst. My mentor was with me every step of the way.",
    name: 'Priya M.',
    role: 'Data Analyst at FinEdge Analytics',
    initials: 'PM',
    avatarBg: '#1d4ed8',
    outcome: 'Salary 2x after switch',
  },
  {
    quote: "Small batch sizes meant I never got left behind. Every doubt was addressed. The community of learners here is supportive and keeps you accountable. Best decision I ever made.",
    name: 'Amit K.',
    role: 'Full-Stack Engineer at CloudScale',
    initials: 'AK',
    avatarBg: '#6d28d9',
    outcome: 'Remote job at a product startup',
  },
];

const STATS = [
  { value: '500+', label: 'Learners Placed' },
  { value: '98%', label: 'Completion Rate' },
  { value: '1:8', label: 'Mentor–Student Ratio' },
  { value: '60+', label: 'Hiring Partners' },
];

// ─────────────────────── COMPONENT ───────────────────────

export default function Home() {
  const [activeSyllabus, setActiveSyllabus] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [form, setForm] = useState({ name: '', mobile: '', email: '', program: 'Full-Stack Web Development', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const toastTimer = useRef(null);
  const observerRef = useRef(null);

  // ── Intersection Observer for fade-up animations ──
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.cl-fade-up').forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current && observerRef.current.disconnect();
  }, []);

  // ── Show toast helper ──
  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ show: true, msg });
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // ── Smooth scroll ──
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  };

  // ── Form handling ──
  const handleFormChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.email) {
      showToast('Please fill in your name, mobile, and email.');
      return;
    }
    setFormSubmitted(true);
    showToast('Thank you! Our counselors will reach out within 24 hours.');
  };

  return (
    <>
      <InstituteNavbar />

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section id="hero" className="cl-hero hero-section">
        <HomeRadar />
        <div className="container hero-content">
          <div className="row align-items-center g-5">
            {/* Left Copy */}
            <div className="col-lg-7 col-xl-6">
              <div className="cl-trust-badge mb-4 d-inline-flex">
                <FaGraduationCap />
                <span>Noida's Premier Full-Stack &amp; AI Training Institute</span>
              </div>

              <h1 className="mb-4" style={{ textShadow: 'none', filter: 'none' }}>
                Where Ambition Meets{' '}
                <span className="highlight" style={{ textShadow: 'none', filter: 'none' }}>Expertise</span>
                {' '}— Master Full-Stack &amp; Data Analytics
              </h1>

              <p className="lead-text mb-5">
                Join a community of passionate learners. Get hands-on training, real-world
                projects, and mentorship from industry experts who've been in the trenches.
              </p>

              {/* Trust Badges Row */}
              <div className="d-flex flex-wrap gap-3 mb-5">
                {[
                  { icon: <FaUsers />, text: '500+ Careers Launched' },
                  { icon: <FaGraduationCap />, text: '1:1 Mentorship' },
                  { icon: <FaProjectDiagram />, text: 'Hands-on Portfolio' },
                ].map(({ icon, text }) => (
                  <div key={text} className="cl-trust-badge">
                    {icon}
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="d-flex flex-wrap gap-3">
                <button
                  className="btn-explore"
                  onClick={() => scrollTo('programs')}
                >
                  Explore Our Programs <FaArrowRight style={{ fontSize: '0.8rem' }} />
                </button>
                <button
                  className="btn-visit"
                  onClick={() => scrollTo('contact')}
                >
                  Talk to a Counselor
                </button>
              </div>
            </div>
            {/* Right side empty — radar stage occupies visually */}
            <div className="col-lg-5 col-xl-6 d-none d-lg-block" />
          </div>
        </div>
      </section>


      {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
      <div className="cl-stats-bar">
        <div className="container">
          <div className="row g-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="cl-stat-item">
                  <h3>{value}</h3>
                  <p>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════ ABOUT (PILLARS) ═══════════════════════ */}
      <PillarsSection />

      {/* ═══════════════════════ PROGRAMS ═══════════════════════ */}
      <ProgramsSection
        programs={PROGRAMS}
        onViewSyllabus={setActiveSyllabus}
        onBrochure={(prog) => showToast(`Brochure for "${prog.title}" sent! Our counseling team will follow up.`)}
      />

      {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
      <TestimonialsSection testimonials={TESTIMONIALS} />

      {/* ═══════════════════════ CONTACT ═══════════════════════ */}
      <section id="contact" className="cl-section-alt">
        <div className="container">
          <div className="text-center mb-5 cl-fade-up">
            <div className="cl-section-label">Get in Touch</div>
            <h2 className="cl-section-title">Talk to an Academic Counselor</h2>
            <p className="cl-section-subtitle">
              Have questions about which program is right for you? Our counselors are here to help—
              no pressure, just an honest conversation.
            </p>
          </div>

          <div className="row g-4 align-items-stretch">
            {/* Contact Info Card */}
            <div className="col-lg-4 cl-fade-up">
              <div className="cl-contact-info-card">
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>
                    We're here for you.
                  </div>
                  <p style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: 1.65, margin: 0 }}>
                    Whether it's a quick question or an in-depth program discussion, reach out through
                    any of these channels. We respond within 24 hours.
                  </p>
                </div>

                <div className="d-flex flex-column gap-4">
                  {[
                    { icon: <FaPhone />, label: 'Phone', text: '+91 98765 43210' },
                    { icon: <FaEnvelope />, label: 'Email', text: 'info@codelift.in' },
                    { icon: <FaMapMarkerAlt />, label: 'Campus', text: 'Knowledge Park III, Noida, UP – 201305' },
                  ].map(({ icon, label, text }) => (
                    <div key={label} className="cl-contact-info-item">
                      <div className="icon">{icon}</div>
                      <div>
                        <strong>{label}</strong>
                        <span>{text}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
                    Follow Our Community
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {[
                      { icon: <FaLinkedin />, label: 'LinkedIn' },
                      { icon: <FaYoutube />, label: 'YouTube' },
                      { icon: <FaInstagram />, label: 'Instagram' },
                      { icon: <FaTwitter />, label: 'Twitter / X' },
                      { icon: <FaGithub />, label: 'GitHub' },
                    ].map(({ icon, label }) => (
                      <a
                        key={label}
                        href="#"
                        className="cl-social-btn"
                        title={label}
                        onClick={(e) => e.preventDefault()}
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="col-lg-8 cl-fade-up cl-delay-1">
              <div className="cl-contact-form">
                {formSubmitted ? (
                  <div className="text-center py-5">
                    <div style={{ marginBottom: '16px', color: 'var(--bs-primary, #15803D)' }}><FaCheckCircle size={44} /></div>
                    <h4 style={{ fontWeight: 800, color: 'var(--bs-primary, #15803D)', marginBottom: '10px' }}>
                      Thank you, {form.name.split(' ')[0]}!
                    </h4>
                    <p style={{ color: 'var(--text-secondary, #52525B)', maxWidth: '380px', margin: '0 auto 20px' }}>
                      We've received your inquiry. One of our academic counselors will reach out
                      within the next 24 hours.
                    </p>
                    <button
                      onClick={() => { setFormSubmitted(false); setForm({ name: '', mobile: '', email: '', program: 'Full-Stack Web Development', message: '' }); }}
                      style={{ background: 'none', border: '2px solid var(--bs-primary, #15803D)', color: 'var(--bs-primary, #15803D)', borderRadius: '50px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit}>
                    <h5 style={{ fontWeight: 700, color: 'var(--text-primary, #171717)', marginBottom: '6px' }}>
                      Register Your Interest
                    </h5>
                    <p style={{ color: 'var(--text-secondary, #52525B)', fontSize: '0.875rem', marginBottom: '24px' }}>
                      Fill in your details and we'll get back to you with everything you need to know.
                    </p>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)', display: 'block', marginBottom: '6px' }}>
                          Full Name *
                        </label>
                        <input
                          className="cl-form-control"
                          name="name"
                          placeholder="e.g. Rahul Sharma"
                          value={form.name}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)', display: 'block', marginBottom: '6px' }}>
                          Mobile Number *
                        </label>
                        <input
                          className="cl-form-control"
                          name="mobile"
                          placeholder="e.g. 9876543210"
                          value={form.mobile}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)', display: 'block', marginBottom: '6px' }}>
                          Email Address *
                        </label>
                        <input
                          className="cl-form-control"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={handleFormChange}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)', display: 'block', marginBottom: '6px' }}>
                          Program of Interest
                        </label>
                        <select
                          className="cl-form-control"
                          name="program"
                          value={form.program}
                          onChange={handleFormChange}
                          style={{ marginBottom: 0 }}
                        >
                          {PROGRAMS.map((p) => (
                            <option key={p.id} value={p.title}>{p.title}</option>
                          ))}
                          <option value="Not sure yet">Not sure yet — need guidance</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary, #52525B)', display: 'block', marginBottom: '6px' }}>
                          Your Message (optional)
                        </label>
                        <textarea
                          className="cl-form-control"
                          name="message"
                          rows={3}
                          placeholder="Tell us about your background and what you're hoping to achieve..."
                          value={form.message}
                          onChange={handleFormChange}
                          style={{ resize: 'vertical', marginBottom: 0 }}
                        />
                      </div>
                    </div>

                    <button type="submit" className="cl-btn-submit mt-4">
                      Submit Inquiry →
                    </button>

                    <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '10px', textAlign: 'center' }}>
                      We respect your privacy. Your details will never be shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ FOOTER ═══════════════════════ */}
      <footer className="cl-footer">
        <div className="container">
          <div className="row g-5">
            {/* Brand Column */}
            <div className="col-lg-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaGraduationCap style={{ color: 'var(--bs-primary, #15803D)', fontSize: '1.5rem' }} />
                <div className="brand-name">CodeLift</div>
              </div>
              <div className="brand-tagline">
                Noida's premier institute for Full-Stack Web Development,
                Data Analytics, and Applied AI Engineering. Building
                future-ready engineers, one cohort at a time.
              </div>
              <div className="d-flex gap-2 mt-4 flex-wrap">
                {[
                  { icon: <FaLinkedin />, label: 'LinkedIn' },
                  { icon: <FaYoutube />, label: 'YouTube' },
                  { icon: <FaInstagram />, label: 'Instagram' },
                  { icon: <FaTwitter />, label: 'Twitter' },
                  { icon: <FaGithub />, label: 'GitHub' },
                ].map(({ icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="cl-social-btn"
                    title={label}
                    onClick={(e) => e.preventDefault()}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-6 col-lg-2">
              <div className="cl-footer-heading">Quick Links</div>
              <div className="d-flex flex-column">
                {[
                  { label: 'Home', id: 'hero' },
                  { label: 'About Us', id: 'about' },
                  { label: 'Programs', id: 'programs' },
                  { label: 'Testimonials', id: 'testimonials' },
                  { label: 'Contact', id: 'contact' },
                ].map(({ label, id }) => (
                  <button
                    key={id}
                    className="cl-footer-link btn btn-link text-start p-0 border-0"
                    onClick={() => scrollTo(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Programs Column */}
            <div className="col-6 col-lg-3">
              <div className="cl-footer-heading">Our Programs</div>
              <div className="d-flex flex-column">
                {PROGRAMS.map((p) => (
                  <button
                    key={p.id}
                    className="cl-footer-link btn btn-link text-start p-0 border-0 text-truncate"
                    onClick={() => setActiveSyllabus(p)}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Column */}
            <div className="col-lg-3">
              <div className="cl-footer-heading">Connect With Us</div>
              <div className="cl-contact-line">
                <FaPhone style={{ fontSize: '0.8rem', opacity: 0.6 }} />
                <span>+91 98765 43210</span>
              </div>
              <div className="cl-contact-line">
                <FaEnvelope style={{ fontSize: '0.8rem', opacity: 0.6 }} />
                <span>info@codelift.in</span>
              </div>
              <div className="cl-contact-line" style={{ alignItems: 'flex-start' }}>
                <FaMapMarkerAlt style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '3px' }} />
                <span>Knowledge Park III,<br />Noida, Uttar Pradesh – 201305</span>
              </div>
            </div>
          </div>

          <hr className="cl-footer-divider" />

          <p className="cl-copyright">
            © {new Date().getFullYear()} CodeLift Engineering Academy. Crafted for lifelong learning.
          </p>
        </div>
      </footer>

      {/* ═══════════════════════ SYLLABUS MODAL ═══════════════════════ */}
      {activeSyllabus && (
        <div className="cl-modal-overlay active" onClick={(e) => { if (e.target === e.currentTarget) setActiveSyllabus(null); }}>
          <div className="cl-modal-box" style={{ background: 'var(--card-bg, #ffffff)', color: 'var(--text-primary, #171717)', border: '1px solid var(--border-color, #E5E7EB)' }}>
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{activeSyllabus.icon}</div>
                <h3 style={{ fontWeight: 800, color: 'var(--text-primary, #171717)', marginBottom: '4px', fontSize: '1.3rem' }}>
                  {activeSyllabus.title}
                </h3>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--bs-primary, #15803D)', background: 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.12)', padding: '3px 12px', borderRadius: '50px' }}>
                  {activeSyllabus.duration}
                </span>
              </div>
              <button
                onClick={() => setActiveSyllabus(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-secondary, #52525B)', padding: '4px' }}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            {/* Syllabus Units */}
            <h6 style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--bs-primary, #15803D)', marginBottom: '16px' }}>
              Curriculum Overview
            </h6>

            <div className="d-flex flex-column gap-3">
              {activeSyllabus.syllabus.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: idx === activeSyllabus.syllabus.length - 1 ? 'rgba(var(--bs-primary-rgb, 21, 128, 61), 0.1)' : 'var(--bg-body, #F8FAFC)',
                    border: `1px solid var(--border-color, #E5E7EB)`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700, background: idx === activeSyllabus.syllabus.length - 1 ? 'var(--bs-primary, #15803D)' : 'var(--card-bg-alt, #1F2937)',
                      color: '#fff', padding: '2px 9px', borderRadius: '50px'
                    }}>
                      {item.unit}
                    </span>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary, #171717)' }}>{item.title}</strong>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary, #52525B)', margin: 0, lineHeight: 1.6 }}>
                    {item.topics}
                  </p>
                </div>
              ))}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                className="cl-btn-syllabus"
                style={{ padding: '12px 20px', flex: 1 }}
                onClick={() => { setActiveSyllabus(null); scrollTo('contact'); }}
              >
                Register Interest →
              </button>
              <button
                className="cl-btn-brochure"
                style={{ padding: '12px 16px' }}
                onClick={() => { setActiveSyllabus(null); showToast(`Brochure for "${activeSyllabus.title}" sent! Our counseling team will follow up.`); }}
              >
                <FaDownload style={{ fontSize: '0.75rem' }} /> Brochure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════ TOAST ═══════════════════════ */}
      <div className={`cl-toast ${toast.show ? 'show' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
}
