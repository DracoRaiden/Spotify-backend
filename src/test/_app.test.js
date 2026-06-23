const request = require("supertest");
const app = require("../app");

describe("GET /api/music", () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/api/music");
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });
});
