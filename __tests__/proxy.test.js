import { TEST_URL } from "../app/lib/constants";
import { post } from "axios";

describe("Proxy Test Cases", () => {
  it("Get Method Test Case", async (done) => {
    try {
      const response = await post(
        `${TEST_URL}/proxy`,
        {
          clientId: 1,
          requestType: "GET",
          url: "https://www.google.com",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      expect(response.status).toBe(200);
      done();
    } catch (error) {
      console.error(error.response);
    }
  });
  it("RateLimiting Test Case", async (done) => {
    try {
      const requestPromises = [];
      let noOfRequests = 10;
      while (noOfRequests--) {
        requestPromises.push(
          post(
            `${TEST_URL}/proxy`,
            {
              clientId: 1,
              requestType: "GET",
              url: "https://www.google.com",
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          )
        );
      }
      const responses = await Promise.allSettled(requestPromises);
      responses.map(({ value: { status } = {} }) => {
        expect([200, 500].includes(status)).toBe(true);
      });
      done();
    } catch (error) {
      console.error(error);
    }
  });
});
