import React, { useState, useEffect } from "react";
import "./style.scss";
import { VscChromeClose } from "react-icons/vsc";
import axios from "axios";

const movieURL = "https://new-nunflix-player.vercel.app/media/tmdb-movie-";
const tvURL = "https://vidsrc.xyz/embed/tv/";

const StreamPopup = ({ show, setShow, streamId, setStreamId, mediaType }) => {
  const [playerData, setPlayerData] = useState(null);

  const hidePopup = () => {
    setShow(false);
    setStreamId(null);
  };

  // const stream = async () => {
  //   const url =
  //     mediaType === "movie" ? `${movieURL}${streamId}` : `${tvURL}${streamId}`;
  //   setPlayerData(await axios.get(url));
  // };

  // useEffect(() => {
  //   if (show && streamId) {
  //     stream();
  //   }
  // }, [streamId, show]);

  return (
    <div className={`streamPopup ${show ? "visible" : ""}`}>
      <div className="opacityLayer" onClick={hidePopup}></div>
      <div className="videoPlayer">
        <span className="closeBtn" onClick={hidePopup}>
          <VscChromeClose></VscChromeClose>
        </span>
        {show ? (
          <iframe
            width="100%"
            height="100%"
            allowFullScreen
            src={
              mediaType === "tv"
                ? `https://new-nunflix-player.vercel.app/media/tmdb-tv-${streamId}`
                : `https://new-nunflix-player.vercel.app/media/tmdb-movie-${streamId}`
            }
          ></iframe>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default StreamPopup;
