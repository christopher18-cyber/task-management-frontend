import React, { useState } from "react";
import { X } from "lucide-react";
import { createColumnApi } from "../services/columnServices";
import type { Column } from "../types/kanbas"; // or "../types/kanbas" based on your project setup

interface CreateColumnModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
    onColumnCreated: (newColumn: Column) => void;
}

export default function CreateColumnModal({
    boardId,
    isOpen,
    onClose,
    onColumnCreated,
}: CreateColumnModalProps) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Debug check
        if (!boardId) {
            setError("Active board ID is missing. Please select or create a board first.");
            return;
        }
        if (!title.trim()) return;

        try {
            setLoading(true);
            setError("");
            
            const newColumn = await createColumnApi({ title, boardId });
            onColumnCreated(newColumn);
            setTitle("");
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create column.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-white">Create New Column</h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Column Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Code Review, Testing"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-slate-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Column"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}