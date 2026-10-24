import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUserApi } from "../services/authServices";
import { UserPlus, Mail, Lock, AlertCircle } from "lucide-react";

export default function Login(){
    const [email, setEmail] = useState("")
    const [password, setPassword]= useState("")
    const [error, setError] = useState("")
    const [loading,setLoading] = useState(false)


    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try{
            const res = await loginUserApi({email,password})
            const token = res.data?.token || res.token
            if(token){
                localStorage.setItem("token",token)
                navigate("/dashboard")
            }
            else{
                setError("Login response didn't include an authentication token")
            }
        }catch(err:any){
            setError(err.message || err.error || "Failed to login, Please check your credentials")
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="max-w-md md:max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400 mb-3">
                    <UserPlus className="w-8 h-8"/>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Log in</h1>
                    {/* <p className="text-slate-400 text-sm mt-1">Join your team and manage tasks efficiently</p> */}
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0"/>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">

                    <div>
                        <label className="block text-xs font-medium text-slate-300 uppercase mb-2">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500"/>
                            <input
                            type="email"
                            required
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 uppercase mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500"/>
                            <input
                            type="password"
                            required
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            />
                        </div>
                    </div>
                    <button
                    type="submit"
                    disabled={loading}
                     className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-purple-600/25 disabled:opacity-50 text-sm"
                     >
                        {loading ? "Sign in...":"Login"}
                     </button>
                </form>
                <p className="text-center text-slate-400 text-sm mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-purple-400 hover:underline font-medium">
                         Sign Up
                    </Link>
                </p>
                <p className="text-center text-slate-400 text-sm mt-2">
                    Forgotten password?{"  "}
                    <Link to="/" className="text-purple-400 hover:underline font-medium">
                        Click here
                    </Link>
                </p>
            </div>
        </div>
    )
}