# Postman 测试 MCP 服务器指南 (官方 SDK)

## 🎯 推荐方式：Simple HTTP（最适合 Postman）

### 1. 启动 Simple HTTP 服务器

```bash
npm run mcp:simple-http
```

### 2. 在 Postman 中测试

#### 请求 1: 初始化 (initialize)

**方法**: POST  
**URL**: `http://localhost:3003`  
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
**URL**: `http://localhost:3003`  
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

#### 请求 3: 调用 get-current-time 工具

**方法**: POST  
**URL**: `http://localhost:3003`  
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
    "name": "get-current-time",
    "arguments": {
      "format": "full"
    }
  }
}
```

#### 请求 4: 调用 calculator 工具 (加法)

**方法**: POST  
**URL**: `http://localhost:3003`  
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
**URL**: `http://localhost:3003`  
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
      "message": "Hello from Postman!"
    }
  }
}
```

---

## 📋 Streamable HTTP 方式（完整功能）

如果你想测试完整的 Streamable HTTP 功能，需要设置特殊的 Accept 头部：

### 1. 启动 Streamable HTTP 服务器

```bash
npm run mcp:streamable-http
```

### 2. 在 Postman 中设置 Headers

**重要**: 需要添加 `Accept` 头部
```
Content-Type: application/json
Accept: application/json, text/event-stream
```

然后发送请求到 `http://localhost:3002/mcp`

---

## ⚠️ SSE 方式（不推荐用 Postman）

SSE 方式需要先建立 SSE 连接，比较复杂：

1. 先建立 SSE 连接: `GET http://localhost:3001/sse`
2. 从响应中获取 sessionId
3. 然后发送 POST 请求: `POST http://localhost:3001/message?sessionId=xxx`

**建议：直接使用 Simple HTTP 方式，最简单！**
