"use client";

import { useState, useEffect } from "react";
import { getInfrastructureProjects, getVoterProfile } from "@/lib/services";
import type { InfrastructureProject } from "@/lib/types";
import { useLanguage } from "@/components/citizen/LanguageContext";

export default function ManifestoPage() {
    const [projects, setProjects] = useState<InfrastructureProject[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const voter = await getVoterProfile();
                const constituencyId = voter?.eci?.booth?.constituency_id || voter?.constituency_id || 2;
                const data = await getInfrastructureProjects(constituencyId);
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getStatusColor = (status: string, progress: number) => {
        if (status === 'completed') return 'bg-green-100 text-green-700 border-green-200';
        if (progress > 0) return 'bg-blue-100 text-blue-700 border-blue-200';
        return 'bg-stone-100 text-stone-600 border-stone-200';
    };

    const getStatusLabel = (status: string, progress: number) => {
        if (status === 'completed') return 'Completed';
        if (progress > 0) return 'In Progress';
        return 'Planned';
    };

    return (
        <div className="p-5 md:p-0 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm mb-6">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">rule</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{t("manifesto_tracker")}</h2>
                        <p className="text-sm text-stone-500">Tracking development promises and infrastructure progress in your area.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="size-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center text-stone-400 shadow-sm">
                    <span className="material-symbols-outlined text-5xl mb-4 block">construction</span>
                    <p className="font-bold text-lg text-slate-900 mb-1">No Projects Found</p>
                    <p className="text-sm">We couldn't find any infrastructure projects for your constituency at this time.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-md transition-all group animate-fade-up">
                            {/* Before/After Images */}
                            <div className="aspect-video relative overflow-hidden bg-stone-100">
                                {project.after_image_url ? (
                                    <img src={project.after_image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-300">
                                        <span className="material-symbols-outlined text-4xl mb-2">image</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Progress Image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${getStatusColor(project.status, project.progress)}`}>
                                        {getStatusLabel(project.status, project.progress)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${project.icon_bg}`}>
                                        <span className="material-symbols-outlined text-xl">{project.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 text-sm truncate">{project.title}</h3>
                                        <p className="text-xs text-stone-500 capitalize">{project.type} Project</p>
                                    </div>
                                </div>

                                <p className="text-xs text-stone-600 line-clamp-2 mb-4 h-8">{project.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-[10px] font-bold">
                                        <span className="text-stone-500 uppercase tracking-wider">Progress</span>
                                        <span className="text-slate-900">{project.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${project.status === 'completed' ? 'bg-green-500' : 'bg-primary'}`}
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-stone-400 group-hover:text-primary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-sm">thumb_up</span>
                                            <span className="text-[10px] font-bold">{project.likes_count || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-stone-400">
                                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                                            <span className="text-[10px] font-bold">{project.comments_count || 0}</span>
                                        </div>
                                    </div>
                                    <button className="text-[10px] font-bold text-primary hover:underline">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
