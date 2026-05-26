#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';

// 每次请求创建新的服务器实例
const getServer = () => {
  const server = new Server(
    { name: 'mcp-learn-streamable-http-server', version: '1.0.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'get-current-time',
          description: '获取当前时间',
          inputSchema: {
            type: 'object',
            properties: {
              format: {
                type: 'string',
                enum: ['timestamp', 'iso', 'full', 'date', 'time'],
                description: '时间格式（默认：full）',
              },
            },
          },
        },
        {
          name: 'calculator',
          description: '简单的计算器，支持加减乘除',
          inputSchema: {
            type: 'object',
            properties: {
              operation: {
                type: 'string',
                enum: ['add', 'subtract', 'multiply', 'divide'],
                description: '运算类型',
              },
              a: { type: 'number', description: '第一个数' },
              b: { type: 'number', description: '第二个数' },
            },
            required: ['operation', 'a', 'b'],
          },
        },
        {
          name: 'echo',
          description: '回显消息',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: '要回显的消息' },
            },
            required: ['message'],
          },
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'get-current-time') {
      const now = new Date();
      const format = args?.format || 'full';
      let result;

      switch (format) {
        case 'timestamp':
          result = now.getTime().toString();
          break;
        case 'iso':
          result = now.toISOString();
          break;
        case 'date':
          result = now.toLocaleDateString('zh-CN');
          break;
        case 'time':
          result = now.toLocaleTimeString('zh-CN');
          break;
        case 'full':
        default:
          result = now.toLocaleString('zh-CN');
      }

      return {
        content: [
          {
            type: 'text',
            text: `当前时间（${format}）: ${result}`,
          },
        ],
      };
    }

    if (name === 'calculator') {
      const { operation, a, b } = args;
      let result;

      switch (operation) {
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          if (b === 0) {
            return {
              content: [{ type: 'text', text: '错误：除数不能为零' }],
              isError: true,
            };
          }
          result = a / b;
          break;
        default:
          return {
            content: [{ type: 'text', text: '错误：不支持的运算' }],
            isError: true,
          };
      }

      return {
        content: [
          {
            type: 'text',
            text: `计算结果: ${a} ${operation} ${b} = ${result}`,
          },
        ],
      };
    }

    if (name === 'echo') {
      const { message } = args;
      return {
        content: [
          {
            type: 'text',
            text: `回显: ${message}\n长度: ${message.length} 字符`,
          },
        ],
      };
    }

    return {
      content: [{ type: 'text', text: `未知工具: ${name}` }],
      isError: true,
    };
  });

  return server;
};

// 创建 Express 应用
const app = createMcpExpressApp();

// 处理 POST 请求
app.post('/mcp', async (req, res) => {
  const server = getServer();
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

// 处理 GET 请求（可选的 SSE 端点）
app.get('/mcp', async (req, res) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    })
  );
});

// 处理 DELETE 请求
app.delete('/mcp', async (req, res) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Method not allowed.',
      },
      id: null,
    })
  );
});

// 启动服务器
const PORT = 3002;
app.listen(PORT, (error) => {
  if (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
  console.log(`Streamable HTTP 服务器已启动`);
  console.log(`- 监听端口: ${PORT}`);
  console.log(`- MCP 端点: http://localhost:${PORT}/mcp`);
});

// 处理服务器关闭
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  process.exit(0);
});
