import { TEST_URL } from "../app/lib/constants";
import { post } from "axios";
import {
  InitRedis,
  DeleteValueFromRedis,
  CloseRedisConnection,
} from "../app/utils/redis";

beforeAll(async () => {
  await InitRedis();
});

describe("Proxy Test Cases", () => {
  it("Get Method Test Case", async (done) => {
    try {
      await DeleteValueFromRedis("1");
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
  it("RateLimiting Fail Test Case", async (done) => {
    try {
      await DeleteValueFromRedis("1");
      const requestPromises = [];
      let noOfRequests = 52;
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
      const rejectedResponse = responses[responses.length - 1];
      const { status } = rejectedResponse;
      expect(status).toBe("rejected");
      done();
    } catch (error) {
      done();
    }
  });
  it("RateLimiting Pass Test Case", async (done) => {
    try {
      await DeleteValueFromRedis("1");
      const requestPromises = [];
      let noOfRequests = 50;
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
      for (let i = 0; i < responses.length; i++) {
        const eachResponse = responses[i];
        const { value: { status } = {} } = eachResponse;
        expect([200, 500].includes(status)).toBe(true);
      }
      done();
    } catch (error) {
      console.error(error);
    }
  });
});

afterAll(async () => {
  await CloseRedisConnection();
});