# FastMCP 学习案例

使用 FastMCP 框架实现的 MCP 服务器/客户端，代码更简洁，开发更高效。

包含四种传输方式：

1. **stdio** - 标准输入输出（最简单，推荐）
2. **SSE** - Server-Sent Events
3. **Streamable HTTP** - 流式 HTTP（推荐用于 HTTP 集成）
4. **Simple HTTP** - 简化版 HTTP（最适合 Postman 测试）

## 目录结构

```
fastmcp/
├── stdio/              # stdio 方式
│   ├── server.js
│   └── client.js
├── sse/                # SSE 方式
│   ├── server.js
│   └── client.js
├── streamable-http/    # Streamable HTTP 方式
│   ├── server.js
│   └── client.js
└── simple-http/        # Simple HTTP 方式
    ├── server.js
    └── client.js
```

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. stdio 方式（推荐入门）

stdio 是最简单的方式，客户端直接启动服务器作为子进程。

```bash
# 运行客户端（会自动启动服务器）
npm run fastmcp:stdio:client
```

### 3. SSE 方式

SSE 需要先启动服务器，然后再运行客户端。

```bash
# 终端 1: 启动 SSE 服务器
npm run fastmcp:sse

# 终端 2: 运行 SSE 客户端
npm run fastmcp:sse:client
```

### 4. Streamable HTTP 方式

Streamable HTTP 也需要先启动服务器。

```bash
# 终端 1: 启动 Streamable HTTP 服务器
npm run fastmcp:streamable-http

# 终端 2: 运行 Streamable HTTP 客户端
npm run fastmcp:streamable-http:client
```

### 5. Simple HTTP 方式（适合 Postman 测试）

```bash
# 启动 Simple HTTP 服务器
npm run fastmcp:simple-http

# 运行客户端
npm run fastmcp:simple-http:client
```

## 四种传输方式对比

| 特性 | stdio | SSE | HTTP Stream | Simple HTTP |
|------|-------|-----|-------------|-------------|
| **通信方式** | 父子进程 stdin/stdout | HTTP 长连接 + POST | HTTP 请求/响应 | HTTP 请求/响应 |
| **服务器端口** | 无 | 3011 | 3012 | 3013 |
| **需要先启动服务器** | 否 | 是 | 是 | 是 |
| **复杂度** | 低 | 低 | 低 | 低 |
| **FastMCP 支持** | ✅ 原生 | ✅ 原生 | ✅ 原生 | ✅ 原生 |
| **适用场景** | 本地工具 | Web 集成 | Web 集成 / Claude Desktop | Postman 测试 |

**注意：** FastMCP 使用 `httpStream` 作为 HTTP 传输类型（配置中的 `transportType: "httpStream"`），而不是 `streamable-http`。

## 可用工具

所有四种方式都提供相同的工具：

- `get_current_time` - 获取当前时间
- `calculator` - 简单计算器
- `echo` - 回显消息

## FastMCP 优势

与官方 SDK 相比，FastMCP 提供：

- **更简洁的 API** - 使用 `server.addTool()` 注册工具
- **内置 Zod 验证** - 参数自动验证
- **更少的代码** - 相同功能代码量减少约 50%
- **统一接口** - 所有传输方式使用相同的 API
- **更多功能** - 内置资源、提示、认证等支持

## 与官方 SDK 的对比

本目录使用 `fastmcp` 包，代码更简洁。

- 官方 SDK：灵活、功能完整，但代码量大（详见 `../modelcontextprotocol/` 目录）
- FastMCP：简洁、易用，代码量减少约 50%

### 关于警告信息

当启动 FastMCP 服务器时，你可能会看到警告：
```
[FastMCP warning] could not infer client capabilities after 10 attempts. Connection may be unstable.
```

**这是正常的！** 这个警告只是表示服务器正在等待客户端连接。一旦有客户端连接（比如通过 Claude Desktop 或我们的测试客户端），这个警告就会消失。

### 代码对比示例

**官方 SDK:**
```javascript
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  // 处理工具调用
});
```

**FastMCP:**
```javascript
server.addTool({
  name: "tool_name",
  description: "工具描述",
  parameters: z.object({ ... }),
  execute: async (args) => {
    // 执行工具
  }
});
```
