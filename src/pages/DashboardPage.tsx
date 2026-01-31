import React from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    AlertTriangle,
    CheckCircle,
    Users,
    TrendingUp,
    ArrowRight,
    Activity,
    MoreHorizontal
} from 'lucide-react';
import { AnalysisHistoryItem } from '../types/history';
import { translations, Language } from '../translations';

interface DashboardPageProps {
    analysisHistory: AnalysisHistoryItem[];
    userName?: string;
    onNavigate: (route: string) => void;
    onSelectAnalysis: (item: AnalysisHistoryItem) => void;
    language: Language;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
    analysisHistory,
    userName,
    onNavigate,
    onSelectAnalysis,
    language
}) => {
    const t = translations[language];

    // Mock data for stats if history is empty
    const totalDocs = analysisHistory.length || 12;
    const riskyDocs = analysisHistory.filter(h => h.analysis?.risks?.some(r => r.severity === 'high')).length || 3;
    const savedHours = (totalDocs * 1.5).toFixed(1); // Mock calculation

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {userName || 'User'}. Here's your legal overview.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onNavigate('upload')}
                        className="px-5 py-2.5 bg-accent-gradient text-white rounded-xl font-medium shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2"
                    >
                        <FileText className="h-4 w-4" />
                        {t.newAnalysis}
                    </button>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Top Row: AI Insight Card (Span 2) */}
                <motion.div variants={item} className="lg:col-span-2 card-green-soft rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="h-32 w-32 text-primary" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                                AI Insight
                            </span>
                            <span className="text-xs text-muted-foreground">Just now</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                            {userName
                                ? t.welcomeUser.replace("{{name}}", userName.split(' ')[0])
                                : t.welcomeGuest}
                        </h1>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                            {t.uploadSubtitle}
                        </p>
                        <button
                            onClick={() => onNavigate('documents')}
                            className="group/btn flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                        >
                            Review Document <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Top Row: Secondary Analytics (Span 1) */}
                <motion.div variants={item} className="glass-card rounded-2xl p-6 flex flex-col justify-center relative">
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Efficiency Score</h3>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative h-32 w-32 flex items-center justify-center">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                <path className="text-primary drop-shadow-md" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-3xl font-bold text-foreground">94%</span>
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Optimized</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">
                            You saved <span className="font-semibold text-primary">{savedHours} hours</span> this month using AI analysis.
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Stats Cards Row */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
                {[
                    { label: 'Documents', value: totalDocs, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'Risks Found', value: riskyDocs, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    { label: 'Verified', value: Math.max(0, totalDocs - riskyDocs), icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
                    { label: 'Active Users', value: '4', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map((stat, i) => (
                    <motion.div key={i} variants={item} className="glass-card rounded-2xl p-5 hover:-translate-y-1 transition-transform cursor-default">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            {i === 1 && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Recent Activity Table */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="glass-card rounded-2xl overflow-hidden border border-border/50"
            >
                <div className="p-6 border-b border-border/50 flex justify-between items-center bg-white/20 dark:bg-black/20">
                    <h3 className="text-lg font-semibold">Recent Documents</h3>
                    <button onClick={() => onNavigate('documents')} className="text-sm text-primary hover:text-primary/80 transition-colors">
                        View All
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            <tr>
                                <th className="px-6 py-4 text-left">Document Name</th>
                                <th className="px-6 py-4 text-left">Type</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {analysisHistory.slice(0, 5).map((doc, idx) => (
                                <tr
                                    key={doc.id || idx}
                                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                                    onClick={() => onSelectAnalysis(doc)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                                {doc.title || "Untitled Document"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {doc.analysis?.documentType || "Contract"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(doc.analysis?.risks?.filter(r => r.severity === 'high').length ?? 0) > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                                Attention Needed
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(doc.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {/* Empty State if needed */}
                            {analysisHistory.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No documents yet. Start your first analysis!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
