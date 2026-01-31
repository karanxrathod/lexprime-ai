"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";

import { translations, Language } from "../translations";

interface PrivacyPolicyPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onNavigate,
  language
}) => {
  const t = translations[language];

  const sections = [
    { title: t.privacySection1Title, content: t.privacySection1Content },
    { title: t.privacySection2Title, content: t.privacySection2Content },
    { title: t.privacySection3Title, content: t.privacySection3Content },
    { title: t.privacySection4Title, content: t.privacySection4Content },
    { title: t.privacySection5Title, content: t.privacySection5Content },
    { title: t.privacySection6Title, content: t.privacySection6Content },
    { title: t.privacySection7Title, content: t.privacySection7Content },
    { title: t.privacySection8Title, content: t.privacySection8Content },
    { title: t.privacySection9Title, content: t.privacySection9Content },
    { title: t.privacySection10Title, content: t.privacySection10Content },
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
            {t.privacyTitle}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t.privacyLastUpdated}
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
              {t.privacyContact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

