import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Mock first
await jest.unstable_mockModule("../oAuthModel.js", () => ({
  default: jest.fn()
}));

// THEN dynamically import
const { default: OAuthModel } = await import("../oAuthModel.js");
const { default: router } = await import("./api.js");


describe("GET /home", () => {
  let app;
  let mockDb;

  beforeEach(() => {
    app = express();
    mockDb = {};

    app.set("db", mockDb);
    app.use("/", router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns user data when token is valid", async () => {
    const mockUser = {
      _id: { toString: () => "user123" },
      first_name: "John",
      family_name: "Doe",
      height: 180,
      weight: 80,
      age: 35,
      drinks: [
        {
          name: "Mojito",
          timestamp: 123456789,
          ingredients: [{ volume: 50, unit: "ml", abv: 40 }]
        }
      ]
    };

    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue({ user: mockUser })
    }));

    const res = await request(app)
      .get("/home")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(200);
    expect(res.body.id).toBe("user123");
  });

  test("returns 401 when authorization header is missing", async () => {
    const res = await request(app).get("/home");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "UNAUTHORIZED" });
  });

  test("returns 401 when token is invalid", async () => {
    OAuthModel.mockImplementation(() => ({
      getAccessToken: jest.fn().mockResolvedValue(null)
    }));

    const res = await request(app)
      .get("/home")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "INVALID_TOKEN" });
  });

  test("returns 500 on unexpected error", async () => {
    OAuthModel.mockImplementation(() => {
      throw new Error("DB failure");
    });

    const res = await request(app)
      .get("/home")
      .set("Authorization", "Bearer valid-token");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "INTERNAL_SERVER_ERROR" });
  });
});
