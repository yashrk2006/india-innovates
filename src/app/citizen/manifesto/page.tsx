"use client";

import { useState, useEffect } from "react";
import { getInfrastructureProjects, getVoterProfile } from "@/lib/services";
import type { InfrastructureProject } from "@/lib/types";
import { useLanguage } from "@/components/features/citizen/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ManifestoPage() {
    const [projects, setProjects] = useState<InfrastructureProject[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const [showBefore, setShowBefore] = useState<Record<number, boolean>>({});
    const [voterId, setVoterId] = useState<number | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedProject, setSelectedProject] = useState<InfrastructureProject | null>(null);
    const [localStats, setLocalStats] = useState<Record<number, { likes: number, commentsCount: number }>>({});

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const voter = await getVoterProfile();
                if (voter) {
                    setVoterId(voter.id);
                    const constituencyId = voter?.eci?.booth?.constituency_id || voter?.constituency_id || 2;
                    const data = await getInfrastructureProjects(constituencyId);
                    setProjects(data);
                    
                    const stats: Record<number, { likes: number, commentsCount: number }> = {};
                    data.forEach(p => {
                        stats[p.id] = { 
                            likes: p.likes_count || 0, 
                            commentsCount: p.comments_count || 0 
                        };
                    });
                    setLocalStats(stats);
                }
            } catch (error) {
                console.error("Failed to load user or projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const fetchComments = async (projectId: number) => {
        try {
            const res = await fetch(`/api/infrastructure/interact?project_id=${projectId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    const handleSelectProject = (project: InfrastructureProject) => {
        setSelectedProject(project);
        fetchComments(project.id);
    };

    const handleLike = async (e: React.MouseEvent, projectId: number) => {
        e.stopPropagation();
        if (!voterId) return;

        // Optimistic update
        setLocalStats((prev: any) => ({
            ...prev,
            [projectId]: { ...prev[projectId], likes: (prev[projectId]?.likes || 0) + 1 }
        }));

        try {
            await fetch("/api/infrastructure/interact", {
                method: "POST",
                body: JSON.stringify({ project_id: projectId, voter_id: voterId, action: "like" })
            });
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !selectedProject || !voterId) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/infrastructure/interact", {
                method: "POST",
                body: JSON.stringify({ 
                    project_id: selectedProject.id, 
                    voter_id: voterId, 
                    action: "comment",
                    comment_text: newComment 
                })
            });

            if (res.ok) {
                setNewComment("");
                fetchComments(selectedProject.id); // Refresh comments
                setLocalStats((prev: any) => ({
                    ...prev,
                    [selectedProject.id]: { 
                        ...prev[selectedProject.id], 
                        commentsCount: (prev[selectedProject.id]?.commentsCount || 0) + 1 
                    }
                }));
            }
        } catch (error) {
            console.error("Comment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string, progress: number) => {
        if (status === 'completed') return 'bg-emerald-500 text-white border-emerald-400';
        if (progress > 0) return 'bg-amber-500 text-white border-amber-400';
        return 'bg-slate-500 text-white border-slate-400';
    };

    const getStatusLabel = (status: string, progress: number) => {
        if (status === 'completed') return 'Completed';
        if (progress > 0) return 'In Progress';
        return 'Planned';
    };

    return (
        <div className="p-5 md:p-0 space-y-8 pb-12">
            {/* Header Section */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/20 p-8 shadow-2xl shadow-slate-200/50"
            >
                <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 bg-accent-gold/5 rounded-full blur-3xl" />
                
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-4xl">analytics</span>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("manifesto_tracker")}</h2>
                        <p className="text-slate-500 font-medium max-w-xl">Real-time tracking of infrastructure development, educational reforms, and digital connectivity in your constituency.</p>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing Project Data...</p>
                </div>
            ) : projects.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-dashed border-slate-200 p-20 text-center"
                >
                    <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl text-slate-300">construction</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Expanding the Vision</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">New infrastructure projects for your area are currently in the planning phase. Check back soon for live updates.</p>
                </motion.div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, idx) => {
                        const isCompleted = project.status === 'completed';
                        const currentImageUrl = showBefore[project.id] && project.before_image_url 
                            ? project.before_image_url 
                            : (project.after_image_url || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800");

                        return (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                                className="group relative bg-white/60 backdrop-blur-sm rounded-[2.5rem] border border-white p-2 shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                            >
                                {/* card thumb wrapper */}
                                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100">
                                    <AnimatePresence mode="wait">
                                        <motion.img 
                                            key={currentImageUrl}
                                            initial={{ opacity: 0, scale: 1.1 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.4 }}
                                            src={currentImageUrl} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800";
                                            }}
                                        />
                                    </AnimatePresence>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${getStatusColor(project.status, project.progress)}`}>
                                            {getStatusLabel(project.status, project.progress)}
                                        </span>
                                        {isCompleted && (
                                            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-100 border border-emerald-400/30 backdrop-blur-md flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">verified</span>
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    {/* Before/After Toggle */}
                                    {project.before_image_url && project.after_image_url && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowBefore(prev => ({ ...prev, [project.id]: !prev[project.id] }));
                                            }}
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 hover:bg-white/40 border border-white/30 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest transition-all z-10"
                                        >
                                            {showBefore[project.id] ? "Show Final Result" : "View Initial State"}
                                        </button>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-12 rounded-2xl flex items-center justify-center shadow-inner ${project.icon_bg || 'bg-slate-100 text-slate-600'}`}>
                                                <span className="material-symbols-outlined text-2xl">{project.icon || 'location_on'}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{project.type} Project</span>
                                                    <div className="size-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-primary">{project.booth_number ? `Booth ${project.booth_number}` : 'City Wide'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                        {project.description}
                                    </p>

                                    {/* Progress Area */}
                                    <div className="bg-slate-50/50 rounded-3xl p-5 mb-6 border border-slate-100/50">
                                        <div className="flex justify-between items-end mb-3">
                                            <div className="space-y-0.5">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Status</p>
                                                <p className="text-sm font-black text-slate-900">{project.progress}% Optimized</p>
                                            </div>
                                            <div className="size-10 rounded-full border-4 border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-900 bg-white shadow-sm">
                                                {project.progress}
                                            </div>
                                        </div>
                                        <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner p-0.5">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className={`h-full rounded-full relative ${
                                                    isCompleted 
                                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                                    : 'bg-gradient-to-r from-primary to-primary-light shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <button 
                                                onClick={(e) => handleLike(e, project.id)}
                                                className="flex items-center gap-2 group/btn"
                                            >
                                                <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-red-50 transition-colors">
                                                    <span className="material-symbols-outlined text-lg text-slate-400 group-hover/btn:text-red-500 transition-colors">favorite</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-900">{localStats[project.id]?.likes || 0}</span>
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSelectProject(project); }}
                                                className="flex items-center gap-2 group/btn"
                                            >
                                                <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/btn:bg-primary/10 transition-colors">
                                                    <span className="material-symbols-outlined text-lg text-slate-400 group-hover/btn:text-primary transition-colors">chat</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-900">{localStats[project.id]?.commentsCount || 0}</span>
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleSelectProject(project)}
                                            className="group/link flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-primary/20"
                                        >
                                            Details
                                            <span className="material-symbols-outlined text-xs group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Effect Card Glow */}
                                {hoveredProject === project.id && (
                                    <motion.div 
                                        layoutId="glow"
                                        className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent-gold rounded-[2.6rem] blur-xl opacity-10 -z-10"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.15 }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
                        >
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 z-10 size-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50"
                            >
                                <span className="material-symbols-outlined text-slate-900">close</span>
                            </button>

                            <div className="md:w-5/12 relative bg-slate-100 min-h-[300px]">
                                <img 
                                    src={selectedProject.after_image_url || "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=800"} 
                                    alt={selectedProject.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10">
                                    <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 backdrop-blur-md text-white mb-4 inline-block ${getStatusColor(selectedProject.status, selectedProject.progress)}`}>
                                        {getStatusLabel(selectedProject.status, selectedProject.progress)}
                                    </span>
                                    <h2 className="text-3xl font-black text-white">{selectedProject.title}</h2>
                                </div>
                            </div>

                            <div className="md:w-7/12 p-8 overflow-y-auto flex flex-col h-full">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`p-3 rounded-2xl ${selectedProject.icon_bg}`}>
                                            <span className="material-symbols-outlined text-3xl">{selectedProject.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Type</p>
                                            <p className="text-lg font-bold text-slate-900 capitalize">{selectedProject.type}</p>
                                        </div>
                                    </div>

                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        {selectedProject.description}
                                    </p>

                                    {/* Comments Section */}
                                    <div className="border-t border-slate-100 pt-8 mt-4">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                            Community Feedback
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{comments.length}</span>
                                        </h3>

                                        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 mb-8 custom-scrollbar">
                                            {comments.length === 0 ? (
                                                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Be the first to comment</p>
                                                </div>
                                            ) : (
                                                comments.map((comment, i) => (
                                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                        <div className="size-10 rounded-full bg-white flex items-center justify-center font-black text-primary border border-slate-200 shadow-sm">
                                                            {comment.voter_name?.charAt(0) || "V"}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-black text-slate-900">{comment.voter_name || "Community Member"}</span>
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 font-medium leading-normal">{comment.comment_text}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Comment Input */}
                                <div className="pt-6 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        <input 
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a message to the team..."
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                        />
                                        <button 
                                            disabled={isSubmitting || !newComment.trim()}
                                            onClick={handleSubmitComment}
                                            className="px-6 py-4 bg-slate-900 hover:bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:hover:bg-slate-900"
                                        >
                                            {isSubmitting ? '...' : 'Send'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
            `}</style>
        </div>
    );
}
