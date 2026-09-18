import { ToolDefinition } from "./types";
import * as fs from "fs";

export const readFileTool: ToolDefinition = {
  name: "read_file",
  description:
    "Read the contents of a given relative file path. Use this when you wanna see what's inside the file. Do not use this with directory names.",
  inputSchema: {
    type: "object",
    properties: {
      path: {
        type: "string",
        description: "The relative path of a file in the working directory.",
      },
    },
    required: ["path"],
  },
  execute: async (input) => {
    return fs.readFileSync(input.path, "utf-8");
  },
};
