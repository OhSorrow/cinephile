import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import useFetch from "./../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";
import { IoMdTrendingUp } from "react-icons/io";

const Trending = ({ setProgress }) => {
  //create states
  const [endpoint, setEndpoint] = useState("day");

  const { data, loading } = useFetch(`/trending/all/${endpoint}`, "fa-IR");

  const onTabChange = (tab) => {
    setEndpoint(tab === "روز" ? "day" : "week");
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
        <span className="carouselTitle">
          <IoMdTrendingUp />
          پرطرفدارترین‌ها
        </span>
        <SwitchTabs data={["روز", "هفته"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} />
    </div>
  );
};

export default Trending;
