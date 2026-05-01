import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "newuser_" + Date.now(), password: "password123" });

      expect(res.status).toBe(201);
      expect(res.body.code).toBe(201);
      expect(res.body.message).toBe("注册成功");
      expect(res.body.data.userId).toBeDefined();
      expect(res.body.data.username).toMatch(/^newuser_\d+$/);
    });

    it("should reject duplicate username", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ username: "duplicateuser", password: "password123" });

      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "duplicateuser", password: "password123" });

      expect(res.status).toBe(409);
      expect(res.body.message).toBe("用户名已存在");
    });

    it("should reject invalid username format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "ab", password: "password123" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("用户名必须为3-50字符的字母、数字或下划线");
    });

    it("should reject short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ username: "validuser", password: "12345" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("密码必须为6-20字符");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ username: "loginuser", password: "password123" });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "loginuser", password: "password123" });

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.message).toBe("登录成功");
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.expiresAt).toBeDefined();
    });

    it("should reject invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "loginuser", password: "wrongpassword" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("用户名或密码错误");
    });

    it("should reject non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "nonexistent", password: "password123" });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe("用户名或密码错误");
    });
  });

  describe("GET /api/auth/me", () => {
    let token: string;

    beforeAll(async () => {
      await request(app)
        .post("/api/auth/register")
        .send({ username: "meuser", password: "password123" });

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({ username: "meuser", password: "password123" });

      token = loginRes.body.data.token;
    });

    it("should get current user with valid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe("meuser");
      expect(res.body.data.userId).toBeDefined();
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.status).toBe(401);
    });

    it("should reject request with invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(401);
    });
  });
});
