import axios from "axios";

export async function getData(name) {
  const response = await axios.get(`http://localhost:8080/report?name=${name}`);

  return response.data;
}
