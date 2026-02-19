import { z } from 'zod'
import { send, getGraph, requireBridge } from '../bridge.js'

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
}
