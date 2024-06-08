import React, { useState, useEffect } from "react";
import "./style.scss";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchDataFromApi } from "./../../utils/api";
import ContentWrapper from "./../../components/contentWrapper/ContentWrapper";
import noResults from "../../assets/no-results.png";
import Spinner from "../../components/spinner/Spinner";
import MovieCard from "../../components/movieCard/MovieCard";

const SearchResult = ({ setProgress }) => {
  //creating states
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(
      `/search/multi?query=${query}&page=${pageNum}`,
      "fa-IR"
    ).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1);
      setLoading(false);
      console.log(res);
    });
  };

  const fetchNextPageData = () => {
    setLoading(true);
    fetchDataFromApi(
      `/search/multi?query=${query}&page=${pageNum}`,
      "fa-IR"
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
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`${
                  data?.total_results > 1 ? "نتایج" : "نتیجه"
                } جستجوی '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard
                      key={index}
                      data={item}
                      fromSearch={true}
                      next={fetchNextPageData}
                      haseMore={pageNum <= data?.total_pages}
                      loader={<Spinner />}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">
              <img src={noResults} alt="no-results" width={"250px"} />
              <p> متأسفانه نتیجه‌ای یافت نشد 🥲</p>
            </span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
