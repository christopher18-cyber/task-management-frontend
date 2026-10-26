import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Mail, KeyRound } from "lucide-react";
import { verifyEmailApi } from "../services/authServices";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    
    // Automatically extract email and token from URL params
    const emailParam = searchParams.get("email") || "";
    const tokenParam = searchParams.get("token") || "";

    // Pre-fill state with URL parameters if available
    const [email, setEmail] = useState(emailParam);
    const [token, setToken] = useState(tokenParam);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // Keep state updated if URL query parameters change
    useEffect(() => {
        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);
    }, [emailParam, tokenParam]);

    const executeVerification = async (verificationEmail: string, verificationToken: string) => {
        if (!verificationEmail || !verificationToken) {
            setStatus("error");
            setMessage("Please provide both email and verification code.");
            return;
        }

        try {
            setStatus("loading");
            setMessage("Verifying your account...");
            const res = await verifyEmailApi({ email: verificationEmail, token: verificationToken } as any);
            setStatus("success");
            setMessage(res.message || "Email verified successfully!");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Email verification failed.");
        }
    };

    // Auto-trigger verification if both email and token exist in link params
    useEffect(() => {
        if (emailParam && tokenParam) {
            executeVerification(emailParam, tokenParam);
        }
    }, [emailParam, tokenParam]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeVerification(email.trim(), token.trim());
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 text-center space-y-6 shadow-xl">
                <div className="flex justify-center">
                    {status === "loading" && <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />}
                    {status === "success" && <CheckCircle2 className="w-12 h-12 text-emerald-400" />}
                    {status === "error" && <XCircle className="w-12 h-12 text-red-400" />}
                    {status === "idle" && (
                        <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-2xl text-purple-400">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Email Verification</h2>
                    <p className="text-xs text-slate-400">
                        {message || "Please enter your verification code to continue."}
                    </p>
                </div>

                {status !== "success" && (
                    <form onSubmit={handleManualSubmit} className="space-y-4 text-left">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Email Address
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
                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                Verification Code / Token
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    placeholder="Enter verification code"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                                />
                                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                            {status === "loading" ? "Verifying..." : "Verify Account"}
                        </button>
                    </form>
                )}

                {status === "success" && (
                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        Proceed to Login <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}