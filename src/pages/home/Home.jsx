import React from "react";
import "./style.scss";
import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";

const Home = ({ setProgress }) => {
  return (
    <div className="homePage">
      <HeroBanner />
      <Trending setProgress={setProgress} />
      <Popular setProgress={setProgress} />
      <TopRated setProgress={setProgress} />
    </div>
  );
};

export default Home;
