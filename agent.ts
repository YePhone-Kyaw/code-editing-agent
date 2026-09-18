import Anthropic from "@anthropic-ai/sdk";

export class Agent {
  constructor(
    private client: Anthropic,
    private getUserMessage: () => Promise<string>,
  ) {}

  async run() {
    const conversation: Anthropic.MessageParam[] = [];

    console.log("Chat with Claude (use Ctrl + C to quit)");

    while (true) {
      const userInput = await this.getUserMessage();
      conversation.push({ role: "user", content: userInput });

      const message = await this.runInference(conversation);
      conversation.push({ role: "assistant", content: message.content });

      for (const block of message.content) {
        if (block.type == "text") {
          console.log(`Claude: ${block.text}`);
        }
      }
    }
  }
  private async runInference(conversation: Anthropic.MessageParam[]) {
    return await this.client.messages.create({
      max_tokens: 1024,
      messages: conversation,
      model: "claude-opus-5",
    });
  }
}
