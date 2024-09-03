import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const avatar = localStorage.getItem("avatar");
  const endOfMessagesRef = useRef(null);

  const fakeChat = [
    {
      text: "Tja tja, hur mår du?",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
      isBot: true,
    },
    {
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
      isBot: true,
    },
    {
      text: "Sover du eller?! 😴",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
      isBot: true,
    },
  ];

  useEffect(() => {
    if (!token) {
      console.log("Token not found");
      return;
    }

    fetch("https://chatify-api.up.railway.app/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages([...fakeChat, ...data]);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, [token]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      text: newMessage,
      avatar: avatar,
      username: username,
      conversationId: null,
    };

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMsg),
        }
      );
      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleDelete = async (msgID) => {
    try {
      await fetch(`https://chatify-api.up.railway.app/messages/${msgID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessages(messages.filter((msg) => msg.id !== msgID));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <header
          style={{
            padding: "10px",
            backgroundColor: "#f4f4f4",
            borderBottom: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: "0", color: "black" }}>
            Welcome {username || "Guest"}!
          </h1>
          <img
            src={avatar}
            alt="Avatar"
            style={{
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              marginTop: "10px",
            }}
          />
        </header>
        <div style={{ height: "400px", overflowY: "scroll", padding: "10px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection:
                  msg.username === username ? "row-reverse" : "row",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <img
                src={msg.avatar}
                alt="Avatar"
                style={{
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  margin: "0 10px",
                }}
              />
              <div
                style={{
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    msg.username === username ? "#e1ffe1" : "#f1f1f1",
                  color: "#000000",
                  border: "1px solid #ddd",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                }}
              >
                <p>{msg.text}</p>
                {msg.username === username && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px",
                      cursor: "pointer",
                      marginTop: "5px",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "10px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f4f4f4",
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                marginLeft: "10px",
                backgroundColor: "#007bff",
                color: "#ffffff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
