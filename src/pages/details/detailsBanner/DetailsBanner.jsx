import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/img";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import { PlayTrailerIcon } from "../PlayTrailerbtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import StreamPopup from "../../../components/streamPopup/streamPopup";

const DetailsBanner = ({ video, crew }) => {
  //states create fro video popup
  const [showStream, setShowStream] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const [engOverview, setEngOverview] = useState("");

  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`, "fa-IR");
  const { data: engData } = useFetch(`/${mediaType}/${id}`, "en-US");

  const { url } = useSelector((state) => state.home);

  const _genres = data?.genres?.map((g) => g.id);

  const director = crew?.filter((f) => f.job === "Director");
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  useEffect(() => {
    if (engData && data && data.overview === "") {
      setEngOverview(engData.overview);
    }
  }, [data, engData]);

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} type={mediaType} />
                    <div className="row">
                      <CircleRating rating={data.vote_average.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShowStream(true);
                          setStreamId(id);
                        }}
                      >
                        <PlayIcon />
                        <span className="text">تماشا</span>
                      </div>
                      <div
                        className="playTrailerbtn"
                        onClick={() => {
                          setShowTrailer(true);
                          setVideoId(video.key);
                        }}
                      >
                        <PlayTrailerIcon />
                        <span className="text">تریلر</span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">خلاصه داستان</div>
                      <div className="description">
                        {data.overview || engOverview}
                      </div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">وضعیت انتشار:{""}</span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">تاریخ انتشار:{""}</span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">مدت زمان:{""}</span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* director data fetching */}
                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">کارگردان:</span>
                        <span className="text">
                          {director?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {/* writer data fetching */}
                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">نویسنده:</span>
                        <span className="text">
                          {writer?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {/* creator data fetching for tv shows */}
                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">سازندگان:</span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <VideoPopup
                  show={showTrailer}
                  setShow={setShowTrailer}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
                <StreamPopup
                  show={showStream}
                  setShow={setShowStream}
                  streamId={streamId}
                  setStreamId={setStreamId}
                  mediaType={mediaType}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
