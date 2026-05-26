# Claude Desktop 配置指南 (FastMCP)

## 配置文件位置

在 macOS 上，配置文件位于：
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

在 Windows 上，配置文件位于：
```
%APPDATA%\Claude\claude_desktop_config.json
```

在 Linux 上，配置文件位于：
```
~/.config/Claude/claude_desktop_config.json
```

## 配置示例

### 1. stdio 方式配置（推荐）

编辑配置文件，添加：

```json
{
  "mcpServers": {
    "fastmcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/fastmcp/stdio/server.js"]
    }
  }
}
```

**优点**：
- 不需要手动启动服务器
- 最简单可靠的方式
- FastMCP 原生支持

**配置步骤**：
1. 关闭 Claude Desktop
2. 编辑配置文件
3. 重新启动 Claude Desktop

---

### 2. SSE 方式配置

```json
{
  "mcpServers": {
    "fastmcp-learn-sse": {
      "url": "http://localhost:3011/sse"
    }
  }
}
```

**注意**：使用 SSE 时需要先启动服务器：
```bash
npm run fastmcp:sse
```

---

### 3. Streamable HTTP 方式配置

```json
{
  "mcpServers": {
    "fastmcp-learn-streamable-http": {
      "url": "http://localhost:3012/mcp"
    }
  }
}
```

**注意**：使用 Streamable HTTP 时需要先启动服务器：
```bash
npm run fastmcp:streamable-http
```

---

### 4. Simple HTTP 方式配置

```json
{
  "mcpServers": {
    "fastmcp-learn-simple-http": {
      "url": "http://localhost:3013/mcp"
    }
  }
}
```

**注意**：使用 Simple HTTP 时需要先启动服务器：
```bash
npm run fastmcp:simple-http
```

---

## 同时配置多个服务器

你可以在同一个配置文件中配置多个 MCP 服务器（包括官方 SDK 和 FastMCP 版本）：

```json
{
  "mcpServers": {
    "fastmcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/fastmcp/stdio/server.js"]
    },
    "fastmcp-learn-sse": {
      "url": "http://localhost:3011/sse"
    },
    "fastmcp-learn-streamable-http": {
      "url": "http://localhost:3012/mcp"
    },
    "mcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/modelcontextprotocol/stdio/server.js"]
    }
  }
}
```

---

## 验证配置

1. 启动 Claude Desktop
2. 打开一个新对话
3. 点击输入框左侧的 "+" 按钮或查看可用工具
4. 你应该能看到以下工具：
   - `get_current_time` - 获取当前时间
   - `calculator` - 计算器
   - `echo` - 回显消息

---

## 故障排除

### 问题：看不到工具

**解决方案**：
1. 确认配置文件路径正确
2. 检查 JSON 格式是否正确
3. 确认路径中的空格或特殊字符已正确处理
4. 查看 Claude Desktop 的日志文件

### 问题：工具调用失败

**解决方案**：
1. 如果使用 SSE、Streamable HTTP 或 Simple HTTP，确认服务器已启动
2. 检查端口是否被占用（FastMCP 使用 3011-3013，官方 SDK 使用 3001-3003）
3. 查看服务器控制台输出的错误信息

### 问题：工具参数验证错误

FastMCP 内置 Zod 验证，如果参数不正确会返回清晰的错误信息。确保传递正确的参数类型。

---

## 与官方 SDK 版本对比

| 特性 | FastMCP | 官方 SDK |
|------|---------|----------|
| **stdio 端口** | 无 | 无 |
| **SSE 端口** | 3011 | 3001 |
| **Streamable HTTP 端口** | 3012 | 3002 |
| **Simple HTTP 端口** | 3013 | 3003 |
| **HTTP 端点** | `/mcp` |  varies |
| **工具名** | `get_current_time` | `get_current_time` / `get-current-time` |

官方 SDK 版本详见 `../modelcontextprotocol/CLAUDE_SETUP.md`
