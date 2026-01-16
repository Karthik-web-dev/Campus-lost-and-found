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
                    conv_id: convId.current,
                    post_id: post.id
                });

                navigate('/chat')
            })
            .catch(err => console.error(err))
    }

    console.log("user: ", user, "author: ", author)
    
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

                <button 
                    onClick={() => handleCreateChat(post.user_id)} 
                    className="contact-btn"
                    style={{
                        backgroundColor: post.user_id === user?.id ? '#ccc' : '#28a745',  // Gray if disabled, blue otherwise
                        color: 'black',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        fontSize: '16px',
                        cursor: post.user_id === user?.id ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease',
                        marginTop: '10px'
                    }}
                    disabled={post.user_id === user?.id}  // Optional: Disable the button if it's the user's own post
                >
                    {post.user_id === user?.id ? "You cannot chat with yourself!": "Chat with them"}
                </button>
                
                {user?.id === author?.id ? (
                <Link 
                    to={`/post/edit/${id}`}
                    style={{
                    display: 'inline-block',
                    backgroundColor: '#28a745',  // Green for edit action
                    color: 'white',
                    textDecoration: 'none',  // Remove default underline
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    marginTop: '10px'
                    }}
                >
                    Edit Post
                </Link>
                ) : " "}
                <br/>
            </section>
        </div>
    )
}