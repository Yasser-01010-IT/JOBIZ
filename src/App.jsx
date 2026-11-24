import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Obstacles from './components/Obstacles';
import MarketStats from './components/MarketStats';
import AgentsShowcase from './components/AgentsShowcase';
import Journey from './components/Journey';
import CaseStudySara from './components/CaseStudySara';
import Comparison from './components/Comparison';
import PricingBusinessModel from './components/PricingBusinessModel';
import RoadmapSNEE from './components/RoadmapSNEE';
import SurveyQuestionnaire from './components/SurveyQuestionnaire';
import AdminSurveyModal from './components/AdminSurveyModal';
import Footer from './components/Footer';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSurvey = () => {
    const el = document.getElementById('questionnaire');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        onOpenSurvey={scrollToSurvey}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenSurvey={scrollToSurvey} />

        {/* 4 Market Obstacles */}
        <Obstacles />

        {/* Market Stats & Urgency */}
        <MarketStats />

        {/* The 6 Coordinated AI Agents Showcase */}
        <AgentsShowcase />

        {/* 6-Step Student Journey */}
        <Journey />

        {/* Interactive Case Study: Sara (M1 Informatique) */}
        <CaseStudySara />

        {/* Strategic Comparison: Jobinz vs LinkedIn / Indeed */}
        <Comparison />

        {/* Business Model: Freemium, Premium & B2B */}
        <PricingBusinessModel onOpenSurvey={scrollToSurvey} />

        {/* SNEE Pépite Roadmap & INPI Check */}
        <RoadmapSNEE />

        {/* The Core Deliverable: Market Research Survey & Early Testers Recruitment */}
        <SurveyQuestionnaire />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Survey collection information and local archive */}
      <AdminSurveyModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
