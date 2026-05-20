# MCP 学习案例

这是一个简单的 MCP (Model Context Protocol) 学习示例项目。

## 什么是 MCP？

MCP (Model Context Protocol) 是一个开放协议，用于连接 AI 助手与外部数据源和工具。它允许 AI 模型安全地与本地文件、数据库、API 等交互。

## 项目结构

```
mcp-learn/
├── package.json
└── src/
    ├── server.js   # MCP 服务器
    └── client.js   # 客户端示例
```

## 安装

```bash
npm install
```

## 运行

### 运行客户端示例

```bash
npm run client
```

这个命令会启动服务器并运行客户端示例，展示如何使用各种工具。

### 单独启动服务器

```bash
npm start
```

## 可用工具

### 1. get_current_time
获取当前时间。

参数：
- `format`: 时间格式（可选）
  - `YYYY-MM-DD` - 只显示日期
  - `HH:mm:ss` - 只显示时间
  - `full` - 完整时间（默认）

### 2. calculator
执行基本数学运算。

参数：
- `operation`: 运算类型
  - `add` - 加法
  - `subtract` - 减法
  - `multiply` - 乘法
  - `divide` - 除法
- `a`: 第一个数字
- `b`: 第二个数字

### 3. echo
回显消息，并返回消息长度。

参数：
- `message`: 要回显的消息

## 学习要点

1. **服务器创建**：使用 `Server` 类和 `StdioServerTransport`
2. **工具注册**：通过 `setRequestHandler(ListToolsRequestSchema, ...)` 注册工具列表
3. **工具调用处理**：通过 `setRequestHandler(CallToolRequestSchema, ...)` 处理工具调用
4. **客户端连接**：使用 `Client` 类和 `StdioClientTransport` 连接服务器
5. **调用工具**：使用 `client.callTool()` 调用工具

## 下一步

你可以：
- 添加更多工具（如读取文件、查询数据库等）
- 探索 MCP 的资源 (resources) 功能
- 尝试添加提示 (prompts) 功能
- 在 Claude Desktop 或其他支持 MCP 的应用中使用这个服务器
