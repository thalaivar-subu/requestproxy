import { TEST_URL } from "../app/lib/constants";
import { post } from "axios";

// curl http://127.0.0.1:8080/proxy -XPOST -H 'Content-Type: application/json' -d '{"clientId":1,"requestType":"GET","headers":"{\"Content-Type\":\"application/json\"}","url":"https://www.google.com","requestBody":"{\"name\":\"subu\"}"}'
describe("Proxy Test Cases", () => {
  it("Post Check Test Case", async (done) => {
    try {
      const response = await post(
        `${TEST_URL}/proxy`,
        {
          clientId: 1,
          requestType: "GET",
          headers: JSON.stringify({
            "Content-Type": "application/json",
          }),
          url: "https://www.google.com",
          requestBody: JSON.stringify({ name: "subu" }),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(
        JSON.stringify({
          clientId: 1,
          requestType: "GET",
          headers: JSON.stringify({
            "Content-Type": "application/json",
          }),
          url: "https://www.google.com",
          requestBody: JSON.stringify({ name: "subu" }),
        })
      );
      expect(response.status).toBe(200);
      done();
    } catch (error) {
      console.log(error.response);
    }
  });
});
