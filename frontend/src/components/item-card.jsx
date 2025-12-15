import React from "react";
import { Link } from "react-router";

export default function ItemCard({item, dateTime, handleCreateChat}) {
                return (<div className="item-card" key={item.id}>
                        <Link to={`/post/${item.id}`}>
                        <div className="image-slider">
                            <img src={item.image_url} alt="item image" className="slider-image" />
                        </div>
                        <div className="card-details">
                            <h3>{item.title} - {item.type}</h3>
                            <p><strong>Description:</strong> {item.description}</p><br/>
                            <p><strong>Category:</strong> {item.category}</p><br/>
                            <p><strong>Location:</strong> {item.location}</p><br/>
                            <p><strong>Date & Time:</strong> {item.date}, {item.time}</p><br/>
                            <p><strong>Posted by: </strong>{item.name}</p>
                            <p style={{color: "#1E90FF"}} className="timestamp"><strong>Posted at: </strong>{dateTime.toLocaleString()}</p>
                            <br/>
                        </div>
                    </Link>
                            <button onClick={() => handleCreateChat(item.user_id)} className="contact-btn">Chat</button>
                    </div>)
}