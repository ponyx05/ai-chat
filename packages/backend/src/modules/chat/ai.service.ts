import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  name?: string;
}

function createMockStream(): AsyncIterable<any> {
  const mockResponse = "这是一条模拟 AI 响应，用于测试环境。";
  async function* mockGenerator() {
    yield { choices: [{ delta: { content: mockResponse } }] };
  }
  return mockGenerator();
}

export async function createStreamingChat(
  messages: ChatMessage[],
  model?: string,
) {
  if (process.env.NODE_ENV === "test" || process.env.USE_MOCK_AI === "true") {
    return createMockStream();
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 未配置或无效，请配置真实的 API Key");
  }

  const response = await openai.chat.completions.create({
    model: model || (process.env.OPENAI_MODEL as string),
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
      ...(m.name ? { name: m.name } : {}),
    })),
    stream: true,
    temperature: 0.3,
  });

  return response;
}