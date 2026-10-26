import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { loginUserApi } from "../services/authServices";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim()) {
            setError("Please fill in both email and password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await loginUserApi({ email: email.trim(), password });

            // Robust token extraction covering all MERN response formats
            const token = res?.token || res?.accessToken || res?.data?.token || res?.user?.token;

            if (token) {
                localStorage.setItem("token", token);
                navigate("/dashboard");
                return;
            }

            // Handle unverified account response message
            if (res?.message) {
                if (res.message.toLowerCase().includes("verify")) {
                    navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
                    return;
                }
                setError(res.message);
            } else {
                setError("Login failed. Missing authentication token.");
            }
        } catch (err: any) {
            const errorMessage = err.message || err.error || "An error occurred during login.";
            
            if (errorMessage.toLowerCase().includes("verify")) {
                navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
                return;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 space-y-6 shadow-xl">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                        <LogIn className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Log in</h2>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                            EMAIL ADDRESS
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

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-slate-300">
                                PASSWORD
                            </label>
                            <Link to="/forgot-password" className="text-xs text-purple-400 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-400 font-semibold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}