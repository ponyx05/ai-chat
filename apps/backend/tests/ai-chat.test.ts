import request from "supertest";
import app from "@/app";

describe("AI Chat SSE Integration", () => {
  let userToken: string;
  let sessionId: number;

  beforeAll(async () => {
    const username = "aiuser_" + Date.now();
    await request(app)
      .post("/api/auth/register")
      .send({ username, password: "password123" });
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ username, password: "password123" });
    userToken = loginRes.body.data.token;
  });

  it("should return SSE stream with session and done events for new session", async () => {
    const res = await request(app)
      .post("/api/chat/messages")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Hello AI" });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/event-stream");

    const body = res.text;
    expect(body).toMatch(/event: session/);
    expect(body).toMatch(/event: done/);

    const sessionMatch = body.match(/event: session\ndata: (\{[^}]+\})/);
    expect(sessionMatch).not.toBeNull();
    const sessionData = JSON.parse(sessionMatch![1]);
    expect(sessionData.sessionId).toBeDefined();
    sessionId = sessionData.sessionId;
  });

  it("should return SSE stream with only done event for existing session", async () => {
    const res = await request(app)
      .post("/api/chat/messages")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ content: "Second message", sessionId });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/event-stream");

    const body = res.text;
    expect(body).not.toMatch(/event: session/);
    expect(body).toMatch(/event: done/);
  });

  it("should verify history context by checking messages endpoint", async () => {
    const messagesRes = await request(app)
      .get(`/api/chat/sessions/${sessionId}/messages`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(messagesRes.status).toBe(200);
    expect(messagesRes.body.data.data.length).toBeGreaterThanOrEqual(2);

    const roles = messagesRes.body.data.data.map(
      (m: { role: string }) => m.role,
    );
    expect(roles).toContain("user");
    expect(roles).toContain("assistant");
  });

  it("should reject request without token", async () => {
    const res = await request(app)
      .post("/api/chat/messages")
      .send({ content: "Hello" });

    expect(res.status).toBe(401);
  });
});
