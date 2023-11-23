// Navbar.js
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ChatNavBar.css";

const ChatNavBar = ({ term, setTerm }) => {
  const location = useLocation();
  const { pathname } = location;

  const Navigate = useNavigate();
  const HandleClick = () => {
    Navigate("/");
  };

//   const [isTokenValid, setIsTokenValid] = useState(false);
  //   const _id = localStorage.getItem("_id");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       setIsTokenValid(true);
//       const fetchuser = async () => {
//         await axios
//           .get(
//             `http://localhost:5000/users`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//           .then((response) => console.log(response.data))
//           .catch((error) => console.log(error));
//       };

//       fetchuser();
//     } else {
//       setIsTokenValid(false);
//     }
//   }, []);

  const HandleLogout = async () => {
    localStorage.removeItem("token");
    Navigate(`/login`);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setTerm(searchTerm);

    // Perform search logic here and update searchResults state accordingly
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="left">
          {pathname === "/" && (
            <div className="searchContainer">
              <input value={term} onChange={handleSearch} className="input" />
              <SearchIcon />
            </div>
          )}
        </div>
        <div className="center">
          <h1 className="logo" onClick={HandleClick}>
            UniTrade
          </h1>
        </div>
        <div className="right">
            <>
              <div className="menuItem">
                <Link to="/" className="menuItem">
                  POSTING
                </Link>
              </div>
              <div className="menuItem">
                <Link onClick={HandleLogout} className="menuItem">
                  LOGOUT
                </Link>
              </div>
              <div className="menuItem">
                <Link
                  to={{
                    pathname: "/chats",
                  }}
                  className="menuItem"
                >
                  CHATS
                </Link>
              </div>
            </>
        </div>
      </div>
    </div>
  );
};

export default ChatNavBar;
