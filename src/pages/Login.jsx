import { useState } from "react";
import { API, setAuth } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      setAuth(data.token);
      nav("/");
    } catch (e) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <form onSubmit={submit} className="card bg-base-100 w-full max-w-sm shadow-md">
        <div className="card-body space-y-2">
          <h1 className="card-title">Login</h1>
          <input className="input input-bordered" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="input input-bordered" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-primary mt-2">Login</button>
          <p className="text-sm">No account? <Link to="/register" className="link">Register</Link></p>
        </div>
      </form>
    </div>
  );
}
