import { Link, useNavigate } from "react-router-dom"
import React from "react"
import { UserContext } from "../contexts/usercontext"

export default function Login() {
  // eslint-disable-next-line no-unused-vars
  const {user, setUser} = React.useContext(UserContext)
  const navigate = useNavigate()
  const email = React.useRef()
  const password = React.useRef()

  //Check if user is already logged in :
  React.useEffect(() => {
    fetch('http://localhost:5000/api/me', {
      credentials:"include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.body?.loggedIn === true) {
      navigate('/chat')
      }
    })
  }, [navigate])

  function handleLogin(e) {
    e.preventDefault()
    const payload = {
      email:email.current.value,
      password:password.current.value
    }

    fetch("http://localhost:5000/api/login", {
      method:"POST",
      credentials:"include",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.body)
      if (data.status === 'success') {
        setUser(data.body)
        navigate('/chat')
      } else {
        alert(data.message)
      }
    })
    .catch(err => {
      alert("Error: ", err)
      console.error(err)
    })
  }

  return (
    <div className="signup-page">
    <div className="auth-form">
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <label>
          Enter your college email:
          <input
            type="email"
            id="email"
            name="mail"
            placeholder="firstname.Prn@vit.edu"
            ref={email}
          required/>
        </label>
        
        <label>
          Enter your password:
          <input
            type="password"
            id="pass1"
            name="pass1"
            placeholder="Password"
            ref={password}
          required/>
        </label>

        <button type="submit">Submit</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up →</Link></p>
    </div>
    </div>
    )
}