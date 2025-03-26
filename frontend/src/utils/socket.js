const connectWebSocket = (roomName) => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    socket.onopen = () => {
        console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message received:", data);
    };

    socket.onclose = () => {
        console.log("WebSocket Disconnected");
    };

    return socket;
};

export default connectWebSocket;

