import request from "supertest";
import app from "../app.ts";
import prisma from "../lib/prisma.ts";
import bcrypt from "bcryptjs";

jest.mock("../lib/prisma.ts", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("../utils/jwt.ts", () => ({
  signToken: jest.fn(() => "test-token"),
}));

const prismaMock = prisma as any;

describe("POST /api/auth/register", () => {
  it("creates a user successfully", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      password: "hashed-password",
      createdAt: new Date(),
    };

    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUser);

    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      name: "Test User",
      password: "secret123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBe("test-token");

    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: expect.any(String),
      },
    });
  });

  it("returns 400 for invalid input", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("logs in user successfully", async () => {
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: await bcrypt.hash("secret123", 10),
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "secret123",
    });

    expect(res.status).toBe(200); // ✅ login returns 200
    expect(res.body.token).toBe("test-token");
  });
});
