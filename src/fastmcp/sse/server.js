#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";

const server = new FastMCP({
  name: "mcp-learn-fastmcp-sse",
  version: "1.0.0",
});

server.addTool({
  name: "get_current_time",
  description: "获取当前时间",
  parameters: z.object({
    format: z.enum(["timestamp", "iso", "full", "date", "time"]).optional().describe("时间格式（默认：full）"),
  }),
  execute: async (args) => {
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
    return `当前时间（${format}）: ${result}`;
  },
});

server.addTool({
  name: "calculator",
  description: "简单的计算器，支持加减乘除",
  parameters: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("运算类型"),
    a: z.number().describe("第一个数"),
    b: z.number().describe("第二个数"),
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
        throw new Error("不支持的运算");
    }
    return `计算结果: ${a} ${operation} ${b} = ${result}`;
  },
});

server.addTool({
  name: "echo",
  description: "回显消息",
  parameters: z.object({
    message: z.string().describe("要回显的消息"),
  }),
  execute: async (args) => {
    return `回 显: ${args.message}\n长度: ${args.message.length} 字符 `;
  },
});

server.start({
  transportType: "sse",
  sse: {
    port: 3011,
    endpoint: "/sse",
  },
});
