import Anthropic from "@anthropic-ai/sdk";
import { ToolDefinition } from "./types";

export class Agent {
  constructor(
    private client: Anthropic,
    private getUserMessage: () => Promise<string>,
    private tools: ToolDefinition[] = [],
  ) {}

  async run() {
    const conversation: Anthropic.MessageParam[] = [];

    console.log("Chat with Claude (use Ctrl + C to quit)");

    let readUserInput = true;

    while (true) {
      if (readUserInput) {
        const userInput = await this.getUserMessage();
        conversation.push({ role: "user", content: userInput });
      }

      const message = await this.runInference(conversation);
      conversation.push({ role: "assistant", content: message.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of message.content) {
        if (block.type == "text") {
          console.log(`Claude: ${block.text}`);
        } else if (block.type == "tool_use") {
          const result = await this.executeTool(
            block.id,
            block.name,
            block.input,
          );
          toolResults.push(result);
        }
      }

      if (toolResults.length == 0) {
        readUserInput = true;
        continue;
      }

      readUserInput = false;
      conversation.push({ role: "user", content: toolResults });
    }
  }

  private async runInference(conversation: Anthropic.MessageParam[]) {
    return await this.client.messages.create({
      max_tokens: 1024,
      messages: conversation,
      model: "claude-opus-5",
      tools: this.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
      })),
    });
  }

  private async executeTool(
    id: string,
    name: string,
    input: any,
  ): Promise<Anthropic.ToolResultBlockParam> {
    const tool = this.tools.find((tool) => tool.name === name);

    if (!tool) {
      return {
        type: "tool_result",
        tool_use_id: id,
        content: "Tool not found",
      };
    }

    console.log(`Tool: ${name}(${JSON.stringify(input)})`);

    try {
      const result = await tool.execute(input);
      return { type: "tool_result", tool_use_id: id, content: result };
    } catch (error: any) {
      return { type: "tool_result", tool_use_id: id, content: error.message };
    }
  }
}
