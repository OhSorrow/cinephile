import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { VscChromeClose } from "react-icons/vsc";
import { MdSlideshow, MdOutlineMovie } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Squash as Hamburger } from "hamburger-react";
import "./style.scss";
import { useSelector } from "react-redux";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/cinephile.png";
import { getRequestToken, getSessionId } from "../../utils/api";

const Header = () => {
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState("null");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState("null");
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = useSelector((state) => state.session.sessionId);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const controlNavBar = () => {
    if (window.scrollY > 20) {
      setShow("show");
      if (window.scrollY > 300) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
          setShow("hide");
        } else {
          setShow("show");
        }
      }
      setLastScrollY(window.scrollY);
    } else {
      setShow("top");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavBar);
    return () => {
      window.removeEventListener("scroll", controlNavBar);
    };
  }, [lastScrollY]);

  const openSearch = () => {
    if (showMobileMenu != "null") {
      setTimeout(() => {
        setMobileMenu(false);
      }, 250);
      setShowMobileMenu("false");
      setMenuOpen(false);
    }
    setShowSearch("true");
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowMobileMenu("true");
    if (showSearch !== "null") {
      setShowSearch("false");
    }
  };

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);

      setTimeout(() => {
        setShowSearch("false");
        setTimeout(() => {
          setQuery("");
        }, 1000);
      }, 1000);
    }
  };

  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    if (showMobileMenu != "null") {
      setTimeout(() => {
        setMobileMenu(false);
      }, 250);
      setShowMobileMenu("false");
    }
    setMenuOpen(false);
    if (showSearch !== "null") {
      setShowSearch("false");
    }
  };

  const handleLogin = async () => {
    if (sessionId) {
      navigate("/account");
    } else {
      const requestToken = await getRequestToken();
      if (requestToken) {
        const redirectUrl = `${window.location.origin}/account`;
        window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${redirectUrl}`;
      } else {
        console.error("Failed to get request token.");
      }
    }
  };

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <ul
          className={`menuItems ${
            showMobileMenu === "null"
              ? ""
              : showMobileMenu === "true"
              ? "showMobileView"
              : "hideMobileView"
          }`}
        >
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
          <button className="header-button" onClick={handleLogin}>
            {sessionId ? (
              <>
                <FaUser />
                <p>حساب کاربری</p>
              </>
            ) : (
              <>
                <FiLogIn />
                <p>ورود</p>
              </>
            )}
          </button>
          <li
            className="menuItem"
            onClick={() => {
              navigationHandler("tv");
            }}
          >
            سریال
            <MdSlideshow />
          </li>
          <li
            className="menuItem"
            onClick={() => {
              navigationHandler("movie");
            }}
          >
            فیلم
            <MdOutlineMovie />
          </li>
        </ul>

        <div className="mobileMenuItems">
          <Hamburger
            onToggle={(toggled) => {
              if (toggled) {
                openMobileMenu();
              } else {
                setTimeout(() => {
                  setMobileMenu(false);
                }, 250);
                setShowMobileMenu("false");
              }
            }}
            toggled={isMenuOpen}
            toggle={setMenuOpen}
            color="white"
            size={24}
          />
          <HiOutlineSearch onClick={openSearch} />
          <button className="header-button" onClick={handleLogin}>
            {sessionId ? (
              <>
                <FaUser />
              </>
            ) : (
              <>
                <FiLogIn />
                <p>ورود</p>
              </>
            )}
          </button>
        </div>

        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
        </div>
      </ContentWrapper>
      {
        <div
          className={`searchBar ${
            showSearch === "null"
              ? ""
              : showSearch === "true"
              ? "showSearch"
              : "hideSearch"
          }`}
        >
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="جستجو"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose
                onClick={() => {
                  setShowSearch("false");
                }}
                style={{ color: "white" }}
              />
            </div>
          </ContentWrapper>
        </div>
      }
    </header>
  );
};

export default Header;
