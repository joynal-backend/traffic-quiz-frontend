import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/Context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // ✅ Use context

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
     

      const res = await axios.post("https://traffic-master-backend-bay.vercel.app/admin/login", { username, password });

      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true); // ✅ Update authentication state
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-5 bg-gray-200 rounded shadow">
        <h2 className="mb-3 text-xl font-bold">Admin Login</h2>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-2 mb-2 border rounded" />
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">Login</button>
      </form>
    </div>
  );
}

export default Login;
