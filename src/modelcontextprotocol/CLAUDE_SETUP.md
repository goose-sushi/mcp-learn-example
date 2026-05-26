# Claude Desktop 配置指南 (官方 SDK)

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
    "mcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/modelcontextprotocol/stdio/server.js"]
    }
  }
}
```

**优点**：
- 不需要手动启动服务器
- 最简单可靠的方式

**配置步骤**：
1. 关闭 Claude Desktop
2. 编辑配置文件
3. 重新启动 Claude Desktop

---

### 2. SSE 方式配置

```json
{
  "mcpServers": {
    "mcp-learn-sse": {
      "url": "http://localhost:3001/sse"
    }
  }
}
```

**注意**：使用 SSE 时需要先启动服务器：
```bash
npm run mcp:sse
```

---

### 3. Streamable HTTP 方式配置

```json
{
  "mcpServers": {
    "mcp-learn-streamable-http": {
      "url": "http://localhost:3002/mcp"
    }
  }
}
```

**注意**：使用 Streamable HTTP 时需要先启动服务器：
```bash
npm run mcp:streamable-http
```

---

## 同时配置多个服务器

你可以在同一个配置文件中配置多个 MCP 服务器：

```json
{
  "mcpServers": {
    "mcp-learn-stdio": {
      "command": "node",
      "args": ["/Users/mao/code/mcp-learn/src/modelcontextprotocol/stdio/server.js"]
    },
    "mcp-learn-sse": {
      "url": "http://localhost:3001/sse"
    },
    "mcp-learn-streamable-http": {
      "url": "http://localhost:3002/mcp"
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
1. 如果使用 SSE 或 Streamable HTTP，确认服务器已启动
2. 检查端口是否被占用
3. 查看服务器控制台输出的错误信息

---

## 与 FastMCP 版本对比

官方 SDK 和 FastMCP 版本的 Claude 配置方式基本相同，只需要调整路径即可。FastMCP 版本详见 `../fastmcp/CLAUDE_SETUP.md`
