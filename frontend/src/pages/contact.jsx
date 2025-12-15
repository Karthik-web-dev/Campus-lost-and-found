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
                        <p>Email: <Link to="mailto:akul.1251070905@vit.edu" className="contact-link">akul.1251070905@vit.edu</Link></p>
                    </div>
                    <div className="contact-item">
                        <h3>Varad Alande</h3>
                        <p>Email: <Link to="mailto:varad.1251070507@vit.edu" className="contact-link">varad.1251070507@vit.edu</Link></p>
                    </div>
                    <div className="contact-item">
                        <h3>Ayush Alandkar</h3>
                        <p>Email: <Link to="mailto:ayush.1251070236@vit.edu" className="contact-link">ayush.1251070236@vit.edu</Link></p>
                    </div>
                </div>
                
                <div className="university-details">
                    <div className="detail-item">
                        <h3>College Location</h3>
                        <p>666, Upper Indiranagar, Bibwewadi, Pune, Maharashtra- 411 037</p>
                    </div>
                    <div className="detail-item">
                        <h3>Phone</h3>
                        <p><Link to="tel:+1234567890" className="contact-link">+91 7058432258</Link></p>
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