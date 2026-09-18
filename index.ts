import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";
import { Agent } from "./agent";
import "dotenv/config"

const client = new Anthropic({
  apiKey: process.env["OPENAI_API_KEY"],
});

async function main() {
  const rl = readline.createInterface({ input: process.stdin });

  const getUserMessage = () =>
    new Promise<string>((resolve) => {
      process.stdout.write(`You: `);
      rl.once("line", resolve);
    });

  const agent = new Agent(client, getUserMessage);
  await agent.run();
}

main();
