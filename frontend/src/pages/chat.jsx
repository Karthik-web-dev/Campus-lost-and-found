import { Link, useNavigate } from "react-router";
import EmojiTab from "../components/emojitab";
import React from "react";
import { UserContext } from "../contexts/usercontext";
import { SocketContext } from "../contexts/socketcontext";

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

    React.useEffect(() => {
      console.log(user)
      if (user === undefined) return
      if (!user?.loggedIn) {
              console.log("CHAT", user?.loggedIn)
              navigate('/login')
              alert("You need to login before chatting!")
              return
      }
  }, [])

    React.useEffect(() => {
        if (!socket) return

        const handleIncomingMessage = (msg) => {
            setMessages((prev) => [...prev, msg])
        }

        socket.on("message", handleIncomingMessage)
        
        return () => socket.off("message", handleIncomingMessage)
    }, [socket])

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
      } ,1500)
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

      const handleNewConversation = () => {
        console.log("Works!")
        fetchUser()
      }

      socket.on("new_conversation_created", handleNewConversation)

      return () => socket.off("new_conversation_created", handleNewConversation)
  }, [socket?.connected])


    const listOfClients = user?.clients?.map((client) => {
        return(<div 
            onClick={() => initConversation(client?.conversation_id)} key={client?.conversation_id} 
            className={`chat-item ${currentConversation === client?.conversation_id ? "active" : ""}`}>
                {client?.name}
            </div>)
    })

    const listOfMessages = messages?.map((message) => (
        <div key={message.id} className={`message ${user?.id === message.sender_id ? "sent" : "received"}`}> 
            <h4 className="message-title">{message.sender_id === user?.id ? "You" : client?.name}</h4>
            {message.content}
            <div className="timestamp">{message.timestamp}</div>
        </div>
    ))

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
        <div className="chat-header">{client?.name}<br/><small><i>{status}</i></small></div>
        <div className="messages">
          {listOfMessages}
        </div>

        <div className="input-area">
          <input
            type="text"
            className="message-input"
            placeholder="Type a message..."
            ref={messageRef}
            onChange={handleTypingStatus}
          />
          <button
            onClick={() => setEmojiListVisible(!emojiListVisible)}
            className="emoji-btn"
          >
            😊
          </button>
          <button className="send-btn" onClick={handleSendMessage}>➤</button>

          {emojiListVisible && <EmojiTab />}
        </div>
      </>
    )}
  </div>
</div>

    )
}