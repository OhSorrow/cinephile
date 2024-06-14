import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import useFetch from "../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";
import { MdFavoriteBorder } from "react-icons/md";
const Favorite = ({ setProgress }) => {
  //create states
  const [accountId, setAccountId] = useState(
    localStorage.getItem("account_id")
  );
  const [endpoint, setEndpoint] = useState("movies");
  const [type, setType] = useState("movie");
  const { data, loading } = useFetch(
    `/account/${accountId}/favorite/${endpoint}`,
    "fa-IR"
  );

  const onTabChange = (tab) => {
    setEndpoint(tab === "فیلم" ? "movies" : "tv");
    setType(tab === "فیلم" ? "movie" : "tv");
  };

  const [wasLoading, setWasLoading] = useState(false);
  useEffect(() => {
    let interval;
    if (loading) {
      setProgress(Math.random() * 20 + 20);
      setWasLoading(true);
      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 5, 70));
      }, 1000);
    } else if (wasLoading) {
      setProgress(100);
      setWasLoading(false);
    }

    return () => clearInterval(interval);
  }, [loading, wasLoading]);

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <div className="titleContainer">
          <span className="carouselTitle">
            <MdFavoriteBorder />
            مورد علاقه ها
          </span>
          <SwitchTabs data={["فیلم", "سریال"]} onTabChange={onTabChange} />
        </div>
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={type} />
    </div>
  );
};

export default Favorite;
