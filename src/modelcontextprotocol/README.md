# Model Context Protocol (官方 SDK) 学习案例

包含三种传输方式的完整 MCP 服务器/客户端实现：

1. **stdio** - 标准输入输出（最简单，推荐）
2. **SSE** - Server-Sent Events（已废弃，仅供学习）
3. **Streamable HTTP** - 流式 HTTP（推荐用于 HTTP 集成）
4. **Simple HTTP** - 简化版 HTTP（最适合 Postman 测试）

## 目录结构

```
modelcontextprotocol/
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
    └── server.js
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
npm run mcp:stdio:client
```

### 3. SSE 方式

SSE 需要先启动服务器，然后再运行客户端。

```bash
# 终端 1: 启动 SSE 服务器
npm run mcp:sse

# 终端 2: 运行 SSE 客户端
npm run mcp:sse:client
```

### 4. Streamable HTTP 方式

Streamable HTTP 也需要先启动服务器。

```bash
# 终端 1: 启动 Streamable HTTP 服务器
npm run mcp:streamable-http

# 终端 2: 运行 Streamable HTTP 客户端
npm run mcp:streamable-http:client
```

### 5. Simple HTTP 方式（适合 Postman 测试）

```bash
# 启动 Simple HTTP 服务器
npm run mcp:simple-http
```

然后使用 Postman 测试，详见 `POSTMAN_TESTING.md`

## 四种传输方式对比

| 特性 | stdio | SSE | Streamable HTTP | Simple HTTP |
|------|-------|-----|-----------------|-------------|
| **通信方式** | 父子进程 stdin/stdout | HTTP 长连接 + POST | HTTP 请求/响应 | HTTP 请求/响应 |
| **服务器端口** | 无 | 3001 | 3002 | 3003 |
| **需要先启动服务器** | 否 | 是 | 是 | 是 |
| **复杂度** | 低 | 高 | 中 | 低 |
| **状态** | ✅ 官方推荐 | ❌ 已废弃 | ✅ 官方推荐 | 🔧 简化版 |
| **适用场景** | 本地工具 | - | Web 集成 / Claude Desktop | Postman 测试 |

## 可用工具

所有四种方式都提供相同的工具：

- `get_current_time` - 获取当前时间
- `calculator` - 简单计算器
- `echo` - 回显消息

## 与 FastMCP 的对比

本目录使用官方 `@modelcontextprotocol/sdk`，功能完整但需要编写较多样板代码。

- 官方 SDK：灵活、功能完整，但代码量大
- FastMCP：简洁、易用，代码量减少约 50%，详见 `../fastmcp/` 目录
