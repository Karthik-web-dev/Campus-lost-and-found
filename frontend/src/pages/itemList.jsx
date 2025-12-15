import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '../contexts/usercontext';
import { SocketContext } from '../contexts/socketcontext';
import React from 'react';
import ItemCard from '../components/item-card';


export default function ItemList({ isFound }) {
    const navigate = useNavigate();
    const {user, setUser} = useContext(UserContext)
    const {socket, convId} = useContext(SocketContext)

    const [posts, setPosts] = useState([]);
    const [cardList, setCardList] = React.useState()
    const [selectedCategory, setSelectedCategory] = React.useState()
    const [selectedType, setSelectedType] = React.useState()

    useEffect(() => {
        fetch("http://localhost:5000/api/posts", {
            method:"GET"
        })
            .then(res => res.json())
            .then(data => {
                setPosts(data.body)
                setCardList(data.body)
            })
            .catch(err => console.error(err))
    }, [])

    function handleCreateChat(user2) {
        console.log(user)
        if(!user || user.loggedIn===false) {
            alert("You need to login to chat...")
            return
        }
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

    function filterPosts(category, type) {
        const newCategory = category !== null ? category : selectedCategory;
        const newType = type !== null ? type : selectedType;

        setSelectedCategory(newCategory);
        setSelectedType(newType);

        const filteredPosts = posts.filter((item) => {
            const matchCategory = newCategory ? item.category === newCategory : true;
            const matchType = newType ? item.type === newType : true;
            return matchCategory && matchType;
        });

        setCardList(filteredPosts);
    }
    
    return (
        <div className="item-page">
            <h1>Posts about items</h1>
            <ul>
            {["Electronics", "Documents", "Clothing", "Jewelry", "Other"].map(cat => (
                <li
                key={cat}
                className={selectedCategory === cat ? "selected-filter" : ""}
                onClick={() => filterPosts(cat, null)}
                >
                {cat}
                </li>
            ))}
                <p onClick={() => {
                        setSelectedCategory(null);
                        setSelectedType(null);
                        setCardList(posts);
                }}>Clear Filters</p>
            </ul>
            <ul>
                <li className={selectedType === "found" ? "selected-filter" : ""} onClick={() => filterPosts(null, "found")}>Found</li>
                <li className={selectedType === "lost" ? "selected-filter" : ""} onClick={() => filterPosts(null, "lost")}>Lost</li>
            </ul>
            <div className="item-list">
                {cardList?.length === 0 ? <h1>No posts found!</h1> : 
            cardList?.map((itm) =>  {
              const isoString = `${itm.created_at}`;
              const dateTime  = new Date(isoString);
              return (<ItemCard key={itm.id} item={itm} dateTime={dateTime} handleCreateChat={handleCreateChat}/>)
            }
            )}
            </div>
        </div>
    );
}