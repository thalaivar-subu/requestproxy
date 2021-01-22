import { TEST_URL } from "../app/lib/constants";
import { post } from "axios";
import safeStringify from "fast-safe-stringify";

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
  it("Post Method Test Case", async (done) => {
    try {
      const response = await post(
        `${TEST_URL}/proxy`,
        {
          clientId: 1,
          requestType: "POST",
          url: "https://rickandmortyapi.com/graphql/",
          requestBody: safeStringify({
            query: `{
            characters(page: 1) {
              results {
                status
              }
            }
          }`,
          }),
          headers: safeStringify({ "Content-Type": "application/json" }),
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
});
