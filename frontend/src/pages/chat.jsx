import { Link } from "react-router";
import EmojiTab from "../components/emojitab";
import React from "react";

export default function Chat() {

    const [emojiListVisible, setEmojiListVisible] = React.useState(false)
    return(
    <div className="chat-page">
    <div className="chat-menu">
        <div className="chat-item active">John Doe</div>
        <div className="chat-item">Jane Smith</div>
        <div className="chat-item">Bob Johnson</div>
    </div>
    <div className="chat-interface">
        <div className="chat-header">John Doe</div>
        <div className="messages">
            <div className="message received">
                Hey, how are you?
                <div className="timestamp">10:30 AM</div>
            </div>
            <div className="message sent">
                I'm good, thanks! 😊
                <div className="timestamp">10:32 AM</div>
            </div>
            <div className="message received">
                Great to hear. Let's chat later.
                <div className="timestamp">10:35 AM</div>
            </div>
        </div>
        <div className="input-area">
            <input type="text" className="message-input" placeholder="Type a message..."/>
            <button onClick={() => setEmojiListVisible(!emojiListVisible)} className="emoji-btn">😊</button>
            <button className="send-btn">➤</button>
            {emojiListVisible && <EmojiTab/>}
        </div>
    </div>
    </div>
    )
}