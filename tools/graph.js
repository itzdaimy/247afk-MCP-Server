import { z } from 'zod'
import { send, getGraph, sendRequest, requireBridge } from '../bridge.js'

export function registerGraphTools(server) {
  server.tool(
    'get_graph',
    'Get the current script graph from the open editor tab. Returns nodes, edges, and variables. The editor tab must be open.',
    {},
    async () => {
      try {
        const graph = await getGraph()
        return { content: [{ type: 'text', text: JSON.stringify(graph, null, 2) }] }
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
      }
    }
  )

  server.tool(
    'set_graph',
    'Replace the entire script graph at once. Use this to build a complete script from scratch. All existing nodes and edges are replaced.',
    {
      nodes: z.array(z.object({
        id: z.string().min(1),
        type: z.string().min(1),
        position: z.object({ x: z.number(), y: z.number() }),
        data: z.record(z.unknown()).optional().default({})
      })),
      edges: z.array(z.object({
        id: z.string().min(1),
        source: z.string().min(1),
        sourceHandle: z.string().min(1),
        target: z.string().min(1),
        targetHandle: z.string().min(1)
      })),
      variables: z.array(z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        value: z.unknown().optional()
      })).optional().default([])
    },
    async ({ nodes, edges, variables }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'set_graph', nodes, edges, variables })
      return {
        content: [{ type: 'text', text: `Graph dispatched: ${nodes.length} nodes, ${edges.length} edges, ${variables.length} variables` }]
      }
    }
  )

  server.tool(
    'validate_graph',
    'Run client-side validation on the current graph. Returns a list of errors and warnings. The editor tab must be open.',
    {},
    async () => {
      try {
        const reply = await sendRequest('validate_graph', 'validation_result')
        const lines = []
        lines.push(`Valid: ${reply.valid}`)
        if (reply.errors?.length) {
          lines.push(`\nErrors (${reply.errors.length}):`)
          for (const e of reply.errors) lines.push(`  [${e.nodeId || 'graph'}] ${e.message}`)
        }
        if (reply.warnings?.length) {
          lines.push(`\nWarnings (${reply.warnings.length}):`)
          for (const w of reply.warnings) lines.push(`  [${w.nodeId || 'graph'}] ${w.message}`)
        }
        if (!reply.errors?.length && !reply.warnings?.length) lines.push('No issues found.')
        return { content: [{ type: 'text', text: lines.join('\n') }] }
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
      }
    }
  )

  server.tool(
    'save_graph',
    'Save the current script to the server. Equivalent to pressing Ctrl+S in the editor. The editor tab must be open.',
    {},
    async () => {
      try {
        const reply = await sendRequest('save_graph', 'save_result', {}, 10000)
        if (reply.success) return { content: [{ type: 'text', text: 'Script saved successfully' }] }
        const reason = reply.error ?? 'unknown reason'
        return { content: [{ type: 'text', text: `Save failed: ${reason}` }], isError: true }
      } catch (err) {
        return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true }
      }
    }
  )

  server.tool(
    'auto_layout',
    'Auto-arrange all nodes into a readable left-to-right flow based on execution order. Nodes not connected to any exec flow are placed in a grid at the bottom.',
    {},
    async () => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'auto_layout' })
      return { content: [{ type: 'text', text: 'Auto-layout dispatched' }] }
    }
  )
}
