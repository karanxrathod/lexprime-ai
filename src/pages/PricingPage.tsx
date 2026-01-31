
import React, { useState } from "react";
import { Check, X, CreditCard, Shield, Zap, Crown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { translations, Language } from '../translations';

interface PricingPageProps {
    language: Language;
}

const PricingPage: React.FC<PricingPageProps> = ({ language }) => {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const t = translations[language];

    const plans = [
        {
            id: "starter",
            name: t.starter,
            price: "₹99",
            icon: <Shield className="w-6 h-6 text-blue-500" />,
            features: [
                { text: "15 Document Scans", included: true },
                { text: "AI Risk Detection", included: true },
                { text: "Safety Score", included: true },
                { text: "Simplified Explanations", included: true },
                { text: "Clause Rewrite Suggestions", included: false },
                { text: "Priority Support", included: false },
            ],
            highlight: false,
        },
        {
            id: "pro",
            name: t.pro,
            price: "₹199",
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            features: [
                { text: "Everything in Starter", included: true },
                { text: "Clause Rewrite Suggestions", included: true },
                { text: "Ask AI Anything", included: true },
                { text: "Document Comparison", included: true },
                { text: "Negotiation Insights", included: true },
                { text: "Priority Processing", included: true },
            ],
            highlight: true,
            badge: t.mostPopular,
        },
        {
            id: "business",
            name: t.business,
            price: "₹499",
            icon: <Crown className="w-6 h-6 text-purple-500" />,
            features: [
                { text: "Near Unlimited Scans", included: true },
                { text: "Team Access", included: true },
                { text: "Document History", included: true },
                { text: "Risk Timeline", included: true },
                { text: "Downloadable Reports", included: true },
                { text: "Priority Support", included: true },
            ],
            highlight: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase">
                        {t.pricingPageSubtitle}
                    </h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        {t.pricingPageTitle}
                    </p>
                    <div className="mt-4 flex justify-center">
                        <span className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium border border-amber-200 dark:border-amber-800">
                            {t.pricingAnchor}
                        </span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white dark:bg-slate-800 rounded-2xl transition-all duration-300 flex flex-col ${plan.highlight
                                ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-2xl scale-105 z-10"
                                : "border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        {plan.badge}
                                    </span>
                                </div>
                            )}

                            <div className="p-8 flex-1">

                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {plan.icon}
                                        {plan.name}
                                    </h3>
                                </div>

                                <div className="mb-6 flex items-baseline text-gray-900 dark:text-white">
                                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                                    <span className="ml-1 text-lg text-gray-500 dark:text-gray-400 font-medium">
                                        {t.monthly}
                                    </span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${feature.included ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500'}`}>
                                                {feature.included ? (
                                                    <Check className="w-3 h-3" />
                                                ) : (
                                                    <X className="w-3 h-3" />
                                                )}
                                            </div>
                                            <span className={`ml-3 text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                                                {feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 pt-0 mt-auto">
                                <button
                                    onClick={() => setShowDemoModal(true)}
                                    className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl transition-all duration-200 ${plan.highlight
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                                        : "bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600"
                                        }`}
                                >
                                    {plan.highlight ? t.upgrade : t.getStarted}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Demo Modal */}
            <AnimatePresence>
                {showDemoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-slate-700"
                        >
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {t.demoModalTitle}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {t.demoModalText}
                                </p>
                                <button
                                    onClick={() => setShowDemoModal(false)}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    {t.close}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PricingPage;
