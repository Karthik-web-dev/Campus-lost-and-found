import { Link, useNavigate } from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faComments, faBell, faSuitcase, faLocationDot, faRightToBracket, faUserPlus, faUser, faArrowRightToBracket, faMoon, faSun} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { UserContext } from "../contexts/usercontext"

export default function Header({auth}) {  
    const {user, setUser} = React.useContext(UserContext)
    const navigate = useNavigate()
    const [isDarkMode, setIsDarkMode] = React.useState(false)

    React.useEffect(() => {
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    function handleLogout() {
        fetch('http://localhost:5000/api/logout', {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                        setUser(null)
                        auth(false)
                        navigate('/')
                        alert(data.message)
            })
            .catch(err => console.error(err))
    }

    return(
    <header>
            <Link to="/"><h1>Lost and Found</h1></Link>
            <ul className="options">
                {/* <li><FontAwesomeIcon icon={faMagnifyingGlass}/>Search</li> */}
                <li><Link to="/chat"><FontAwesomeIcon icon={faComments} className="icon"/>Chat</Link></li>
                <li><Link to="/posts"><FontAwesomeIcon icon={faSuitcase} className="icon"/>Posts</Link></li>
                <li><Link to="/report"><FontAwesomeIcon icon={faLocationDot} className="icon"/>Report</Link></li>
            </ul>

            {user?.name == null ? (
            <ul className="auth-options">
                {/* <li><FontAwesomeIcon icon={faBell} className="icon"/></li> */}
                <li onClick={() => setIsDarkMode(!isDarkMode)} className="dark-mode-toggle"><FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="icon"/></li>
                <li><Link to="/login"><FontAwesomeIcon icon={faRightToBracket} className="icon"/>Login</Link></li>
                <li className="signup"><Link to="/signup"><FontAwesomeIcon icon={faUserPlus} className="icon"/>SignUp</Link></li>
            </ul>) : (
                <>
                    <p><FontAwesomeIcon icon={faUser}/> Welcome, {user?.name}
                    <button className="logout" onClick={handleLogout}>Logout<FontAwesomeIcon icon={faArrowRightToBracket} className="icon" /></button></p>
                    <li onClick={() => setIsDarkMode(!isDarkMode)} className="dark-mode-toggle"><FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="icon"/></li>
                </>
                )}
    </header>
    )
}