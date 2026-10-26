import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteBoardModalProps {
    isOpen: boolean;
    boardTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteBoardModal({
    isOpen,
    boardTitle,
    onClose,
    onConfirm,
}: DeleteBoardModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" /> Delete Board
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                    Are you sure you want to delete <span className="font-bold text-white">"{boardTitle}"</span>? This will permanently remove all associated columns, task cards, and activity logs. This action cannot be undone.
                </p>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                        Delete Board
                    </button>
                </div>
            </div>
        </div>
    );
}