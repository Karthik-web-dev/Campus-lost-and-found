import { Link, useNavigate } from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faComments, faBell, faSuitcase, faLocationDot, faRightToBracket, faUserPlus, faArrowRightArrowLeft, faArrowRightToBracket} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { UserContext } from "../contexts/usercontext"

export default function Header() {  
    const {user, setUser} = React.useContext(UserContext)
    const navigate = useNavigate()

    function handleLogout() {
        fetch('http://localhost:5000/api/logout', {
            method:"GET",
            credentials:"include",
            headers: {
                "Content-Type":"application/json"
            }
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err))
        setUser(null)
        navigate('/')
    }



    return(
    <header>
            <Link to="/"><h1>Lost and Found</h1></Link>
            <ul className="options">
                {/* <li><FontAwesomeIcon icon={faMagnifyingGlass}/>Search</li> */}
                <li><Link to="/chat"><FontAwesomeIcon icon={faComments} className="icon"/>Chat</Link></li>
                <li><Link to="/lost"><FontAwesomeIcon icon={faSuitcase} className="icon"/>Lost</Link></li>
                <li><Link to="/found"><FontAwesomeIcon icon={faLocationDot} className="icon"/>Found</Link></li>
            </ul>

            {user?.name == null ? (
            <ul className="auth-options">
                {/* <li><FontAwesomeIcon icon={faBell} className="icon"/></li> */}
                <li><Link to="/login"><FontAwesomeIcon icon={faRightToBracket} className="icon"/>Login</Link></li>
                <li className="signup"><Link to="/signup"><FontAwesomeIcon icon={faUserPlus} className="icon"/>SignUp</Link></li>
            </ul>) : (
                <>
                    <p>Welcome, {user?.name}
                    <button className="logout" onClick={handleLogout}>Logout<FontAwesomeIcon icon={faArrowRightToBracket} className="icon" /></button></p>
                </>
                )}
    </header>
    )
}