import React, { useState, useEffect } from "react";
import connectWebSocket from "../utils/socket";

const ChatRoom = ({ roomName }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const ws = connectWebSocket(roomName);
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => ws.close();
    }, [roomName]);

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.send(JSON.stringify({ message, username: "User" }));
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Chat Room: {roomName}</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.username}:</strong> {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;

