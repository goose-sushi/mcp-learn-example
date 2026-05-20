# 在 Claude Code 中使用 MCP 工具

## 配置步骤

### 1. 找到 Claude Code 配置目录

Claude Code 的配置文件位置取决于你的操作系统：

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### 2. 备份原有配置（如果已有配置）

在修改之前，建议先备份原有的配置文件。

### 3. 编辑配置文件

将 `claude_desktop_config.json` 中的内容复制到你的 Claude 配置文件中。

如果你的配置文件已有其他 MCP 服务器，只需将 `mcp-learn-server` 部分添加到 `mcpServers` 对象中即可。

### 4. 注意路径

请确保配置文件中的路径是**绝对路径**，指向你的 `server.js` 文件：

```json
"args": [
  "/Users/mao/code/mcp-learn/src/server.js"
]
```

### 5. 重启 Claude Code

配置完成后，需要完全退出 Claude Code 并重新启动。

### 6. 验证配置

重启后，在 Claude Code 中输入类似以下内容来测试：

```
使用 get_current_time 工具获取当前时间
```

或者

```
帮我用 calculator 工具计算 25 + 37
```

## 配置示例

### 完整配置文件示例

```json
{
  "mcpServers": {
    "mcp-learn-server": {
      "command": "node",
      "args": [
        "/Users/mao/code/mcp-learn/src/server.js"
      ]
    }
  }
}
```

### 与其他 MCP 服务器共存

如果你已有其他 MCP 服务器，可以这样合并：

```json
{
  "mcpServers": {
    "mcp-learn-server": {
      "command": "node",
      "args": [
        "/Users/mao/code/mcp-learn/src/server.js"
      ]
    },
    "another-server": {
      "command": "python",
      "args": [
        "/path/to/another/server.py"
      ]
    }
  }
}
```

## 快速配置命令（macOS）

你也可以运行以下命令快速配置（先备份原有配置！）：

```bash
# 备份原配置（如果存在）
cp ~/Library/Application\ Support/Claude/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json.backup 2>/dev/null || true

# 复制配置文件
cp /Users/mao/code/mcp-learn/claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

## 故障排查

### 检查 Node.js 是否可用

确保 `node` 命令在 PATH 中：

```bash
node --version
```

### 检查服务器是否可以独立运行

```bash
cd /Users/mao/code/mcp-learn
node src/server.js
```

如果服务器正常启动，你会看到：
```
MCP 学习服务器已启动，运行在 stdio 上
```

按 Ctrl+C 停止服务器。

### 查看 Claude Code 日志

如果有问题，可以查看 Claude Code 的日志文件，通常在配置目录附近。

## 可用工具

在 Claude Code 中你可以使用以下工具：

1. **get_current_time** - 获取当前时间
   - 支持格式：`YYYY-MM-DD`、`HH:mm:ss`、`full`

2. **calculator** - 计算器
   - 运算：add（加）、subtract（减）、multiply（乘）、divide（除）

3. **echo** - 回显消息
