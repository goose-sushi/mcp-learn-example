#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP({
  name: "mcp-learn-fastmcp-stdio",
  version: "1.0.0",
});

server.addTool({
  name: "get_current_time",
  description: "获取当前时间",
  parameters: z.object({
    format: z.enum(["YYYY-MM-DD", "HH:mm:ss", "full"]).optional().describe("时间格式"),
  }),
  execute: async (args) => {
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
    return JSON.stringify({ time: result });
  },
});

server.addTool({
  name: "calculator",
  description: "计算器 - 执行基本数学运算",
  parameters: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("运算类型"),
    a: z.number().describe("第一个数字"),
    b: z.number().describe("第二个数字"),
  }),
  execute: async (args) => {
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
    return JSON.stringify({ operation, a, b, result });
  },
});

server.addTool({
  name: "echo",
  description: "回显消息",
  parameters: z.object({
    message: z.string().describe("要回显的消息"),
  }),
  execute: async (args) => {
    return JSON.stringify({ echo: args.message, length: args.message.length });
  },
});

server.start({
  transportType: "stdio",
});
