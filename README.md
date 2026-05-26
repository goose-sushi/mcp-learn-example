# MCP 学习案例

包含三种传输方式的完整 MCP 服务器/客户端实现：

1. **stdio** - 标准输入输出（最简单，推荐）
2. **SSE** - Server-Sent Events（已废弃，仅供学习）
3. **Streamable HTTP** - 流式 HTTP（推荐用于 HTTP 集成）

## 目录结构

```
mcp-learn/
├── src/
│   ├── stdio/              # stdio 方式
│   │   ├── server.js
│   │   └── client.js
│   ├── sse/                # SSE 方式
│   │   ├── server.js
│   │   └── client.js
│   └── streamable-http/    # Streamable HTTP 方式
│       ├── server.js
│       └── client.js
├── package.json
└── README.md
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
npm run stdio:client
```

### 3. SSE 方式

SSE 需要先启动服务器，然后再运行客户端。

```bash
# 终端 1: 启动 SSE 服务器
npm run sse

# 终端 2: 运行 SSE 客户端
npm run sse:client
```

### 4. Streamable HTTP 方式

Streamable HTTP 也需要先启动服务器。

```bash
# 终端 1: 启动 Streamable HTTP 服务器
npm run streamable-http

# 终端 2: 运行 Streamable HTTP 客户端
npm run streamable-http:client
```

## 三种传输方式对比

| 特性 | stdio | SSE | Streamable HTTP |
|------|-------|-----|-----------------|
| **通信方式** | 父子进程 stdin/stdout | HTTP 长连接 + POST | HTTP 请求/响应 |
| **服务器端口** | 无 | 3001 | 3002 |
| **需要先启动服务器** | 否 | 是 | 是 |
| **复杂度** | 低 | 高 | 中 |
| **状态** | ✅ 官方推荐 | ❌ 已废弃 | ✅ 官方推荐 |
| **适用场景** | 本地工具 | - | Web 集成 / Postman 测试 |

## Claude Code 配置

### stdio 方式配置

在 `~/Library/Application Support/Claude/claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "mcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/stdio/server.js"]
    }
  }
}
```

### SSE 方式配置

```json
{
  "mcpServers": {
    "mcp-learn-sse": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

注意：使用 SSE 时需要先启动服务器：`npm run sse`

### Streamable HTTP 方式配置

```json
{
  "mcpServers": {
    "mcp-learn-streamable-http": {
      "url": "http://localhost:3002/message"
    }
  }
}
```

注意：使用 Streamable HTTP 时需要先启动服务器：`npm run streamable-http`

## 可用工具

所有三种方式都提供相同的工具：

- `get_current_time` - 获取当前时间
- `calculator` - 简单计算器
- `echo` - 回显消息
