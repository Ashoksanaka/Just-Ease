import React, { useState, useEffect } from "react";
import connectWebSocket from "../utils/socket";
import { useNavigate } from "react-router-dom";

const ChatRoom = ({ roomName }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/victim-login"); // Redirect to login if not authenticated
            return;
        }
        const user = localStorage.getItem("user");
        const ws = connectWebSocket(roomName);
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => ws.close();
    }, [roomName, navigate]);

    const sendMessage = () => {
        if (socket && message.trim()) {
            const user = localStorage.getItem("user");
            const username = user ? JSON.parse(user).first_name : "User";
            socket.send(JSON.stringify({ message, username }));
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
