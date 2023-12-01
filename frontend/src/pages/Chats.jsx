import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { io } from "socket.io-client";
import "../pages/Chats.css";
const BASE_URL = import.meta.env.VITE_API_URL;
const SOCKET = import.meta.env.VITE_SOCKET_API_URL;

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user.username;
  const user_id = user["id"];
  const [searchTerm, setSearchTerm] = useState("");

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newText, setNewText] = useState("");
  const scrollRef = useRef();
  const socket = useRef();

  // Initialize socket connection
  useEffect(() => {
    socket.current = io(`${SOCKET}`);
    // Emit addUser with both user_id and username
    socket.current.emit("addUser", { userId: user_id, username: user.username });
    socket.current.on("getUsers", (users) => console.log(users));
    socket.current.on("retrieveMessage", (newMessage) => {
      if (currentChat && newMessage.chat_id === currentChat.chat_id) {
        console.log("New message received via socket:", newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      }
    });
  
    return () => {
      socket.current.off("retrieveMessage");
      socket.current.disconnect();
    };
  }, [user_id, currentChat, username]); // Add username to the dependency array  


  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(`${BASE_URL}/chats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200 && response.data.chats) {
          setChats(response.data.chats);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [currentChat, user_id]);
  

  // Fetch messages for current chat
  useEffect(() => {
    const getMessages = async () => {
      if (!currentChat) return;
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(`${BASE_URL}/messages/${currentChat.chat_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data?.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    getMessages();

  }, [currentChat, user_id]);

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newText.trim()) return;
    const receiverId = currentChat.to_user.user_id === user_id 
                       ? currentChat.from_user.user_id 
                       : currentChat.to_user.user_id;
  
    const messageData = {
      sender_id: user_id,
      receiver_id: receiverId,
      text: newText,
      chat_id: currentChat.chat_id,
    };
    
    // Update UI immediately; this allows a user's screen to optimsitically render a message before the server responds
    setMessages(prevMessages => [...prevMessages, messageData]);
    setNewText(""); // Reset the text box

    socket.current.emit("sendMessage", messageData);
  
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(`${BASE_URL}/messages`, messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        // Duplicate logic from above to update UI after server responds; this is essential in preserving messages within backend
        setMessages(prevMessages => [...prevMessages, res.data.message]);
        setNewText(""); // Reset the text box
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
  
  

  // Filter chats based on search term
  const filteredList = chats.filter(
    (chat) => chat.from_user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
              chat.to_user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
      <Header />
      <div className="Wrapper">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for Sellers"
              className="chatMenuInput" // Use a class instead of inline style
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              {filteredList.map((c, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentChat(c)}
                >
                  <div className="chatMenuFriend">
                    <div className="chatMenuFriendWrapper">
                      <img
                        className="chatMenuImg"
                        src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
                        alt=""
                      />
                      <div className="chatMenuFriendName">
                        {c?.to_user?.username !== user.username
                          ? c?.to_user?.username
                          : c?.from_user?.username}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="messageboxwrapper">
          {currentChat ? (
            <>
              <div ref={scrollRef} className="messageboxtop">
                {messages?.map((m, index) => (
                  <div key={index} className="messagecontainer" ref={scrollRef}>
                    <div
                      className={m?.sender_id === user_id ? "messageown" : "message"}
                    >
                      {m?.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="messageboxbottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={(e) => {
                    setNewText(e.target.value);
                  }}
                  value={newText}
                ></textarea>
                <button onClick={sendMessage} className="sendbutton">
                  Send
                </button>
              </div>
            </>
          ) : (
            <span style={{ textAlign: "center" }} className="button">
              Open a conversation to start a chat.
            </span>
          )}
        </div>
      </div>
    </div>
  );  
};

export default Chat;