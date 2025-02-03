import axios from "axios";

const instance = axios.create({
  baseURL: "https://mock.example.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export { instance as axios };
