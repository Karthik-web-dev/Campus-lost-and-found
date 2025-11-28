import { Link } from "react-router";
export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="copyright">© 2025 Lost & Found. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/contact" className="footer-link">Contact Us</Link>
                    <span className="separator">|</span>
                    <Link to="/about" className="footer-link">About Us</Link>
                </div>
                <p className="made-by">
                    Made by: <span className="makers-list">Akshay Karthik Akella, Akul Sharma, Varad Alande, Ayush Alandkar</span>
                </p>
            </div>
        </footer>
    );
}