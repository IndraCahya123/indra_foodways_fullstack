import axios from "axios";

export const APIURL = axios.create({
  baseURL: "http://localhost:8000/api/v1",
});

export const setAuthToken = (token) => {
  if (token) {
    APIURL.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete APIURL.defaults.headers.common["Authorization"];
  }
};