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

export async function createStreamingChat(messages: ChatMessage[]) {
  // 测试代码
  if (process.env.NODE_ENV === "test" || process.env.USE_MOCK_AI === "true") {
    return createMockStream();
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 未配置或无效，请配置真实的 API Key");
  }

  /** 
   * 模型的系统提示词
   * message:[{
      "role": "system",
      "name": "MiniMax AI"
      "content":""
    }],
   */
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: messages.map((message) => ({
      role: message.role,
      content: message.content,
      ...(message.name ? { name: message.name } : {}),
    })),
    stream: true,
    temperature: 0.3,
  });

  return response;
}
