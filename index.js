#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import './bridge.js'
import { registerDocsTool } from './tools/docs.js'
import { registerGraphTools } from './tools/graph.js'
import { registerNodeTools } from './tools/nodes.js'
import { registerVariableTools } from './tools/variables.js'

const server = new McpServer({
  name: '247afk-block-editor',
  version: '1.0.0'
})

registerDocsTool(server)
registerGraphTools(server)
registerNodeTools(server)
registerVariableTools(server)

const transport = new StdioServerTransport()
await server.connect(transport)
