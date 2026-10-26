import React, { useState } from "react";
import { X, UserPlus, AlertCircle, Mail, Loader2 } from "lucide-react";
import { addMemberToBoardApi } from "../services/boardServices";

interface InviteMemberModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function InviteMemberModal({ boardId, isOpen, onClose }: InviteMemberModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setLoading(true);
            setError("");
            setSuccessMsg("");

            const res = await addMemberToBoardApi(boardId, email.trim());
            setSuccessMsg(res.message || "Member invited successfully!");
            setEmail("");
            
            setTimeout(() => {
                onClose();
                setSuccessMsg("");
            }, 1500);
        } catch (err: any) {
            console.error("Invite Error:", err);
            setError(err.message || err.error || "Failed to invite member.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-purple-400" /> Invite Collaborator
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Collaborator Email *
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}