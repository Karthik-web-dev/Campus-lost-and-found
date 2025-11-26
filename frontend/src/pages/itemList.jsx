import { useState } from 'react';
import { Link } from 'react-router';

export default function ItemList({ isFound }) {
    const [showForm, setShowForm] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // For slider

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            location: formData.get("location"),
            datetime: formData.get("datetime"),
            type: isFound ? "found" : "lost",
            userid: 1, //hardcoded
            image_url: "https://images.unsplash.com/photo-1493558103817-58b2924bce98" //hardcoded
        };
        console.log(data);
        fetch("http://localhost:5000/api/create", {
            method: "POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));
    };

    // Sample images for slider (replace with backend data)
    const images = [
        "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0"
    ];

    // Slider navigation
    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    // Sample item data (replace with backend data)
    const item = {
        title: "{title}",
        description: "{description}",
        category: "{category}",
        location: "{location}",
        datetime: "{datetime}",
        type: "{type}"
    };

    return (
        <div className="item-page">
            <h1>{isFound ? "Found" : "Lost"}</h1>
            <ul>
                <li>Stationary</li>
                <li>Electronics</li>
                <li>Other</li>
                <p>Clear Filters</p>
            </ul>
            <div className="item-list">
                {/* Sample Card */}
                <div className="item-card">
                    <div className="image-slider">
                        <button className="slider-btn prev" onClick={prevImage}>‹</button>
                        <img src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`} className="slider-image" />
                        <button className="slider-btn next" onClick={nextImage}>›</button>
                    </div>
                    <div className="card-details">
                        <h3>{item.title}</h3>
                        <p><strong>Description:</strong> {item.description}</p>
                        <p><strong>Category:</strong> {item.category}</p>
                        <p><strong>Location:</strong> {item.location}</p>
                        <p><strong>Date & Time:</strong> {item.datetime}</p>
                        <p><strong>Type:</strong> {item.type}</p>
                        <Link to="/chat" className="contact-btn">Chat</Link>
                    </div>
                </div>
            </div>

            {/* Circular + button at bottom right */}
            <button className="add-button" onClick={() => setShowForm(!showForm)}>+</button>

            {/* Modal overlay and content */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-form-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Submit a {isFound ? "Found" : "Lost"} item report</h2>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="title">Title:</label>
                            <input type="text" id="title" name="title" required />

                            <label htmlFor="description">Description:</label>
                            <textarea id="description" name="description" rows="4" required></textarea>

                            <label htmlFor="category">Category:</label>
                            <select id="category" name="category" required>
                                <option value="">Select a category</option>
                                <option value="Stationary">Stationary</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Other">Other</option>
                            </select>

                            <label htmlFor="location">Location:</label>
                            <input type="text" id="location" name="location" required />
                                                        
                            <label htmlFor="datetime">Date and Time:</label>
                            <input type="datetime-local" id="datetime" name="datetime" required />

                            <label htmlFor="image">Upload Image:</label>
                            <input type="file" id="image" name="image" accept="image/*" />

                            <button type="submit">Submit</button>
                            <p>Your email and phone number will be shared.</p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}