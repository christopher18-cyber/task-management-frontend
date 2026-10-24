import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold">Task Manager Dashboard</h1>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-sm text-slate-300 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </header>

            <main>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                    <h2 className="text-lg font-semibold mb-2">Welcome Back!</h2>
                    <p className="text-slate-400 text-sm">Your Kanban boards and task management workspace will load here.</p>
                </div>
            </main>
        </div>
    );
}