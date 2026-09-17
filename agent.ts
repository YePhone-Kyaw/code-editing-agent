import OpenAI from "openai";

export class Agent {
  constructor(
    private client: OpenAI,
    private getUserMessage: () => Promise<string>,
  ) {}

  async run() {
    const conversation: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    console.log("Chat with AI (use Ctrl + C to quit)");

    while (true) {
      const userInput = await this.getUserMessage();
      conversation.push({ role: "user", content: userInput });

      const message = await this.runInference(conversation);
      const reply = message.choices[0].message.content;

      conversation.push({ role: "assistant", content: reply });
      console.log(`Assistant: ${reply}`);
    }
  }
  private async runInference(
    conversation: OpenAI.Chat.ChatCompletionMessageParam[],
  ) {
    return await this.client.chat.completions.create({
      max_tokens: 1024,
      messages: conversation,
      model: "gpt-4o-mini",
    });
  }
}
