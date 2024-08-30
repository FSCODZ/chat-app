import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import DOMPurify from 'dompurify';

const Chat = () => {
    const { authState } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const endOfMessagesRef = useRef(null); // Ref to scroll to the end

    useEffect(() => {
        // Fake messages for demonstration
        const fakeChat = [
            {
                text: "Tja tja, hur mår du?",
                avatar: "https://i.pravatar.cc/100?img=14",
                username: "Johnny",
                conversationId: null
            },
            {
                text: "Hallå!! Svara då!!",
                avatar: "https://i.pravatar.cc/100?img=14",
                username: "Johnny",
                conversationId: null
            },
            {
                text: "Sover du eller?! 😴",
                avatar: "https://i.pravatar.cc/100?img=14",
                username: "Johnny",
                conversationId: null
            }
        ];
        setMessages(fakeChat);
    }, []);

    // Scroll to the bottom of the chat container whenever messages change
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const newMsg = {
            text: DOMPurify.sanitize(newMessage),
            avatar: authState.avatar || 'https://i.pravatar.cc/100',
            username: authState.username || 'Unknown',
            conversationId: null
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const handleDelete = (index) => {
        setMessages(messages.filter((_, i) => i !== index));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', overflow: 'hidden', marginBottom: '20px' }}>
                <header style={{ padding: '10px', backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                    <h1 style={{ margin: '0', color:"black" }}>Welcome {authState.username || 'Guest'}!</h1>
                    <img
                        src={authState.avatar || 'https://i.pravatar.cc/200'}
                        alt="Avatar"
                        style={{ borderRadius: '50%', width: '50px', height: '50px', marginTop: '10px' }}
                    />
                </header>
                <div style={{ height: '400px', overflowY: 'scroll', padding: '10px' }}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                flexDirection: msg.username === authState.username ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                                marginBottom: '10px'
                            }}
                        >
                            <img
                                src={msg.avatar}
                                alt="Avatar"
                                style={{ borderRadius: '50%', width: '40px', height: '40px', margin: '0 10px' }}
                            />
                            <div
                                style={{
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: msg.username === authState.username ? '#e1ffe1' : '#f1f1f1',
                                    color: '#000000',
                                    border: '1px solid #ddd',
                                    maxWidth: '60%',
                                    wordBreak: 'break-word'
                                }}
                            >
                                <p>{msg.text}</p>
                                {msg.username === authState.username && (
                                    <button
                                        onClick={() => handleDelete(index)}
                                        style={{
                                            backgroundColor: '#ff4d4d',
                                            color: '#ffffff',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '5px',
                                            cursor: 'pointer',
                                            marginTop: '5px'
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} /> {/* Empty div for scrolling */}
                </div>
                <form onSubmit={handleSubmit} style={{ padding: '10px', borderTop: '1px solid #ddd', backgroundColor: '#f4f4f4' }}>
                    <div style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
                        />
                        <button
                            type="submit"
                            style={{ padding: '10px 20px', borderRadius: '5px', marginLeft: '10px', backgroundColor: '#007bff', color: '#ffffff', border: 'none', cursor: 'pointer' }}
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
