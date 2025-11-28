import { useState, useEffect } from 'react';
import { Link } from 'react-router';

export default function ItemList({ isFound }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/posts", {
            method:"GET"
        })
            .then(res => res.json())
            .then(data => {setPosts(data.body)})
            .catch(err => console.error(err))
    }, [])


    const cardList = posts.map((item) => {
              const isoString = `${item.created_at}`;
              const dateTime  = new Date(isoString);
              return (
              <div className="item-card" key={item.id}>
                    <div className="image-slider">
                        <img src={item.image_url} alt="item image" className="slider-image" />
                    </div>
                    <div className="card-details">
                        <h3>{item.title}</h3>
                        <p><strong>Description:</strong> {item.description}</p><br/>
                        <p><strong>Category:</strong> {item.category}</p><br/>
                        <p><strong>Location:</strong> {item.location}</p><br/>
                        <p><strong>Date & Time:</strong> {item.date}, {item.time}</p><br/>
                        <p><strong>Posted by: </strong>{item.name}</p>
                        <p style={{color: "#1E90FF"}} className="timestamp"><strong>Posted at: </strong>{dateTime.toLocaleString()}</p>
                        <br/>
                        <Link to="/chat" className="contact-btn">Chat</Link>
                    </div>
                </div>)})


    return (
        <div className="item-page">
            <h1>{isFound ? "Found" : "Lost"}</h1>
            <ul>
                <li>Electronics</li>
                <li>Documents</li>
                <li>Clothing</li>
                <li>Jewelry</li>
                <li>Other</li>
                <p>Clear Filters</p>
            </ul>
            <div className="item-list">
                {cardList}
            </div>
        </div>
    );
}