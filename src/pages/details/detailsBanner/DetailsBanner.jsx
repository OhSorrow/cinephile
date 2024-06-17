import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from "axios";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import "./style.scss";
import CircularProgress from "@mui/material/CircularProgress";

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
  const [showStream, setShowStream] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [streamId, setStreamId] = useState(null);
  const [engOverview, setEngOverview] = useState("");
  const [isFav, setIsFav] = useState(false);
  const [isOnWatchList, setIsOnWatchList] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [loadingFavWatchStatus, setLoadingFavWatchStatus] = useState(true);
  const BASE_URL = "https://api.themoviedb.org/3";
  const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;
  const sessionId = localStorage.getItem("tmdb_session_id");
  const accountId = localStorage.getItem("account_id");

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

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (sessionId) {
        try {
          const response = await axios.get(
            `${BASE_URL}/${mediaType}/${id}/account_states`,
            {
              headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
              },
              params: {
                session_id: sessionId,
              },
            }
          );
          setIsLoggedIn(true);
          setIsFav(response.data.favorite);
          setIsOnWatchList(response.data.watchlist);
        } catch (error) {
          console.error("Error fetching account states:", error);
        } finally {
          setLoadingFavWatchStatus(false);
        }
      } else {
        setLoadingFavWatchStatus(false);
      }
    };
    checkLoginStatus();
  }, [id]);

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const addToFavorites = async () => {
    try {
      setLoadingFavWatchStatus(true);
      const response = await axios.post(
        `${BASE_URL}/account/${accountId}/favorite`,
        {
          media_type: mediaType,
          media_id: id,
          favorite: true,
        },
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      console.log("Added to favorites:", response.data);
      setIsFav(true);
      setAlertMessage("با موفقیت اضافه شد.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      setAlertMessage("درخواست با خطا مواجه شد!");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoadingFavWatchStatus(false);
    }
  };
  const removeFromFavorites = async () => {
    try {
      setLoadingFavWatchStatus(true);
      const response = await axios.post(
        `${BASE_URL}/account/${accountId}/favorite`,
        {
          media_type: mediaType,
          media_id: id,
          favorite: false,
        },
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      setIsFav(false);
      console.log("Removed form favorites:", response.data);
      setAlertMessage("با موفقیت حذف شد.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      setAlertMessage("درخواست با خطا مواجه شد!");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoadingFavWatchStatus(false);
    }
  };

  const addToWatchlist = async () => {
    try {
      setLoadingFavWatchStatus(true);
      const response = await axios.post(
        `${BASE_URL}/account/${accountId}/watchlist`,
        {
          media_type: mediaType,
          media_id: id,
          watchlist: true,
        },
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      console.log("Added to watchlist:", response.data);
      setIsOnWatchList(true);
      setAlertMessage("با موفقیت اضافه شد.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      setAlertMessage("درخواست با خطا مواجه شد!");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoadingFavWatchStatus(false);
    }
  };
  const removeFromWatchlist = async () => {
    try {
      setLoadingFavWatchStatus(true);
      const response = await axios.post(
        `${BASE_URL}/account/${accountId}/watchlist`,
        {
          media_type: mediaType,
          media_id: id,
          watchlist: false,
        },
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
          },
        }
      );

      console.log("Removed from watchlist:", response.data);
      setIsOnWatchList(false);
      setAlertMessage("با موفقیت حذف شد.");
      setAlertType("success");
      setAlertOpen(true);
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      setAlertMessage("درخواست با خطا مواجه شد!");
      setAlertType("error");
      setAlertOpen(true);
    } finally {
      setLoadingFavWatchStatus(false);
    }
  };

  const handleButtonClick = (message, event) => {
    const targetId = event.target.id || event.currentTarget.id;
    if (!isLoggedIn) {
      setAlertMessage(message);
      setAlertType("info");
      setAlertOpen(true);
    } else {
      if (targetId === "favoriteButton" || targetId === "favoriteIcon") {
        if (isFav) {
          removeFromFavorites();
        } else {
          addToFavorites();
        }
      } else if (
        targetId === "watchListButton" ||
        targetId === "watchlistIcon"
      ) {
        if (isOnWatchList) {
          removeFromWatchlist();
        } else {
          addToWatchlist();
        }
      }
    }
  };

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
                    <div className="add-to-buttons">
                      {loadingFavWatchStatus ? (
                        <CircularProgress
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            margin: "auto",
                          }}
                        />
                      ) : (
                        <>
                          <Button
                            id="favoriteButton"
                            variant="contained"
                            startIcon={
                              isFav ? (
                                <FavoriteOutlinedIcon id="favoriteIcon" />
                              ) : (
                                <FavoriteBorderOutlinedIcon id="favoriteIcon" />
                              )
                            }
                            sx={{
                              backgroundColor: "#083775",
                              fontFamily: "Vazirmatn",
                              "& .MuiButton-startIcon": {
                                marginLeft: "5px",
                                marginRight: "0",
                              },
                            }}
                            onClick={(event) =>
                              handleButtonClick(
                                "لطفا ابتدا وارد حساب کاربری خود شوید",
                                event
                              )
                            }
                          >
                            لیست مورد علاقه
                          </Button>

                          <Button
                            id="watchListButton"
                            variant="contained"
                            startIcon={
                              isOnWatchList ? (
                                <BookmarkRemoveIcon id="watchlistIcon" />
                              ) : (
                                <BookmarkAddOutlinedIcon id="watchlistIcon" />
                              )
                            }
                            sx={{
                              backgroundColor: "#083775",
                              fontFamily: "Vazirmatn",
                              "& .MuiButton-startIcon": {
                                marginLeft: "5px",
                                marginRight: "0",
                              },
                            }}
                            onClick={(event) =>
                              handleButtonClick(
                                "لطفا ابتدا وارد حساب کاربری خود شوید",
                                event
                              )
                            }
                          >
                            لیست تماشا
                          </Button>
                        </>
                      )}
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
              <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <Alert
                  onClose={handleAlertClose}
                  severity={alertType}
                  sx={{ fontFamily: "Vazirmatn", gap: "6px" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
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
