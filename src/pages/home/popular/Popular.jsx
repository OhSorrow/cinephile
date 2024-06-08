import React, { useState, useEffect } from "react";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import useFetch from "./../../../hooks/useFetch";
import Carousel from "../../../components/carousel/Carousel";
import { RiFireLine } from "react-icons/ri";

const Popular = ({ setProgress }) => {
  //create states
  const [endpoint, setEndpoint] = useState("movie");

  const { data, loading } = useFetch(`/${endpoint}/popular`, "fa-IR");

  const onTabChange = (tab) => {
    setEndpoint(tab === "فیلم" ? "movie" : "tv");
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
          <RiFireLine />
          عناوین محبوب
        </span>
        <SwitchTabs data={["فیلم", "سریال"]} onTabChange={onTabChange} />
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} endpoint={endpoint} />
    </div>
  );
};

export default Popular;
