import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const username = sessionStorage.getItem("username");
  const avatar = sessionStorage.getItem("avatar");
  const userId = parseInt(sessionStorage.getItem("id"));
  const endOfMessagesRef = useRef(null);

  // Fake chat-meddelanden
  const [fakeChat] = useState([
    {
      text: "Tja tja, hur mår du?",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
    {
      text: "Hallå!! Svara då!!",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
    {
      text: "Sover du eller?! 😴",
      avatar: "https://i.pravatar.cc/100?img=14",
      username: "Johnny",
      conversationId: null,
    },
  ]);

  useEffect(() => {
    if (!userId || isNaN(userId)) {
      console.error("UserId is undefined or invalid.");
      return;
    }

    if (!token) {
      console.log("Token not found");
      return;
    }

    setLoading(true);

    // Hämta bara meddelanden från API:et
    fetch("https://chatify-api.up.railway.app/messages", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched messages:", data);
        setMessages(data); // Bara API-meddelanden, ingen fakeChat
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
  }, [token, userId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, fakeChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const tempId = Date.now().toString();
    const newMsg = {
      id: tempId,
      text: newMessage,
      avatar: avatar,
      username: username,
      userId: userId,
      isUserMessage: true,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newMessage,
            conversationId: null,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Message sent:", data);

      // Ersätt temporärt meddelande med API-svar
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === tempId ? data.latestMessage : msg
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
    }

    setNewMessage("");
  };

  const handleDelete = (msgID) => {
    console.log(`Delete button clicked for message ID: ${msgID}`);
    fetch(`https://chatify-api.up.railway.app/messages/${msgID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(() => {
        console.log(`Message with ID ${msgID} deleted successfully.`);
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== msgID)
        );
      })
      .catch((err) => console.error("Error deleting message:", err));
  };

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div style={chatWrapperStyle}>
      <div style={chatContainerStyle}>
        <h2 style={welcomeTextStyle}>Welcome {username || "Guest"}!</h2>
        <div style={chatMessagesStyle}>
          {/* Visa först fakeChat meddelanden */}
          {fakeChat.map((msg, index) => (
            <div key={index} style={messageStyle}>
              <img src={msg.avatar} alt="Avatar" style={avatarStyle} />
              <div style={messageContentStyle}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {/* Sedan de riktiga API-meddelandena */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={userMessageStyle} // Visa alla API-meddelanden på höger sida
            >
              <img
                src={msg.avatar || avatar}
                alt="Avatar"
                style={avatarStyle}
              />
              <div style={userMessageContentStyle}>
                <p>{msg.text}</p>
                <div style={deleteButtonContainerStyle}>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <form onSubmit={handleSubmit} style={messageFormStyle}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={messageInputStyle}
          />
          <button type="submit" style={sendButtonStyle}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Stilar som definierats tidigare
const chatWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
  backgroundColor: "#f0f0f0",
  padding: "20px",
  boxSizing: "border-box",
};

const chatContainerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "900px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  height: "80vh",
  boxSizing: "border-box",
};

const welcomeTextStyle = {
  textAlign: "center",
  fontSize: "1.5em",
  color: "#333",
  margin: "0",
  marginBottom: "20px",
};

const chatMessagesStyle = {
  flex: 1,
  overflowY: "auto",
  padding: "10px",
  boxSizing: "border-box",
};

const messageStyle = {
  display: "flex",
  alignItems: "flex-start",
  marginBottom: "15px",
};

const messageContentStyle = {
  padding: "15px",
  borderRadius: "10px",
  backgroundColor: "#e1e1ff",
  color: "#000000",
  border: "1px solid #ddd",
  maxWidth: "70%",
  wordBreak: "break-word",
};

const userMessageStyle = {
  ...messageStyle,
  flexDirection: "row-reverse",
};

const avatarStyle = {
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  margin: "0 15px",
};

const userMessageContentStyle = {
  padding: "15px",
  borderRadius: "10px",
  backgroundColor: "#e1ffe1",
  color: "#000000",
  border: "1px solid #ddd",
  maxWidth: "70%",
  wordBreak: "break-word",
};

const deleteButtonContainerStyle = {
  textAlign: "right",
  marginTop: "5px",
};

const deleteButtonStyle = {
  backgroundColor: "#ff4d4d",
  color: "#ffffff",
  border: "none",
  borderRadius: "5px",
  padding: "5px 10px",
  cursor: "pointer",
};

const messageFormStyle = {
  display: "flex",
  marginTop: "10px",
};

const messageInputStyle = {
  flex: 1,
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};

const sendButtonStyle = {
  padding: "10px 20px",
  borderRadius: "5px",
  marginLeft: "10px",
  backgroundColor: "#007bff",
  color: "#ffffff",
  border: "none",
  cursor: "pointer",
};

export default Chat;
