# 247afk Block Editor MCP Server

Lets AI assistants (Claude Desktop, Cline, Cursor, and any MCP-compatible client) build and edit block editor scripts in real time.

## How it works

1. The MCP server runs locally and starts a WebSocket bridge on `127.0.0.1:3002`
2. Open a script in the 247afk editor — it connects to the bridge automatically
3. Your AI can now read and edit your script live through the tools below

## Install

```bash
npm install -g 247afk-mcp
```

## Configure your AI client

### AntiGravity / Claude Code

Open AntiGravity and go to mcp servers in the AI chat. 
Click manage mcp servers then view raw config and paste the code below

```json
  {
    "mcpServers": {
      "247afk-mcp": {
        "command": "npx",
        "args": ["-y", "247afk-mcp"]
      }
    }
  }
```


Restart antigravity/claude code after saving. 

## Test without an AI client

```bash
npx @modelcontextprotocol/inspector 247afk-mcp
```

Opens a browser UI to call tools manually.

## Requirements

- Node.js 18 or later
- 247afk account with access to the script editor 
- Browser open on the script to edit.