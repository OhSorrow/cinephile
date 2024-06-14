import React, { useEffect, useState } from "react";
import Favorite from "./favorite/favorite";
import { useLocation } from "react-router-dom";
import axios from "axios";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import "./style.scss";
import { FiLogIn } from "react-icons/fi";
import profile from "../../assets/profile.png";
import { setSessionId } from "../../store/sessionSlice";
import { store } from "../../store/store"; // Import the store variable

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;
import Img from "../../components/lazyLoadImage/img";
import Watchlist from "./watchlist/watchlist";
const Account = ({ setProgress }) => {
  const location = useLocation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("tmdb_session_id");

    if (sessionId) {
      // If session ID exists, fetch user data
      fetchUserData(sessionId);
    } else {
      // If session ID does not exist, handle the authentication callback
      const query = new URLSearchParams(location.search);
      const requestToken = query.get("request_token");
      const approved = query.get("approved");

      if (approved === "true") {
        getSessionId(requestToken);
      } else {
        console.log("User did not approve the login request.");
      }
    }
  }, [location]);

  const fetchUserData = async (sessionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/account`, {
        headers: {
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
        params: {
          session_id: sessionId,
        },
      });
      setUserData(response.data);
      localStorage.setItem("account_id", response.data.id);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getSessionId = async (requestToken) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/authentication/session/new`,
        {
          request_token: requestToken,
        },
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );
      const sessionId = response.data.session_id;
      console.log("Session ID:", sessionId);
      // Store the session ID in localStorage
      localStorage.setItem("tmdb_session_id", response.data.session_id);
      store.dispatch(setSessionId(response.data.session_id)); // Dispatch the action

      // Fetch user data with the new session ID
      fetchUserData(sessionId);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleLogout = () => {
    window.location.href = "/";
    localStorage.removeItem("tmdb_session_id");
    localStorage.removeItem("account_id");
    setTimeout(() => {
      setUserData(null);
    }, 100);
  };

  return (
    <div className="account-details">
      <ContentWrapper>
        {userData ? (
          <>
            <div className="user-image">
              {userData.avatar.tmdb.avatar_path ? (
                <Img
                  src={`https://image.tmdb.org/t/p/w200${userData.avatar.tmdb.avatar_path}`}
                  alt={userData.name}
                />
              ) : (
                <Img src={profile}></Img>
              )}
              <div className="details">
                <p>{userData.name}</p>
                <p className="username">{userData.username}</p>
                <button onClick={handleLogout}>
                  <FiLogIn />
                  خروج
                </button>
              </div>
            </div>
            <Favorite setProgress={setProgress} />
            <Watchlist setProgress={setProgress} />
          </>
        ) : (
          <div className="account-skeleton">
            <ContentWrapper>
              <div className="top-skeleton">
                <div className="img-skeleton"></div>
                <div className="details-skeleton"></div>
              </div>
              <div className="carousel-skeleton"> </div>
              <div className="carousel-skeleton"> </div>
            </ContentWrapper>
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Account;
