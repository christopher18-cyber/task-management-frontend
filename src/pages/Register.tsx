import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUserApi } from "../services/authServices";
import { UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";

export default function Register(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword]= useState("")
    const [error, setError] = useState("")
    const [loading,setLoading] = useState(false)


    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try{
            await registerUserApi({name,email,password})

            navigate("/login", {state:{message:"Registration successful! Please Login."}})
        }catch(err:any){
            setError(err.response?.data?.message || "Failed to register, Please try again")
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
                    <h1 className="text-2xl font-bold text-white">Create an account</h1>
                    <p className="text-slate-400 text-sm mt-1">Join your team and manage tasks efficiently</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0"/>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 uppercase mb-2">Full name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500"/>
                            <input
                            type="text"
                            required
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            />
                        </div>
                    </div>

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
                        {loading ? "Creating Account...":"Sign up"}
                     </button>
                </form>
                <p className="text-center text-slate-400 text-sm mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-400 hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}