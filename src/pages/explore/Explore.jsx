import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import { MdSlideshow, MdOutlineMovie } from "react-icons/md";
import "./style.scss";

import useFetch from "../../hooks/useFetch";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";

let filters = {};

//create sort by properties and values
const sortbyData = [
  { value: "popularity.desc", label: "محبوب ترین" },
  { value: "vote_average.desc", label: "بیشترین امتیاز" },
  {
    value: "primary_release_date.desc",
    label: "سال انتشار",
  },
];

const Explore = ({ setProgress }) => {
  //create states
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(null);
  const [sortby, setSortby] = useState(null);
  const { mediaType } = useParams();

  const movieGenres = {
    genres: [
      {
        id: 28,
        name: "Action",
        faName: "اکشن",
      },
      {
        id: 12,
        name: "Adventure",
        faName: "ماجراجویی",
      },
      {
        id: 16,
        name: "Animation",
        faName: "انیمیشن",
      },
      {
        id: 35,
        name: "Comedy",
        faName: "کمدی",
      },
      {
        id: 80,
        name: "Crime",
        faName: "جنایی",
      },
      {
        id: 99,
        name: "Documentary",
        faName: "مستند",
      },
      {
        id: 18,
        name: "Drama",
        faName: "درام",
      },
      {
        id: 10751,
        name: "Family",
        faName: "خانوادگی",
      },
      {
        id: 14,
        name: "Fantasy",
        faName: "فانتزی",
      },
      {
        id: 36,
        name: "History",
        faName: "تاریخی",
      },
      {
        id: 27,
        name: "Horror",
        faName: "ترسناک",
      },
      {
        id: 10402,
        name: "Music",
        faName: "موزیکال",
      },
      {
        id: 9648,
        name: "Mystery",
        faName: "معمایی",
      },
      {
        id: 10749,
        name: "Romance",
        faName: "عاشقانه",
      },
      {
        id: 878,
        name: "Science Fiction",
        faName: "علمی-تخیلی",
      },
      {
        id: 10770,
        name: "TV Movie",
        faName: "فیلم تلویزیونی",
      },
      {
        id: 53,
        name: "Thriller",
        faName: "هیجان انگیز",
      },
      {
        id: 10752,
        name: "War",
        faName: "جنگی",
      },
      {
        id: 37,
        name: "Western",
        faName: "وسترن",
      },
    ],
  };
  const tvGenres = {
    genres: [
      {
        id: 10759,
        name: "Action & Adventure",
        faName: "اکشن و ماجراجویی",
      },
      {
        id: 16,
        name: "Animation",
        faName: "انیمیشن",
      },
      {
        id: 35,
        name: "Comedy",
        faName: "کمدی",
      },
      {
        id: 80,
        name: "Crime",
        faName: "جنایی",
      },
      {
        id: 99,
        name: "Documentary",
        faName: "مستند",
      },
      {
        id: 18,
        name: "Drama",
        faName: "درام",
      },
      {
        id: 10751,
        name: "Family",
        faName: "خانوادگی",
      },
      {
        id: 10762,
        name: "Kids",
        faName: "کودکان",
      },
      {
        id: 9648,
        name: "Mystery",
        faName: "معمایی",
      },
      {
        id: 10763,
        name: "News",
        faName: "اخبار",
      },
      {
        id: 10764,
        name: "Reality",
        faName: "واقع‌نما",
      },
      {
        id: 10765,
        name: "Sci-Fi & Fantasy",
        faName: "علمی-تخیلی و فانتزی",
      },
      {
        id: 10766,
        name: "Soap",
        faName: "سریال آبکی",
      },
      {
        id: 10767,
        name: "Talk",
        faName: "گفتگو",
      },
      {
        id: 10768,
        name: "War & Politics",
        faName: "جنگ و سیاست",
      },
      {
        id: 37,
        name: "Western",
        faName: "وسترن",
      },
    ],
  };

  //api call

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/discover/${mediaType}`, "fa-IR", filters).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
    });
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(
      `/discover/${mediaType}?page=${pageNum}`,
      "fa-IR",
      filters
    ).then((res) => {
      if (data?.results) {
        setData({
          ...data,
          results: [...data?.results, ...res.results],
        });
      } else {
        setData(res);
      }
      setPageNum((prev) => prev + 1);
    });
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

  useEffect(() => {
    filters = {};
    setData(null);
    setPageNum(1);
    setSortby(null);
    setGenre(null);
    fetchInitialData();
  }, [mediaType]);

  //after selecting sort by option, this method call
  const onChange = (selectedItems, action) => {
    if (action.name === "sortby") {
      setSortby(selectedItems);
      if (action.action !== "clear") {
        filters.sort_by = selectedItems.value;
      } else {
        delete filters.sort_by;
      }
    }

    if (action.name === "genres") {
      setGenre(selectedItems);
      if (action.action !== "clear") {
        let genreId = selectedItems.map((g) => g.id);
        genreId = JSON.stringify(genreId).slice(1, -1);
        filters.with_genres = genreId;
      } else {
        delete filters.with_genres;
      }
    }

    setPageNum(1);
    fetchInitialData();
  };

  return (
    <div className="explorePage">
      <ContentWrapper>
        <div className="pageHeader">
          <div className="pageTitle">
            {mediaType === "tv" ? <MdSlideshow /> : <MdOutlineMovie />}
            {mediaType === "tv" ? "سریال" : "فیلم"}
          </div>
          <div className="filters">
            <Select
              isMulti
              name="genres"
              value={genre}
              closeMenuOnSelect={false}
              options={
                mediaType === "tv" ? tvGenres.genres : movieGenres.genres
              }
              getOptionLabel={(option) => option.faName}
              getOptionValue={(option) => option.id}
              onChange={onChange}
              placeholder="ژانر"
              className="react-select-container genresDD"
              classNamePrefix="react-select"
            />
            <Select
              name="sortby"
              value={sortby}
              options={sortbyData}
              onChange={onChange}
              isClearable={true}
              placeholder="مرتب سازی"
              className="react-select-container sortbyDD"
              classNamePrefix="react-select"
            />
          </div>
        </div>
        {loading && <Spinner initial={true} />}
        {!loading && (
          <>
            {data?.results?.length > 0 ? (
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} mediaType={mediaType} />
                  );
                })}
              </InfiniteScroll>
            ) : (
              <span className="resultNotFound">
                متأسفانه نتیجه‌ای یافت نشد 🥲
              </span>
            )}
          </>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Explore;
