# Postman 测试 MCP 服务器指南 (FastMCP)

## 🎯 推荐方式：Simple HTTP（最适合 Postman）

### 1. 启动 Simple HTTP 服务器

```bash
npm run fastmcp:simple-http
```

### 2. 在 Postman 中测试

FastMCP 使用标准的 MCP 协议，测试方式与官方 SDK 类似。

#### 请求 1: 初始化 (initialize)

**方法**: POST  
**URL**: `http://localhost:3013/mcp`  
**Headers**: 
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "postman-test",
      "version": "1.0.0"
    }
  }
}
```

#### 请求 2: 列出可用工具

**方法**: POST  
**URL**: `http://localhost:3013/mcp`  
**Headers**: 
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

#### 请求 3: 调用 get_current_time 工具

**方法**: POST  
**URL**: `http://localhost:3013/mcp`  
**Headers**: 
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "get_current_time",
    "arguments": {
      "format": "full"
    }
  }
}
```

#### 请求 4: 调用 calculator 工具 (加法)

**方法**: POST  
**URL**: `http://localhost:3013/mcp`  
**Headers**: 
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "calculator",
    "arguments": {
      "operation": "add",
      "a": 10,
      "b": 5
    }
  }
}
```

#### 请求 5: 调用 echo 工具

**方法**: POST  
**URL**: `http://localhost:3013/mcp`  
**Headers**: 
```
Content-Type: application/json
```

**Body (raw JSON)**:
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": {
      "message": "Hello from Postman to FastMCP!"
    }
  }
}
```

---

## 📋 Streamable HTTP 方式

如果你想测试 Streamable HTTP 功能：

### 1. 启动 Streamable HTTP 服务器

```bash
npm run fastmcp:streamable-http
```

### 2. 在 Postman 中设置 Headers

发送请求到 `http://localhost:3012/mcp`

请求格式与上面相同。

---

## 🔌 SSE 方式

### 1. 启动 SSE 服务器

```bash
npm run fastmcp:sse
```

### 2. 在 Postman 中测试

**步骤 1**: 建立 SSE 连接

**方法**: GET  
**URL**: `http://localhost:3011/sse`

**步骤 2**: 发送消息（需要从 SSE 连接获取 sessionId）

这个过程比较复杂，**推荐直接使用 Simple HTTP 或 Streamable HTTP 方式**。

---

## 💡 FastMCP 测试提示

1. **工具名称**：FastMCP 中的工具名是 `get_current_time`（下划线），而官方 SDK Simple HTTP 是 `get-current-time`（连字符）
2. **URL 路径**：FastMCP 的 HTTP 端点默认是 `/mcp`
3. **参数验证**：FastMCP 内置 Zod 验证，参数不正确会返回清晰的错误信息
4. **错误处理**：FastMCP 会自动将抛出的错误转换为 MCP 错误响应
