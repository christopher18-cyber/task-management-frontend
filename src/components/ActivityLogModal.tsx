import { useEffect, useState } from "react";
import { X, History, Loader2, AlertCircle } from "lucide-react";
import { getActivityLogsApi } from "../services/activityServices";

interface ActivityLogModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ActivityLogModal({ boardId, isOpen, onClose }: ActivityLogModalProps) {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen && boardId) {
            fetchLogs();
        }
    }, [isOpen, boardId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await getActivityLogsApi(boardId);
            setLogs(res.data || res.logs || []);
        } catch (err: any) {
            setError(err.message || "Failed to load activity logs.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-purple-400" /> Board Activity Log
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {!loading && !error && logs.length === 0 && (
                    <p className="text-center text-slate-500 text-xs py-8">
                        No activity recorded on this board yet.
                    </p>
                )}

                {!loading && logs.length > 0 && (
                    <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                        {logs.map((log, index) => (
                            <div key={index} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs flex justify-between items-center">
                                <span className="text-slate-300">{log.action || log.description}</span>
                                <span className="text-slate-500 text-[10px]">
                                    {new Date(log.createdAt || Date.now()).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}