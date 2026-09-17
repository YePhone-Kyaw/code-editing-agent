import OpenAI from "openai";
import * as readline from "readline";
import { Agent } from "./agent";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

async function main() {
  const rl = readline.createInterface({ input: process.stdin });

  const getUserMessage = () =>
    new Promise<string>((resolve) => {
      console.log("Ask anyting you wanna know");
      process.stdout.write("");
      rl.once("line", resolve);
    });

  const agent = new Agent(client, getUserMessage);
  await agent.run();
}

main();
