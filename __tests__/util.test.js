import { TEST_URL } from "../app/lib/constants";
import { get } from "axios";

describe("Utils Test Cases", () => {
  it("Health Check Test Case", async (done) => {
    const {
      status,
      data: { message },
    } = await get(`${TEST_URL}`);
    expect(status).toBe(200);
    expect(message).toBe("I am Alive");
    done();
  });
});
