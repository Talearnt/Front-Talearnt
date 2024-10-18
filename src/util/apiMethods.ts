import Axios from "axios";

const baseURL = "";
const instance = Axios.create({
  baseURL,
  headers: {
    Accept: "application/json"
  }
});
