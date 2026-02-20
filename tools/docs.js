import { node_defenitions } from './nodeDefs.js'

function buildDocs() {
  const lines = []

  lines.push('# 247afk Block Editor — AI Reference')
  lines.push('')
  lines.push('## Graph Format')
  lines.push('A script graph has three fields:')
  lines.push('- `nodes`: array of node objects')
  lines.push('- `edges`: array of connection objects')
  lines.push('- `variables`: array of variable objects')
  lines.push('')
  lines.push('### Node object')
  lines.push('```json')
  lines.push('{ "id": "node_1", "type": "send_chat", "position": { "x": 200, "y": 100 }, "data": { "message": "hello" } }')
  lines.push('```')
  lines.push('- `id`: unique string — use node_1, node_2, etc.')
  lines.push('- `type`: one of the node types listed below')
  lines.push('- `position`: canvas coords. Space nodes 220-280px apart horizontally.')
  lines.push('- `data`: input values keyed by port name. Omit exec ports.')
  lines.push('')
  lines.push('### Edge object')
  lines.push('```json')
  lines.push('{ "id": "edge_1", "source": "node_1", "sourceHandle": "exec_out", "target": "node_2", "targetHandle": "exec_in" }')
  lines.push('```')
  lines.push('')
  lines.push('### Variable object')
  lines.push('```json')
  lines.push('{ "name": "counter", "type": "number", "value": 0 }')
  lines.push('```')
  lines.push('Variable types: `string`, `number`, `boolean`')
  lines.push('')
  lines.push('## Port Types & Connection Rules')
  lines.push('- `exec` (white): execution flow. Connects exec_out → exec_in only.')
  lines.push('- `string` (pink): text values')
  lines.push('- `number` (cyan): numeric values')
  lines.push('- `boolean` (red): true/false values')
  lines.push('- Data ports can connect across compatible types.')
  lines.push('- A target input port accepts only ONE incoming edge.')
  lines.push('')
  lines.push('## Validation Rules')
  lines.push('- Event nodes SHOULD have at least one exec_out connection (warning otherwise).')
  lines.push('- Non-event nodes with exec outputs MUST have an incoming exec connection.')
  lines.push('- Non-exec input ports without a wire MUST have a value in `data`.')
  lines.push('- `if_variable`: `data.variable` must match a declared variable name.')
  lines.push('- A graph with zero nodes is always valid.')
  lines.push('')
  lines.push('## Variable System')
  lines.push('Variables are declared in the `variables` array and referenced by name in:')
  lines.push('- `get_variable` node: `data.name` = variable name')
  lines.push('- `set_variable` node: `data.name` = variable name, `data.value` = new value')
  lines.push('- `if_variable` node: `data.variable` = variable name to compare')
  lines.push('Variables persist for the lifetime of the running script.')
  lines.push('')
  lines.push('## Available MCP Tools')
  lines.push('')
  lines.push('### Read-only')
  lines.push('- `get_docs` — Returns this reference. Call once at the start.')
  lines.push('- `get_graph` — Returns `{ nodes, edges, variables }` for the live editor.')
  lines.push('- `get_node(nodeId)` — Returns a single node\'s type, position, and data.')
  lines.push('- `validate_graph` — Runs validation, returns errors and warnings.')
  lines.push('')
  lines.push('### Graph-level')
  lines.push('- `set_graph(nodes, edges, variables)` — Replace the entire graph at once.')
  lines.push('- `clear_graph()` — Wipe all nodes and edges (variables are kept).')
  lines.push('- `auto_layout()` — Arrange nodes left-to-right by exec flow.')
  lines.push('- `save_graph()` — Save the script to the server (like Ctrl+S).')
  lines.push('')
  lines.push('### Node operations')
  lines.push('- `add_node(type, position?, data?)` — Add a node.')
  lines.push('- `remove_node(nodeId)` — Remove a node and its edges.')
  lines.push('- `update_node_data(nodeId, data)` — Merge new field values into a node without removing it.')
  lines.push('- `move_node(nodeId, position)` — Move a node to new coordinates.')
  lines.push('')
  lines.push('### Edge operations')
  lines.push('- `add_edge(sourceNodeId, sourceHandle, targetNodeId, targetHandle)` — Connect two ports.')
  lines.push('- `remove_edge(edgeId)` — Remove an edge.')
  lines.push('')
  lines.push('### Variable operations')
  lines.push('- `set_variables(variables)` — Replace the entire variables list.')
  lines.push('- `add_variable(name, type, value?)` — Add or replace one variable.')
  lines.push('- `remove_variable(name)` — Remove one variable by name.')
  lines.push('')
  lines.push('## Node Types Reference')
  lines.push('')

  const byCategory = {}
  for (const [type, def] of Object.entries(node_defenitions)) {
    if (!byCategory[def.category]) byCategory[def.category] = []
    byCategory[def.category].push({ type, ...def })
  }

  for (const [category, nodes] of Object.entries(byCategory)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)} Nodes`)
    lines.push('')

    for (const node of nodes) {
      lines.push(`#### \`${node.type}\` — ${node.label}`)

      const execIn = Object.entries(node.inputs || {}).filter(([, p]) => p.type === 'exec')
      const execOut = Object.entries(node.outputs || {}).filter(([, p]) => p.type === 'exec')
      const dataIn = Object.entries(node.inputs || {}).filter(([, p]) => p.type !== 'exec')
      const dataOut = Object.entries(node.outputs || {}).filter(([, p]) => p.type !== 'exec')

      if (execIn.length) lines.push(`Exec in: ${execIn.map(([k]) => k).join(', ')}`)
      if (execOut.length) lines.push(`Exec out: ${execOut.map(([k, p]) => p.label ? `${k} (${p.label})` : k).join(', ')}`)

      if (dataIn.length) {
        lines.push('Data inputs:')
        for (const [key, port] of dataIn) {
          let desc = `  - \`${key}\` (${port.type}): ${port.label || key}`
          if (port.default !== undefined) desc += ` — default: ${JSON.stringify(port.default)}`
          if (port.options) desc += ` — options: ${port.options.join(' | ')}`
          if (port.variablePicker) desc += ` — must be a declared variable name`
          if (port.dynamicType) desc += ` — type matches the variable type`
          lines.push(desc)
        }
      }

      if (dataOut.length) {
        lines.push('Data outputs:')
        for (const [key, port] of dataOut) {
          let desc = `  - \`${key}\` (${port.type}): ${port.label || key}`
          if (port.dynamicType) desc += ` — type matches the variable type`
          lines.push(desc)
        }
      }

      lines.push('')
    }
  }

  lines.push('## Example: Chat auto-responder')
  lines.push('```json')
  lines.push(JSON.stringify({
    nodes: [
      { id: 'node_1', type: 'on_chat_message', position: { x: 100, y: 100 }, data: {} },
      { id: 'node_2', type: 'send_chat', position: { x: 380, y: 100 }, data: { message: 'hello!' } }
    ],
    edges: [
      { id: 'edge_1', source: 'node_1', sourceHandle: 'exec_out', target: 'node_2', targetHandle: 'exec_in' }
    ],
    variables: []
  }, null, 2))
  lines.push('```')

  lines.push('')
  lines.push('## Example: Jump every 5 seconds')
  lines.push('```json')
  lines.push(JSON.stringify({
    nodes: [
      { id: 'node_1', type: 'on_timer', position: { x: 100, y: 100 }, data: { interval: 5 } },
      { id: 'node_2', type: 'jump', position: { x: 380, y: 100 }, data: {} }
    ],
    edges: [
      { id: 'edge_1', source: 'node_1', sourceHandle: 'exec_out', target: 'node_2', targetHandle: 'exec_in' }
    ],
    variables: []
  }, null, 2))
  lines.push('```')

  lines.push('')
  lines.push('## Example: Echo chat messages (data port wiring)')
  lines.push('```json')
  lines.push(JSON.stringify({
    nodes: [
      { id: 'node_1', type: 'on_chat_message', position: { x: 100, y: 100 }, data: {} },
      { id: 'node_2', type: 'send_chat', position: { x: 380, y: 100 }, data: {} }
    ],
    edges: [
      { id: 'edge_1', source: 'node_1', sourceHandle: 'exec_out', target: 'node_2', targetHandle: 'exec_in' },
      { id: 'edge_2', source: 'node_1', sourceHandle: 'message', target: 'node_2', targetHandle: 'message' }
    ],
    variables: []
  }, null, 2))
  lines.push('```')
  lines.push('Note: edge_2 wires the `message` data output of `on_chat_message` into the `message` data input of `send_chat`. When a data port is wired, the `data` value for that input is ignored.')

  return lines.join('\n')
}

const docs_txt = buildDocs()

export function registerDocsTool(server) {
  server.tool(
    'get_docs',
    'Get full documentation for the 247afk block editor, node types, connection rules, graph format, and examples. Call this first before building any script.',
    {},
    async () => ({ content: [{ type: 'text', text: docs_txt }] })
  )
}
