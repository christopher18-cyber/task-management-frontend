import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const Login = () => <div className="p-8 text-center text-2xl font-bold">Login page(Coming up soon)</div>
const Register = () => <div className="p-8">Register Page (Coming up)</div>
const KanbanDashboard = () => <div className="p-8 text-center text-2xl font-bold">Kanban Board Dashboard (Coming up)</div>


export default function App(){
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<KanbanDashboard/>}/>
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </Router>
  )
}