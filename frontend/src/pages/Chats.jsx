import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import { io } from "socket.io-client";
import "../pages/Chats.css";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user["id"];
  const [searchTerm, setSearchTerm] = useState(""); //set search from search bar

  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]); //get all messages from a chat
  
  const [newText, setNewText] = useState("");
  const scrollRef = useRef();
  const socket = useRef(); //web socket connection to server
  const [RetrievedMessage, setRetrievedMessage] = useState(null);

  useEffect(() => {
    socket.current = io(`http://localhost:8900`);
    socket.current.on("retrieveMessage", (data) => {
      setRetrievedMessage({
        sender_id: data.senderId,
        text: data.text,
        chat_id: currentChat?.chat_id,
      });
    });
  
    return () => {
      socket.current.off("retrieveMessage");
      socket.current.disconnect();
    };
  }, [currentChat]);
  
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // const user = localStorage.getItem("user").id
        const response = await axios.get(
          'http://localhost:5000/chats',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setChats(response.data);
        } else {
          console.log("Error fetching chats:", response);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [user_id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!currentChat) {
          // Handle the case where chatId is not available
          console.error("Chat ID is missing");
          return;
        }
        const res = await axios.get(
          `http://localhost:5000/messages/${currentChat?.chat_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessages(res.data?.messages);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, user_id]);

   // Add user to socket and listen for user updates
   useEffect(() => {
    socket.current.emit("addUser", user_id);
    socket.current.on("getUsers", (users) => console.log(users));
  }, [user_id]);

  useEffect(() => {
    if (RetrievedMessage &&
      (currentChat?.from_user.user_id === RetrievedMessage?.sender_id ||
       currentChat?.to_user.user_id === RetrievedMessage?.sender_id)) {
      setMessages((prev) => [...prev, RetrievedMessage]);
    }
    setRetrievedMessage(null);
  }, [RetrievedMessage, currentChat, user_id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  
  const sendMessage = async () => {
    const receiverId = currentChat?.to_user.user_id === user_id 
                       ? currentChat?.from_user.user_id 
                       : currentChat?.to_user.user_id;
  
    socket.current.emit("sendMessage", {
      senderId: user_id,
      receiverId: receiverId,
      text: newText,
    });
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const res = await axios.post(
        `http://localhost:5000/messages`,
        {
          text: newText,
          chat_id: currentChat?.chat_id,
          sender_id: user_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (res.status === 200) {
        setMessages([...messages, res.data.message]);
        setNewText("");
      } else {
        console.log("Error sending message:", res);
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  const filteredList = chats?.filter(
    (ele) =>
      ele?.from_user?.username
        .toLowerCase()
        .includes(searchTerm?.toLowerCase()) ||
      ele?.to_user?.username.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="Wrapper">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              placeholder="Search for Sellers"
              className="chatMenuInput"
              style={{ padding: "15px", fontSize: "20px" }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              {filteredList.map((c, index) => (
                <div
                  key={index}
                  onClick={() => {
                    console.log(c);
                    setCurrentChat(c);
                  }}
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
                      className={
                        m?.sender_id === user_id ? "messageown" : "message"
                      }
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
                  onChange={(e) => setNewText(e.target.value)}
                  value={newText}
                ></textarea>
              </div>
              <button onClick={sendMessage} className="sendbutton">
                Send
              </button>
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