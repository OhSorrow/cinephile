import React from "react";
import "./style.scss";
import { useSelector } from "react-redux";

const Genres = ({ data, type }) => {
  //   const { genres } = useSelector((state) => state.home);
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

  return (
    <div className="genres">
      {data?.map((g) => {
        return (
          <div key={g} className="genre">
            {type === "tv"
              ? tvGenres.genres.filter((genre) => genre.id === g)[0]?.faName
              : movieGenres.genres.filter((genre) => genre.id === g)[0]?.faName}
          </div>
        );
      })}
    </div>
  );
};

export default Genres;
