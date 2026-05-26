#!/usr/bin/env node
import http from "http";

const PORT = 3003;

// 工具定义
const tools = [
  {
    name: "get-current-time",
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
];

// 工具实现
function executeTool(name, args) {
  if (name === "get-current-time") {
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
}

// 创建简单的 HTTP 服务器
const httpServer = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405);
    res.end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32601, message: "Method not found" },
      id: null
    }));
    return;
  }

  // 收集请求体
  let body = "";
  try {
    for await (const chunk of req) {
      body += chunk;
    }

    const request = JSON.parse(body);
    const { jsonrpc, id, method, params } = request;

    if (jsonrpc !== "2.0") {
      res.writeHead(400);
      res.end(JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid Request" },
        id: id || null
      }));
      return;
    }

    let result;

    switch (method) {
      case "initialize":
        result = {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "mcp-learn-simple-http-server",
            version: "1.0.0"
          }
        };
        break;

      case "tools/list":
        result = { tools };
        break;

      case "tools/call":
        result = executeTool(params.name, params.arguments);
        break;

      default:
        res.writeHead(400);
        res.end(JSON.stringify({
          jsonrpc: "2.0",
          error: { code: -32601, message: "Method not found" },
          id
        }));
        return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({
      jsonrpc: "2.0",
      id,
      result
    }));

  } catch (error) {
    console.error("请求处理错误:", error);
    res.writeHead(400);
    res.end(JSON.stringify({
      jsonrpc: "2.0",
      error: { code: -32700, message: "Parse error" },
      id: null
    }));
  }
});

httpServer.listen(PORT, () => {
  console.log(`简化版 HTTP 服务器已启动`);
  console.log(`- 监听端口: ${PORT}`);
  console.log(`- API 端点: http://localhost:${PORT}`);
  console.log(`\n这是专门为 Postman 测试设计的简化版本`);
  console.log(`不需要特殊的 Accept 头部，直接发送 JSON-RPC 请求即可！`);
});
