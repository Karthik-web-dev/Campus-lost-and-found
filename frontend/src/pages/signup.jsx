import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    prn: "",
    name: "",
    class: "",
    password: ""
  });

  function matchPassword() {
    return password !== "" && confirmPass !== "" && password !== confirmPass;
  }

  function validatePassword() {
    return password.length < 8;
  }

  function validateConfirmPassword() {
    return confirmPass.length < 8;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  async function signup(e) {
    e.preventDefault();
    if (matchPassword() || validatePassword() || validateConfirmPassword()) return;

    setLoading(true);

    try {
      const payload = { ...form, password };
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await res.json();
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
      setForm({
        email: "",
        prn: "",
        name: "",
        class: "",
        password: ""
      });
      setPassword("");
      setConfirmPass("");
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Signing up...</p>
        </div>
      )}

      <div className="auth-form">
        <h1>Sign Up</h1>
        <form onSubmit={signup}>
          <label>
            Enter your college email:
            <input
              type="email"
              name="email"
              placeholder="firstname.Prn@vit.edu"
              onChange={handleChange}
              value={form.email}
              required
            />
          </label>

          <label>
            Enter your college PRN Number:
            <input
              type="number"
              name="prn"
              placeholder="PRN Number"
              onChange={handleChange}
              value={form.prn}
              required
            />
          </label>

          <label>
            Enter your name:
            <input
              type="text"
              name="name"
              placeholder="Your name"
              onChange={handleChange}
              value={form.name}
              required
            />
          </label>

          <label>
            Enter your class and division:
            <input
              type="text"
              name="class"
              placeholder="Example: FYCS-A"
              onChange={handleChange}
              value={form.class}
              required
            />
          </label>

          <label>
            Set your password:
            <input
              type="password"
              name="pass1"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </label>
          {validatePassword() && (
            <div className="error-message">❌ Password should be at least 8 characters</div>
          )}

          <label>
            Confirm your password:
            <input
              type="password"
              name="pass2"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPass(e.target.value)}
              value={confirmPass}
              required
            />
          </label>

          {validateConfirmPassword() && (
            <div className="error-message">❌ Confirm Password should be at least 8 characters</div>
          )}

          {matchPassword() && (
            <div className="error-message">❌ Passwords do not match</div>
          )}


          <button type="submit" disabled={loading}>Submit</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Sign in instead →</Link>
        </p>
      </div>
    </div>
  );
}
