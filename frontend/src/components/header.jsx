import { Link } from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faComments, faBell, faSuitcase, faLocationDot, faRightToBracket, faUserPlus} from "@fortawesome/free-solid-svg-icons"

export default function Header() {  
    return(
    <header>
            <Link to="/"><h1>Lost and Found</h1></Link>
            <ul style={{"backgroundColor": "#bec2be"}} className="options">
                {/* <li><FontAwesomeIcon icon={faMagnifyingGlass}/>Search</li> */}
                <li><Link to="/chat"><FontAwesomeIcon icon={faComments} className="icon"/>Chat</Link></li>
                <li><Link to="/lost"><FontAwesomeIcon icon={faSuitcase} className="icon"/>Lost</Link></li>
                <li><Link to="/found"><FontAwesomeIcon icon={faLocationDot} className="icon"/>Found</Link></li>
            </ul>

            <ul className="auth-options">
                <li><FontAwesomeIcon icon={faBell} className="icon"/></li>
                <li><Link to="/login"><FontAwesomeIcon icon={faRightToBracket} className="icon"/>Login</Link></li>
                <li className="signup"><Link to="/signup"><FontAwesomeIcon icon={faUserPlus} className="icon"/>SignUp</Link></li>
            </ul>
    </header>
    )
}