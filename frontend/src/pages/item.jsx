import React from "react";
import { Link, useParams, useNavigate } from "react-router";
import "../assets/itempage.css"
import { UserContext } from "../contexts/usercontext";
import { SocketContext } from "../contexts/socketcontext";

export default function Post() {
    const {id} = useParams()
    const navigate = useNavigate()
    const {user, setUser, fetchUser} = React.useContext(UserContext)
    const [post, setPost] = React.useState({})
    const [author, setAuthor] = React.useState({})
    const {socket, convId} = React.useContext(SocketContext)
    
    React.useEffect(() => {
        fetch(`http://localhost:5000/api/post/${id}`, {
            method: "GET",
            headers: {"Content-Type":"application/json"}
        })
            .then(res => res.json())
            .then(data => {
                setPost(data.body.post)
                setAuthor(data.body.author)
            })
            .catch(err => console.error(err))
    }, [])

    function handleCreateChat(user2) {
        if(!user || user==null) {
            alert("For chatting, you need to login first!")
            return
        }
        if (user?.id === user2) return
        const data = {"user1": user.id, "user2":user2}
        fetch('http://localhost:5000/api/conversations/new', {
            method:"POST",
            credentials:"include",
            body: JSON.stringify(data),
            headers: {"Content-Type":"application/json"}
        })
            .then(res => res.json())     
            .then(data => {
                convId.current = data.conversation_id

                socket.emit("joinRoom", data.conversation_id)
                socket.emit("new_conversation", {
                    sender_id: user?.id,
                    receiver_id: user2,
                    conv_id: convId.current
                });

                navigate('/chat')
            })
            .catch(err => console.error(err))
    }
    
    return(
        <div className="page-container">
            <section className="image">
                <img src={post.image_url} />
            </section>
            <section className="details">
                <h1>{post.title}</h1>
                <p><strong>Brief Description:</strong> {post.description}</p>
                <p><strong>Item type and it's location: </strong>{post.type === 'found' ? `Someone found this item in ${post.location}` : `Someone lost this item in ${post.location}`}</p>
                <p><strong>{post.type === 'found' ? 'Found' : 'Lost'} on: </strong>{post?.date?.split("-").reverse().join("-")}</p> 
                <p><strong>Approximate time of {post.type === 'found' ? 'finding it' : 'losing it'}: </strong>{post.time}</p> 
                <p className="tag">{post.category}</p>

                <hr/>
                <h1>Details of the author of this post: </h1>
                <p><strong>Name: </strong>{author.name}</p>
                <p><strong>Division: </strong>{author.division}</p>

                <button onClick={() => handleCreateChat(post.user_id)} className="contact-btn">
                    {post.user_id === user?.id ? "You cannot chat with yourself!": "Chat with them"}
                </button>
                <br/>
            </section>
        </div>
    )
}