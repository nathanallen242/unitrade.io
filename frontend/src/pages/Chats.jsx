import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import ChatNavBar from "../components/chats/ChatNavBar.jsx";
import "../pages/Chats.css";

const Chat = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user["id"];
  const [searchTerm, setSearchTerm] = useState(""); //set search from search bar

  // const [conversations, setConversations] = useState([]);

  
  

  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const param1 = searchParams.get("param1");
  const [currentChat, setCurrentChat] = useState(
    param1 !== null ? { chatid: param1 } : null
  );
  const [messages, setMessages] = useState([]); //get all messages from a chat
   const [newText, setNewText] = useState(""); 

  const scrollRef = useRef();
  useEffect(() => {
    if (isAuthenticated()) {
      // Set the makes attribute when the component mounts if the user is authenticated
      console.log("authenticated");
    } else {
      console.log("User is not authenticated. Redirecting to login page...");
      navigate("/login");
    }

    const fetchChats = async () => { 
      try {
        const token = localStorage.getItem("accessToken");
        // const user = localStorage.getItem("user").id
        const response = await axios.get(
          `http://localhost:5000/chats?id=${user_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response.data);
          setChats(response.data);
        } else {
          console.log("Error fetching chats:", response);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [navigate]);


  // const filteredList = chats?.filter(
  //   (ele) =>
  //     // ele?.from.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
  //     // ele?.to.name.toLowerCase().includes(searchTerm?.toLowerCase())
  //     console.log(ele)
  // );

  return (
    <div>
      <ChatNavBar />
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
              {chats.map((c) => (
                <div key={c.chatid} onClick={() => setCurrentChat(c)}>
                  <div className="chatMenuFriend">
                    <div className="chatMenuFriendWrapper">
                      <img
                        className="chatMenuImg"
                        src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
                        alt=""
                      />
                      <div className="chatMenuFriendName">
                        {c?.to_user_id}
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
                  <>Hi</>
                  <>Hi</>
                  <>Hi</>
                  <>Hi</>
                </div>
                <div className="messageboxbottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewText(e.target.value)}
                    value={newText}
                  ></textarea>
                  <button>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span>
                Open a conversation to start a chat.
              </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
