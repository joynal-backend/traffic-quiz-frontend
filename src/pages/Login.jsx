import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "@/Context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ State for error messages
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // ✅ Use context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      // Send login request to the backend
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      console.log(res?.data.token);

      // Extract token from the response
      const  token  = res?.data

      if (!token) {
        throw new Error("Token not received from the server");
      }

      // Store token in local storage
      localStorage.setItem("token", token);

      // Update authentication state in context
      setIsAuthenticated(true);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError(error.response?.data?.error || "Invalid credentials"); // Display error message
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="p-5 bg-gray-200 rounded shadow">
        <h2 className="mb-3 text-xl font-bold">Admin Login</h2>
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />
        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {/* Submit Button */}
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;