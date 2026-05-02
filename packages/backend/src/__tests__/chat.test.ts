import request from "supertest";
import app from "../app.js";
import { prisma } from "../lib/prisma.js";

describe("Chat API", () => {
  let userToken: string;
  let otherUserToken: string;
  let testSessionId: number;

  beforeAll(async () => {
    const username1 = "chatuser_" + Date.now();
    const username2 = "otheruser_" + Date.now();

    await request(app)
      .post("/api/auth/register")
      .send({ username: username1, password: "password123" });

    const loginRes1 = await request(app)
      .post("/api/auth/login")
      .send({ username: username1, password: "password123" });
    userToken = loginRes1.body.data.token;

    await request(app)
      .post("/api/auth/register")
      .send({ username: username2, password: "password123" });

    const loginRes2 = await request(app)
      .post("/api/auth/login")
      .send({ username: username2, password: "password123" });
    otherUserToken = loginRes2.body.data.token;
  });

  describe("POST /api/messages", () => {
    it("should create new session when no sessionId provided", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Hello AI assistant" });

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.message).toBe("消息发送成功");
      expect(res.body.data.sessionId).toBeDefined();
      testSessionId = res.body.data.sessionId;
    });

    it("should auto-generate title from content (first 10 chars)", async () => {
      const uniqueContent = "uniquecontent_" + Date.now();
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: uniqueContent });

      expect(res.status).toBe(200);
      const sessionRes = await request(app)
        .get("/api/sessions")
        .set("Authorization", `Bearer ${userToken}`);
      const session = sessionRes.body.data.find(
        (s: { id: number }) => s.id === res.body.data.sessionId,
      );
      expect(session.title).toBe(uniqueContent.slice(0, 10));
    });

    it("should use existing session when sessionId provided", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Second message", sessionId: testSessionId });

      expect(res.status).toBe(200);
      expect(res.body.data.sessionId).toBe(testSessionId);
    });

    it("should reject request without token", async () => {
      const res = await request(app)
        .post("/api/messages")
        .send({ content: "Hello" });

      expect(res.status).toBe(401);
    });

    it("should reject empty content", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "" });

      expect(res.status).toBe(200);
    });

    it("should ignore invalid sessionId and create new session", async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Message to new session", sessionId: 99999 });

      expect(res.status).toBe(200);
      expect(res.body.data.sessionId).not.toBe(99999);
    });
  });

  describe("GET /api/sessions", () => {
    it("should return session list for authenticated user", async () => {
      const res = await request(app)
        .get("/api/sessions")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("should reject request without token", async () => {
      const res = await request(app).get("/api/sessions");

      expect(res.status).toBe(401);
    });

    it("should only return sessions owned by user", async () => {
      const res = await request(app)
        .get("/api/sessions")
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(res.status).toBe(200);
      const sessionIds = res.body.data.map((s: { id: number }) => s.id);
      expect(sessionIds).not.toContain(testSessionId);
    });
  });

  describe("PUT /api/sessions/:id", () => {
    it("should update session title", async () => {
      const res = await request(app)
        .put(`/api/sessions/${testSessionId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Updated Title" });

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.message).toBe("标题修改成功");
      expect(res.body.data.title).toBe("Updated Title");
    });

    it("should reject update for non-existent session", async () => {
      const res = await request(app)
        .put("/api/sessions/99999")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Test" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("会话不存在");
    });

    it("should reject update from other user", async () => {
      const res = await request(app)
        .put(`/api/sessions/${testSessionId}`)
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({ title: "Hacked Title" });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("无权操作此会话");
    });

    it("should reject request without token", async () => {
      const res = await request(app)
        .put(`/api/sessions/${testSessionId}`)
        .send({ title: "Test" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/sessions/:sessionId/messages", () => {
    it("should return messages for valid session", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.data.data).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();
    });

    it("should return pagination info", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.body.data.pagination).toHaveProperty("hasMore");
      expect(res.body.data.pagination).toHaveProperty("nextCursor");
    });

    it("should validate limit range (10-20)", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages?limit=5`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("limit 必须介于 10-20 之间");
    });

    it("should reject limit over 20", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages?limit=25`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("limit 必须介于 10-20 之间");
    });

    it("should accept valid limit", async () => {
      const createRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Test limit content" });
      const sid = createRes.body.data.sessionId;

      const res = await request(app)
        .get(`/api/sessions/${sid}/messages?limit=10`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });

    it("should reject invalid cursor format", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages?cursor=invalid-date`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("cursor 格式无效");
    });

    it("should accept valid cursor timestamp", async () => {
      const cursor = new Date().toISOString();
      const res = await request(app)
        .get(
          `/api/sessions/${testSessionId}/messages?cursor=${encodeURIComponent(cursor)}`,
        )
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
    });

    it("should reject access to other user's session", async () => {
      const res = await request(app)
        .get(`/api/sessions/${testSessionId}/messages`)
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toBe("无权操作此会话");
    });

    it("should reject access to non-existent session", async () => {
      const res = await request(app)
        .get("/api/sessions/99999/messages")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("会话不存在");
    });

    it("should reject request without token", async () => {
      const res = await request(app).get(
        `/api/sessions/${testSessionId}/messages`,
      );

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/sessions/:id", () => {
    let sessionToDelete: number;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Session to delete" });
      sessionToDelete = res.body.data.sessionId;
    });

    it("should delete session successfully", async () => {
      const res = await request(app)
        .delete(`/api/sessions/${sessionToDelete}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.code).toBe(200);
      expect(res.body.message).toBe("会话删除成功");
    });

    it("should return 404 for deleted session", async () => {
      const res = await request(app)
        .delete(`/api/sessions/${sessionToDelete}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
    });

    it("should reject delete from other user", async () => {
      const createRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Other user session" });
      const otherSessionId = createRes.body.data.sessionId;

      const res = await request(app)
        .delete(`/api/sessions/${otherSessionId}`)
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(res.status).toBe(403);
    });

    it("should reject request without token", async () => {
      const createRes = await request(app)
        .post("/api/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ content: "Test session" });
      const sessionId = createRes.body.data.sessionId;

      const res = await request(app).delete(`/api/sessions/${sessionId}`);

      expect(res.status).toBe(401);
    });
  });
});
