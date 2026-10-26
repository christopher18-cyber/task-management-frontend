import React, { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
// Assuming you have or will create this service endpoint:
// import { forgotPasswordApi } from "../services/authServices";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setLoading(true);
            setError("");
            setMessage("");

            // Replace with your actual API call:
            // await forgotPasswordApi(email);

            setMessage("If an account with that email exists, a password reset link has been sent.");
        } catch (err: any) {
            setError(err.message || "Failed to send reset instructions.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 space-y-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400">
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Reset Password</h2>
                        <p className="text-xs text-slate-400">Enter your email to receive recovery instructions</p>
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Instructions"}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-800">
                    <Link to="/login" className="text-xs text-purple-400 hover:underline flex items-center justify-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}