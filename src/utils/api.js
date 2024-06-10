import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
  Authorization: "Bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, language, params) => {
  try {
    const { data } = await axios.get(
      BASE_URL + url + (url.includes("?") ? "&" : "?") + "language=" + language,
      {
        headers,
        params,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getRequestToken = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/authentication/token/new`, {
      headers,
    });
    return response.data.request_token;
  } catch (error) {
    console.error("Error fetching request token:", error);
    return null;
  }
};

export const getSessionId = () => {
  return localStorage.getItem("tmdb_session_id");
};
