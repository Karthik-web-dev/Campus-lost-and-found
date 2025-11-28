import { Link } from "react-router";

export default function ContactUs() {
    return (
        <div className="contact-us-page">
            <div className="contact-container">
                <h1>Contact Us</h1>
                <p>If you have any questions or need assistance, reach out to our team:</p>
                
                <div className="contact-list">
                    <div className="contact-item">
                        <h3>Akshay Karthik Akella</h3>
                        <p>Email: <Link to="mailto:akshaykarthik.1251070324@vit.edu" className="contact-link">john.doe@vit.edu</Link></p>
                    </div>
                    <div className="contact-item">
                        <h3>Akul Sharma</h3>
                        <p>Email: <Link to="mailto:akul.smith@vit.edu" className="contact-link">jane.smith@vit.edu</Link></p>
                    </div>
                    <div className="contact-item">
                        <h3>Varad Alande</h3>
                        <p>Email: <Link to="mailto:varad.johnson@vit.edu" className="contact-link">alex.johnson@vit.edu</Link></p>
                    </div>
                    <div className="contact-item">
                        <h3>Ayush Alandkar</h3>
                        <p>Email: <Link to="mailto:ayush.davis@vit.edu" className="contact-link">emily.davis@vit.edu</Link></p>
                    </div>
                </div>
                
                <div className="university-details">
                    <div className="detail-item">
                        <h3>University Location</h3>
                        <p>123 University Avenue, Cityville, State 12345, Country</p>
                    </div>
                    <div className="detail-item">
                        <h3>Phone</h3>
                        <p><Link to="tel:+1234567890" className="contact-link">+1 (234) 567-890</Link></p>
                    </div>
                    <div className="detail-item">
                        <h3>Email</h3>
                        <p><Link to="mailto:info@vit.edu" className="contact-link">info@vit.edu</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}