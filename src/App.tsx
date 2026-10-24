import { BrowserRouter as Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
// const Login = () => <div className="p-8 text-center text-2xl font-bold">Login page(Coming up soon)</div>
// const Register = () => <div className="p-8">Register Page (Coming up)</div>
// const KanbanDashboard = () => <div className="p-8 text-center text-2xl font-bold">Kanban Board Dashboard (Coming up)</div>


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}