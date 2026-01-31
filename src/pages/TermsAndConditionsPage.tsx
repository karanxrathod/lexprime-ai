"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

import { translations, Language } from "../translations";

interface TermsAndConditionsPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

const TermsAndConditionsPage: React.FC<TermsAndConditionsPageProps> = ({
  onNavigate,
  language
}) => {
  const t = translations[language];

  const sections = [
    { title: t.termsSection1Title, content: t.termsSection1Content },
    { title: t.termsSection2Title, content: t.termsSection2Content },
    { title: t.termsSection3Title, content: t.termsSection3Content },
    { title: t.termsSection4Title, content: t.termsSection4Content },
    { title: t.termsSection5Title, content: t.termsSection5Content },
    { title: t.termsSection6Title, content: t.termsSection6Content },
    { title: t.termsSection7Title, content: t.termsSection7Content },
    { title: t.termsSection8Title, content: t.termsSection8Content },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate("settings")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t.back}</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t.termsTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t.termsLastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 sm:p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.termsContact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;

