import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("=== MCP 学习客户端示例 ===\n");

  const transport = new StdioClientTransport({
    command: "node",
    args: [join(__dirname, "server.js")],
  });

  const client = new Client(
    {
      name: "mcp-learn-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log("✓ 已连接到 MCP 服务器\n");

    console.log("1. 列出可用工具...");
    const tools = await client.listTools();
    console.log("可用工具:");
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    console.log("2. 测试 get_current_time 工具...");
    const timeResult = await client.callTool({
      name: "get_current_time",
      arguments: { format: "full" },
    });
    console.log("结果:", timeResult.content[0].text);
    console.log();

    console.log("3. 测试 calculator 工具 (加法)...");
    const addResult = await client.callTool({
      name: "calculator",
      arguments: { operation: "add", a: 15, b: 7 },
    });
    console.log("结果:", addResult.content[0].text);
    console.log();

    console.log("4. 测试 calculator 工具 (乘法)...");
    const multiplyResult = await client.callTool({
      name: "calculator",
      arguments: { operation: "multiply", a: 8, b: 9 },
    });
    console.log("结果:", multiplyResult.content[0].text);
    console.log();

    console.log("5. 测试 echo 工具...");
    const echoResult = await client.callTool({
      name: "echo",
      arguments: { message: "你好，MCP 世界！" },
    });
    console.log("结果:", echoResult.content[0].text);
    console.log();

    console.log("6. 测试错误处理 (除数为零)...");
    const errorResult = await client.callTool({
      name: "calculator",
      arguments: { operation: "divide", a: 10, b: 0 },
    });
    console.log("结果:", errorResult.content[0].text);
    console.log();

  } catch (error) {
    console.error("出错:", error);
  } finally {
    await client.close();
    console.log("✓ 连接已关闭");
  }
}

main();
