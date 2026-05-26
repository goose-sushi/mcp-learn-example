#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import http from "http";

const PORT = 3001;

// 存储活跃的 SSE 会话
const sessions = new Map();

async function main() {
  const server = new Server(
    { name: "mcp-learn-sse-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "get_current_time",
          description: "获取当前时间",
          inputSchema: {
            type: "object",
            properties: {
              format: {
                type: "string",
                enum: ["timestamp", "iso", "full", "date", "time"],
                description: "时间格式（默认：full）",
              },
            },
          },
        },
        {
          name: "calculator",
          description: "简单的计算器，支持加减乘除",
          inputSchema: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["add", "subtract", "multiply", "divide"],
                description: "运算类型",
              },
              a: { type: "number", description: "第一个数" },
              b: { type: "number", description: "第二个数" },
            },
            required: ["operation", "a", "b"],
          },
        },
        {
          name: "echo",
          description: "回显消息",
          inputSchema: {
            type: "object",
            properties: {
              message: { type: "string", description: "要回显的消息" },
            },
            required: ["message"],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "get_current_time") {
      const now = new Date();
      const format = args?.format || "full";
      let result;

      switch (format) {
        case "timestamp":
          result = now.getTime().toString();
          break;
        case "iso":
          result = now.toISOString();
          break;
        case "date":
          result = now.toLocaleDateString("zh-CN");
          break;
        case "time":
          result = now.toLocaleTimeString("zh-CN");
          break;
        case "full":
        default:
          result = now.toLocaleString("zh-CN");
      }

      return {
        content: [
          {
            type: "text",
            text: `当前时间（${format}）: ${result}`,
          },
        ],
      };
    }

    if (name === "calculator") {
      const { operation, a, b } = args;
      let result;

      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            return {
              content: [{ type: "text", text: "错误：除数不能为零" }],
              isError: true,
            };
          }
          result = a / b;
          break;
        default:
          return {
            content: [{ type: "text", text: "错误：不支持的运算" }],
            isError: true,
          };
      }

      return {
        content: [
          {
            type: "text",
            text: `计算结果: ${a} ${operation} ${b} = ${result}`,
          },
        ],
      };
    }

    if (name === "echo") {
      const { message } = args;
      return {
        content: [
          {
            type: "text",
            text: `回显: ${message}\n长度: ${message.length} 字符`,
          },
        ],
      };
    }

    return {
      content: [{ type: "text", text: `未知工具: ${name}` }],
      isError: true,
    };
  });

  // 创建 HTTP 服务器
  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const sessionId = url.searchParams.get("sessionId");

    // SSE 连接请求
    if (req.method === "GET" && pathname === "/sse") {
      console.log("新的 SSE 连接请求");
      
      // 创建 SSE 传输
      const transport = new SSEServerTransport("/message", res);
      
      // 存储会话
      sessions.set(transport.sessionId, transport);
      console.log(`会话 ${transport.sessionId} 已创建`);
      
      // 连接到 MCP 服务器
      await server.connect(transport);
      
      // 清理会话
      res.on("close", () => {
        console.log(`会话 ${transport.sessionId} 已关闭`);
        sessions.delete(transport.sessionId);
      });
      return;
    }

    // 消息 POST 请求
    if (req.method === "POST" && pathname === "/message") {
      if (!sessionId) {
        res.writeHead(400).end("Missing sessionId parameter");
        return;
      }

      const transport = sessions.get(sessionId);
      if (!transport) {
        res.writeHead(404).end("Session not found");
        return;
      }

      // 处理 POST 消息
      await transport.handlePostMessage(req, res);
      return;
    }

    // 404
    res.writeHead(404).end("Not Found");
  });

  httpServer.listen(PORT, () => {
    console.log(`SSE 服务器已启动`);
    console.log(`- 监听端口: ${PORT}`);
    console.log(`- SSE 端点: http://localhost:${PORT}/sse`);
    console.log(`- 消息端点: http://localhost:${PORT}/message`);
    console.log(`\n注意: SSEServerTransport 已被官方废弃，推荐使用 Streamable HTTP 方式`);
  });
}

main().catch((error) => {
  console.error("SSE 服务器启动失败:", error);
  process.exit(1);
});
