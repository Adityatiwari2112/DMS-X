import { useState } from "react";
import { API } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", { name, email, password });
      nav("/login");
    } catch (e) {
      alert("Register failed");
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center p-6">
      <form onSubmit={submit} className="card bg-base-100 w-full max-w-sm shadow-md">
        <div className="card-body space-y-2">
          <h1 className="card-title">Create Account</h1>
          <input className="input input-bordered" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <input className="input input-bordered" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="input input-bordered" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-primary mt-2">Register</button>
          <p className="text-sm">Already have an account? <Link to="/login" className="link">Login</Link></p>
        </div>
      </form>
    </div>
  );
}
