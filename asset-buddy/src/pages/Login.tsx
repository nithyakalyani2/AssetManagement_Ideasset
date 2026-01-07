import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Login
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { userId, role } = loginRes.data;

      if (!userId || !role) {
        throw new Error("Invalid login response");
      }

      // 2️⃣ Fetch user details
      const userRes = await axios.get(`${BASE_URL}/users/${userId}`);

      // 3️⃣ Store everything
      localStorage.setItem("userId", String(userId));
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(userRes.data));

      // 4️⃣ Navigate
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/my-assets");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-foreground">Login</h2>

        {error && (
          <p className="text-destructive mb-4 text-sm font-medium">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
