#!/usr/bin/env node
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

async function main() {
  const transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3002/mcp")
  );

  const client = new Client(
    { name: "mcp-learn-streamable-http-client", version: "1.0.0" },
    { capabilities: {} }
  );

  console.log("正在连接 Streamable HTTP 服务器...");
  await client.connect(transport);
  console.log("✅ 已连接到 Streamable HTTP 服务器\n");

  const tools = await client.listTools();
  console.log("📋 可用工具:");
  tools.tools.forEach((tool) => {
    console.log(`  - ${tool.name}: ${tool.description}`);
  });
  console.log();

  console.log("🧪 测试工具...\n");

  console.log("1️⃣ 测试 get-current-time:");
  const timeResult = await client.callTool({
    name: "get-current-time",
    arguments: { format: "full" },
  });
  console.log("   ", timeResult.content[0].text, "\n");

  console.log("2️⃣ 测试 calculator (add):");
  const addResult = await client.callTool({
    name: "calculator",
    arguments: { operation: "add", a: 15, b: 7 },
  });
  console.log("   ", addResult.content[0].text, "\n");

  console.log("3️⃣ 测试 calculator (multiply):");
  const mulResult = await client.callTool({
    name: "calculator",
    arguments: { operation: "multiply", a: 6, b: 9 },
  });
  console.log("   ", mulResult.content[0].text, "\n");

  console.log("4️⃣ 测试 echo:");
  const echoResult = await client.callTool({
    name: "echo",
    arguments: { message: "Hello from Streamable HTTP client!" },
  });
  console.log("   ", echoResult.content[0].text, "\n");

  console.log("5️⃣ 测试 calculator (divide by zero):");
  const divResult = await client.callTool({
    name: "calculator",
    arguments: { operation: "divide", a: 10, b: 0 },
  });
  console.log("   ", divResult.content[0].text);
  console.log("   isError:", divResult.isError, "\n");

  console.log("🧹 关闭连接...");
  await client.close();
  console.log("✅ 连接已关闭");
}

main().catch((error) => {
  console.error("❌ 错误:", error);
  process.exit(1);
});
