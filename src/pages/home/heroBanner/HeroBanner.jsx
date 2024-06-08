import React, { useState, useEffect } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux";
import GlassCard from "../../../components/glassCard/GlassCard";
import { HiOutlineSearch } from "react-icons/hi";
import { FaRegStar } from "react-icons/fa";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import CrossfadeImage from "react-crossfade-image";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);

  const { data, loading } = useFetch("/movie/upcoming", "fa-IR");

  useEffect(() => {
    const interval = setInterval(() => {
      const bg =
        url.backdrop +
        data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
      setBackground(bg);
    }, 6000);
    if (data) {
      const bg =
        url.backdrop +
        data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
      setBackground(bg);
    }

    return () => clearInterval(interval);
  }, [data]);

  const searchQueryHandler = (event) => {
    //if user type search query and press enter, and search query not empty, then api call
    if ((event.key === "Enter" && query.length > 0) || event.type === "click") {
      navigate(`/search/${query}`);
    }
  };

  const searchItem = () => {
    navigate(`/search/${query}`);
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <CrossfadeImage
            src={background}
            duration={1500}
            style={{
              objectFit: "cover",
              objectPosition: "center",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      )}

      <div className="opacity-layer"></div>

      <ContentWrapper>
        <div className="wrapper">
          <div className="heroBannerContent">
            <span className="title">۴۰۰ هزار فیلم و قسمت سریال</span>
            <span className="subTitle">
              دریچه‌ای به جدیدترین و برترین آثار سینمایی ...
            </span>
            <div className="glass-card-container">
              <GlassCard
                title={"پخش آنلاین با زیرنویس"}
                icon={FaRegStar}
              ></GlassCard>
              <GlassCard
                title={"رایگان و بدون تبلیغات"}
                icon={FaRegStar}
              ></GlassCard>
              <GlassCard
                title={"پشتیبانی ۲۴ ساعته"}
                icon={FaRegStar}
              ></GlassCard>
            </div>
            <div className="searchInput">
              <input
                type="text"
                placeholder="چی دوست داری ببینی؟"
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <button onClick={searchQueryHandler}>
                <HiOutlineSearch></HiOutlineSearch>
              </button>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
