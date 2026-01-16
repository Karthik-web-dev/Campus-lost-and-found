import { Link, useNavigate } from "react-router";
import EmojiTab from "../components/emojitab";
import React from "react";
import { UserContext } from "../contexts/usercontext";
import { SocketContext } from "../contexts/socketcontext";
import ReactMarkdown from 'react-markdown';
import * as emoji from "node-emoji";


export default function Chat() {
    const navigate = useNavigate()
    const {user, setUser, fetchUser} = React.useContext(UserContext)
    const {socket, convId} = React.useContext(SocketContext)

    const [client, setClient] = React.useState()
    const [messages, setMessages] = React.useState([])
    const [currentConversation, setCurrentConversation] = React.useState(-1)
    const [emojiListVisible, setEmojiListVisible] = React.useState(false)
    const [status, setStatus] = React.useState(null)

    const messageRef = React.useRef()
    const typingTimer = React.useRef()
    const messagesEndRef = React.useRef(null);


    // Function to insert emoji into textarea
    const insertEmoji = (emoji) => {
        if (messageRef.current) {
            const start = messageRef.current.selectionStart;
            const end = messageRef.current.selectionEnd;
            const text = messageRef.current.value;
            messageRef.current.value = text.slice(0, start) + emoji + text.slice(end);
            messageRef.current.focus();
            messageRef.current.setSelectionRange(start + emoji.length, start + emoji.length);
        }
    };

    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };


    React.useEffect(() => {
        console.log(user)
        if (user === undefined) return  // Fixed: Completed the condition
        if (!user?.loggedIn) {
            console.log("CHAT", user?.loggedIn)
            navigate('/login')
            alert("You need to login before chatting!")
            return
        }
    }, [user])  // Added dependency for user

    React.useEffect(() => {
        if (!socket) return

        const handleIncomingMessage = (msg) => {
            setMessages((prev) => [...prev, msg])
        }

        socket.on("message", handleIncomingMessage)
        // scrollToBottom()
        
        return () => socket.off("message", handleIncomingMessage)
    }, [socket])

    React.useEffect(() => {
    scrollToBottom();
    }, [messages]);


    function initConversation(convoId) {
        if (!socket || !user.loggedIn) {
            navigate('/login')
            alert("You need to login before chatting!!")
            return
        }

        if (convId.current != -1) {
                socket.emit("leaveRoom", convoId)
                setStatus(null)
        }
        convId.current = convoId
        setCurrentConversation(convId.current)
        socket.emit("joinRoom", convId.current, (messageHistory) => {
                setMessages(messageHistory.messages)
                setClient(messageHistory.client)
            })
    }

    function handleSendMessage(e) {
        e.preventDefault()
        const text = messageRef.current.value
        if (!socket) {
            navigate('/login')
            alert("You need to login before chatting!")
            return
        }
        if (!text) {
            alert("Type a message.")
            return
        }

        const data = {conv_id: convId.current, sender_id: user.id, content:text}
        socket.emit("message", data)
        messageRef.current.value = ""
    }

    function handleTypingStatus() {
        socket.emit("typing", convId.current)
        if (typingTimer.current) clearTimeout(typingTimer.current)

        typingTimer.current = setTimeout(() => {
            socket.emit("stop_typing", convId.current)
            typingTimer.current = null
        }, 1500)
    }

    React.useEffect(() => {
        if (!socket) return
        
        socket.on("user_typing", (data) => {
            console.log(data.convId)
            if (data.convId === currentConversation) {
                setStatus("typing...")
            }
        })

        socket.on("user_stopped_typing", (data) => {
            if (data.convId === currentConversation) {
                setStatus("In the Chat")
            }
        })

        return () => {
            socket.off("user_typing")
            socket.off("user_stopped_typing")
        }
    }, [socket, currentConversation])

    React.useEffect(() => {
        if (!socket) return;
        console.log("Chat: ", socket)

        const handleNewConversation = () => {
            console.log("Chat: ")
            console.log("Works!")
            fetchUser()
            // console.log(fetchUser())
        }

        socket.on("new_conversation_created", handleNewConversation)

        return () => socket.off("new_conversation_created", handleNewConversation)
    }, [socket])

    const listOfClients = user?.clients?.map((client) => {
        return(<div 
            onClick={() => initConversation(client?.conversation_id)} key={client?.conversation_id} 
            className={`chat-item ${currentConversation === client?.conversation_id ? "active" : ""}`}>
                {client?.name} - {client?.post?.title}
            </div>)
    })

    const listOfMessages = messages?.map((message) => (
        <div key={message.id} className={`message 
            ${user?.id === message.sender_id ? "sent" : "received"} 
            ${message.is_moderated ? "moderated-msg" : "user-msg"}
          `}>
            <h4 className="message-title">{message.sender_id === user?.id ? "You" : client?.name}</h4>
            <ReactMarkdown>{message.content}</ReactMarkdown>
            <div className="timestamp">{message.timestamp}</div>
        </div>
    ))

const replaceShortcodes = (text) => {
  return text.replace(/:(\w+):/g, (_, name) => {
    const e = emoji.get(name);
    if (e === undefined) return `:${name}:`;
    return e; // 
  });
};

  // Live input handler
  const handleInputChange = (e) => {
    const cursorPos = e.target.selectionStart;
    const newText = replaceShortcodes(e.target.value);

    messageRef.current.value = newText;

    // Keep cursor in same position
    messageRef.current.setSelectionRange(cursorPos, cursorPos);
  };

    return(
        <div className="chat-page">
            <div className="chat-menu">
                {listOfClients}
            </div>

            <div className="chat-interface">
                {currentConversation === -1 ? (
                    <h1 className="welcome-message">Welcome! Select a conversation</h1>
                ) : (
                    <>
                        <div className="chat-header">{client?.name}
                            <Link to={`/post/${client?.post?.id}`} className="user-info-box">
                            <img src={client?.post?.image_url} alt="User Avatar" className="user-avatar" />
                            <span className="user-title">{client?.post?.title}</span> 
                            </Link>
                            <br/><small><i>{status}</i></small>
                        </div>
                        <div className="messages">
                            {listOfMessages}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="input-area">
                            <textarea
                                className="message-input"
                                placeholder="Type a message..."
                                ref={messageRef}
                                rows={1} // Start with 1 row; auto-expands on new lines
                                onChange={(e) => {
                                  handleTypingStatus();
                                  handleInputChange(e);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <button
                                onClick={() => setEmojiListVisible(!emojiListVisible)}
                                className="emoji-btn"
                            >
                                😊
                            </button>
                            <button className="send-btn" onClick={handleSendMessage}>➤</button>
                            {emojiListVisible && <EmojiTab onEmojiSelect={insertEmoji} />}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}