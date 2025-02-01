import { http, HttpResponse } from "msw";

const BASE_URL = "https://mock.example.com/api";

const handlers = [
  http.get(`${BASE_URL}/users`, () => {
    return HttpResponse.json({
      username: "john_doe",
      email: "john@example.com",
    });
  }),
];

export default handlers;
