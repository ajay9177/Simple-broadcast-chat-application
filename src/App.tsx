import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState(["Hello"]);
  const wsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: "red" },
        })
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message },
      })
    );

    inputRef.current.value = "";
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col">
      {/* Header */}
      <header className="p-4 bg-purple-700 text-white text-xl font-bold shadow-md">
        Chat Room - Room ID: <span className="font-mono">Red</span>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-xs ${
              index % 2 === 0 ? "self-start" : "self-end"
            }`}
          >
            <div
              className={`p-3 rounded-lg text-sm shadow-md ${
                index % 2 === 0
                  ? "bg-gray-700 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {message}
            </div>
          </div>
        ))}
      </main>

      {/* Input Section */}
      <footer className="bg-gray-800 p-4 flex space-x-2">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300"
        >
          Send
        </button>
      </footer>
    </div>
  );
}

export default App;
