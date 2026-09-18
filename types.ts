export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: object;
  execute: (input: any) => Promise<string>;
}
