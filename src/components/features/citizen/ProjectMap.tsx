"use client";
import { motion, AnimatePresence } from "framer-motion";
import { InfrastructureProject } from "@/lib/types";

interface ProjectMapProps {
    projects: InfrastructureProject[];
    onProjectSelect?: (project: InfrastructureProject) => void;
    selectedId?: number | null;
}

export default function ProjectMap({ projects, onProjectSelect, selectedId }: ProjectMapProps) {
    // Mock city grid segments for a "Smart City" look
    const blocks = [
        { d: "M 0 0 L 100 0 L 100 100 L 0 100 Z", fill: "fill-slate-50" },
        { d: "M 110 0 L 210 0 L 210 80 L 110 80 Z", fill: "fill-slate-50" },
        { d: "M 0 110 L 80 110 L 80 210 L 0 210 Z", fill: "fill-slate-50" },
        { d: "M 90 110 L 210 110 L 210 210 L 90 210 Z", fill: "fill-slate-50" },
        { d: "M 220 0 L 320 0 L 320 100 L 220 100 Z", fill: "fill-stone-50" },
        { d: "M 220 110 L 320 110 L 320 210 L 220 210 Z", fill: "fill-stone-50" },
    ];

    const roads = [
        "M 105 0 L 105 210", // Vertical
        "M 0 105 L 320 105", // Horizontal
        "M 215 0 L 215 210",
        "M 85 110 L 85 210",
    ];

    // Map projects to SVG coordinates (normalized to 320x210)
    // If proj.lat/lng are null, we use deterministic mock positions based on ID
    const getPos = (p: InfrastructureProject) => {
        if (p.lat && p.lng) {
            // Mapping real lat/lng to our 320x210 box is complex without a bounding box
            // We'll use a simple modulo for the demo if they are just placeholders
            return { x: (Math.abs(p.lat) * 100) % 300 + 10, y: (Math.abs(p.lng) * 100) % 190 + 10 };
        }
        const x = (p.id * 73) % 280 + 20;
        const y = (p.id * 127) % 170 + 20;
        return { x, y };
    };

    return (
        <div className="relative w-full aspect-[16/10] bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-inner">
            <svg viewBox="0 0 320 210" className="w-full h-full">
                {/* City Blocks */}
                {blocks.map((b, i) => (
                    <motion.path
                        key={i}
                        d={b.d}
                        className={`${b.fill} stroke-slate-200/50 stroke-[0.5]`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                    />
                ))}

                {/* Roads */}
                {roads.map((r, i) => (
                    <motion.path
                        key={`r-${i}`}
                        d={r}
                        className="stroke-stone-200 stroke-2 fill-none stroke-dasharray-[4,2]"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                ))}

                {/* Project Markers */}
                {projects.map((p, i) => {
                    const pos = getPos(p);
                    const isSelected = selectedId === p.id;
                    const statusColor = p.progress === 100 ? "#10b981" : "#f59e0b";

                    return (
                        <motion.g
                            key={p.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 + i * 0.05 }}
                            className="cursor-pointer group"
                            onClick={(e) => {
                                e.stopPropagation();
                                onProjectSelect?.(p);
                            }}
                        >
                            {/* Pulse for active projects */}
                            {p.progress < 100 && (
                                <circle cx={pos.x} cy={pos.y} r={isSelected ? 10 : 6} fill={statusColor} opacity="0.2">
                                    <animate attributeName="r" from="6" to="15" dur="1.5s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            )}

                            {/* Marker Base */}
                            <circle
                                cx={pos.x}
                                cy={pos.y}
                                r={isSelected ? 6 : 4}
                                fill={isSelected ? "#0EA5E9" : statusColor}
                                className="stroke-white stroke-[1.5] shadow-lg transition-all duration-300 transform group-hover:scale-125"
                            />

                            {/* Tooltip Link */}
                            {isSelected && (
                               <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                                    <rect 
                                        x={pos.x - 30} 
                                        y={pos.y - 25} 
                                        width={60} 
                                        height={12} 
                                        rx={2} 
                                        className="fill-slate-900/90 backdrop-blur-md" 
                                    />
                                    <text
                                        x={pos.x}
                                        y={pos.y - 17}
                                        textAnchor="middle"
                                        className="text-[4px] font-bold fill-white pointer-events-none"
                                    >
                                        {p.title}
                                    </text>
                               </motion.g>
                            )}
                        </motion.g>
                    );
                })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-3 left-3 bg-white/x backdrop-blur-md rounded-lg border border-white/40 p-2 shadow-sm flex gap-3">
                <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#10b981]" />
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="size-2 rounded-full bg-[#f59e0b]" />
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Active</span>
                </div>
            </div>

            {/* Hint */}
            <div className="absolute top-3 right-3 bg-slate-900/10 text-slate-900 text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                INTERACTIVE MAP
            </div>
        </div>
    );
}
