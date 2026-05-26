#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "mcp-learn-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
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
              description: "时间格式 (YYYY-MM-DD, HH:mm:ss, 或完整)",
              enum: ["YYYY-MM-DD", "HH:mm:ss", "full"],
              default: "full",
            },
          },
        },
      },
      {
        name: "calculator",
        description: "计算器 - 执行基本数学运算",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              description: "运算类型",
              enum: ["add", "subtract", "multiply", "divide"],
            },
            a: {
              type: "number",
              description: "第一个数字",
            },
            b: {
              type: "number",
              description: "第二个数字",
            },
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
            message: {
              type: "string",
              description: "要回显的消息",
            },
          },
          required: ["message"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "get_current_time") {
      const now = new Date();
      const format = args.format || "full";
      
      let result;
      switch (format) {
        case "YYYY-MM-DD":
          result = now.toISOString().split("T")[0];
          break;
        case "HH:mm:ss":
          result = now.toTimeString().split(" ")[0];
          break;
        case "full":
        default:
          result = now.toLocaleString("zh-CN");
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ time: result }),
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
            throw new Error("除数不能为零");
          }
          result = a / b;
          break;
        default:
          throw new Error("不支持的运算: " + operation);
      }
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ operation, a, b, result }),
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
            text: JSON.stringify({ echo: message, length: message.length }),
          },
        ],
      };
    }

    throw new Error("未知工具: " + name);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP 学习服务器已启动，运行在 stdio 上");
}

main().catch((error) => {
  console.error("服务器启动失败:", error);
  process.exit(1);
});
