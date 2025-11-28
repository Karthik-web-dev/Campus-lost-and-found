import React from "react";
import {Link, useNavigate} from "react-router-dom"

export default function Signup() {
  const [password, setPassword] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const navigate = useNavigate()
  const [form, setForm] = React.useState({
    email:"",
    prn:"",
    name:"",
    class:"",
    password:""
  });

  function matchPassword() {
    return (password !== "" && confirmPass !== "" && password !== confirmPass)
  }

  function validatePassword(){
      const validated = confirmPass.length >= 8 && password.length >= 8
      if (validated === true) {
        return false
      } else {
        return true
      }
  }

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};


  function signup(e) {
    e.preventDefault()
    console.log("worked")
    if (matchPassword() === false && validatePassword() === false) {
      const payload = {
        ...form,
        password:password
      }

    console.log(payload)
    fetch('http://localhost:5000/api/signup', {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
    navigate('/login')
    setForm({
    email:"",
    prn:"",
    name:"",
    class:"",
    password:""
  })
    setPassword("")
    setConfirmPass("")
    } 
  }

  return (
    <div className="signup-page">
    <div className="auth-form">
      <h1>Sign Up</h1>
      <form onSubmit={signup}>
        <label>
          Enter your college email:
          <input
            type="email"
            id="email"
            name="email"
            placeholder="firstname.Prn@vit.edu"
            onChange={handleChange}
            value={form.email}
          required/>
        </label>

        <label>
          Enter your college PRN Number:
          <input
            type="number"
            id="prn"
            name="prn"
            placeholder="PRN Number"
            onChange={handleChange}
            value={form.prn}
          required/>
        </label>

        <label>
          Enter your name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            onChange={handleChange}
            value={form.name}
          required/>
        </label>

        <label>
          Enter your class and division:
          <input
            type="text"
            id="class"
            name="class"
            placeholder="Example: FYCS-A"
            onChange={handleChange}
            value={form.class}
          required/>
        </label>

        <label>
          Set your password:
          <input
            type="password"
            id="pass1"
            name="pass1"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          required/>
        </label>

        <label>
          Confirm your password:
          <input
            type="password"
            id="pass2"
            name="pass2"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPass(e.target.value)}
            value={confirmPass}
          required/>
        </label>

        {matchPassword() && (
          <div id="errorMessage" className="error-message">
            ❌ Passwords do not match
          </div>
        )}

        {validatePassword() && (
          <div id="errorMessage" className="error-message">
            ❌ Password should be more than 8 characters
          </div>
        )}

        <button type="submit">Submit</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in instead →</Link></p>
    </div>
    </div>
  );
}
