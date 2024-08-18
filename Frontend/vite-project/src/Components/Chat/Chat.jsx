import React, { useEffect, useState } from 'react';
import './Chat.css';
import { FaSearch } from 'react-icons/fa';
import { TbMessages } from 'react-icons/tb';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
  const token = Cookies.get("Token");
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState([]);

  // Extract senderId from token
  const senderId = token ? JSON.parse(atob(token.split('.')[1])).Id : null;
  const senderNmae = token ? JSON.parse(atob(token.split('.')[1])).Name: null;

  // Fetch user list
  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7252/api/Chat/UserList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserList(response.data);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchData();
  }, [token]);

  // Establish SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7252/hub', {
        accessTokenFactory: () => token,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log('SignalR connected');
        setConnection(newConnection);
      })
      .catch(err => console.error('SignalR connection error:', err));

    return () => {
      newConnection.stop();
    };
  }, [token]);

  // Listen for incoming messages
  useEffect(() => {
    if (connection) {
      console.log("receiver message")
      connection.on('ReceiveMessage', (senderId, message) => {
        setMessages(prevMessages => [...prevMessages, { senderId, context: message, sentAt: new Date().toISOString() }]);
      });
    }
  }, [connection]);

  // Handle sending message
  const sendMessage = async () => {
    if (connection && receiverId && message) {
      try {
        await connection.invoke('SendMessage', senderId, receiverId.toString(), message);
        console.log('Message sent');
        setMessage('');
  
      } catch (err) {
        console.error('Error sending message:', err);
      }
    } else {
      console.error('Invalid parameters');
    }
  };

  // Handle user click to fetch messages
  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setReceiverId(user.userId);

    try {
      const response = await axios.get(`https://localhost:7252/api/Chat/GetMessages/${senderId}/${user.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className='main'>
      <div className="chat-container">
        <div className="chat-sidebar">
          <div className="header">
            <img
              src="https://play-lh.googleusercontent.com/c5HiVEILwq4DqYILPwcDUhRCxId_R53HqV_6rwgJPC0j44IaVlvwASCi23vGQh5G3LIZ"
              className="logo"
              alt="Logo"
            />
            <h2 className="title">Chat</h2>
          </div>

          <div className="user-info">
            <img
              src="https://askfilo.com/images/common/profile-pic-placeholder.svg"
              className="user-avatar"
              alt="User"
            />
            <p className="user-name">{senderNmae}</p>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Search here" id="searchInput" />
            <FaSearch className="search-icon" />
          </div>

          <div className="user-list">
            {userList.map((user) => (
              <div className="user-info" key={user.Id} onClick={() => handleUserClick(user)}>
                <img
                  src="https://askfilo.com/images/common/profile-pic-placeholder.svg"
                  className="user-avatar"
                  alt="User"
                />
                <p className="user-name">{user.userName}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='chat-content'>
          {!selectedUser ? (
            <div className='chat-welcome'>
              <h2>Welcome</h2>   
              <p>Select a chat to start conversation</p>
              <TbMessages className='welcome-icon' />
            </div>
          ) : (
            <>
              <div className='chat-header'>
                <img src="https://askfilo.com/images/common/profile-pic-placeholder.svg" className='user-avatar' alt='User' />
                <h2>{selectedUser.userName}</h2>
              </div>

              <div className='chat-messages'>
                {messages.length === 0 ? (
                  <div className='no-messages'>No conversation yet. Start a conversation!</div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.senderId === senderId ? 'sent' : 'received'}`}>
                      <p className='message-content'>{msg.context}</p>
                      <span className='message-time'>{new Date(msg.sentAt).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>

              <div className='chat-input'>
                <input
                  type='text'
                  placeholder='Type a message'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
