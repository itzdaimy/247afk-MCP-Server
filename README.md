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

## Get Started

### Codex CLI
```bash
codex mcp add 247afk-mcp -- npx -y 247afk-mcp
```

### Gemini CLI
```bash
gemini mcp add 247afk-mcp npx "-y 247afk-mcp"
```

### Claude Code
```bash
claude mcp add 247afk-mcp -- npx -y 247afk-mcp
```

### Claude Desktop
```json
{
  "mcpServers": {
    "247afk-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "247afk-mcp"
      ]
    }
  }
}
```

### Cursor

paste this in your browser:
```txt
cursor://anysphere.cursor-deeplink/mcp/install?name=247afk%20Block%20Editor%20MCP%20Server&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIjI0N2Fmay1tY3AiXX0=
```

### Manual
1. Copy configuration below
2. Add it to your MCP client configuration
3. Follow your client's specific setup instructions
4. Restart your MCP client to apply changes

Configuration
```json
{
  "mcpServers": {
    "247afk-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "247afk-mcp"
      ]
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

## Changelog

### 1.0.1
- Added `update_node_data` — merge field values into a node without replacing it
- Added `move_node` — reposition a node on the canvas
- Added `get_node` — inspect a single node's type, position, and data
- Added `clear_graph` — wipe all nodes and edges while keeping variables
- Added `validate_graph` — run client-side validation and return errors/warnings
- Added `save_graph` — save the script to the server (equivalent to Ctrl+S)
- Added `auto_layout` — auto-arrange nodes left-to-right by execution flow
- Added `add_variable` — add or replace a single variable without touching others
- Added `remove_variable` — remove a single variable by name
- Fixed variable picker dropdowns being empty in MCP-built graphs

### 1.0.0
- Initial release

## Requirements

- Node.js 18 or later
- 247afk account with access to the script editor 
- Browser open on the script to edit.
