import { z } from 'zod'
import { send, requireBridge } from '../bridge.js'

export function registerNodeTools(server) {
  server.tool(
    'add_node',
    'Add a single node to the script editor canvas.',
    {
      type: z.string().min(1).describe('Node type from the node catalogue (e.g. send_chat, on_timer, branch)'),
      position: z.object({ x: z.number(), y: z.number() }).optional().describe('Canvas position. Optional — auto-placed if omitted.'),
      data: z.record(z.unknown()).optional().default({}).describe('Input values keyed by port name. Do not include exec ports.')
    },
    async ({ type, position, data }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'add_node', type, position, data })
      return { content: [{ type: 'text', text: `Node of type "${type}" dispatched` }] }
    }
  )

  server.tool(
    'remove_node',
    'Remove a node and all its connected edges from the editor.',
    { nodeId: z.string().min(1).describe('The id of the node to remove') },
    async ({ nodeId }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'remove_node', nodeId })
      return { content: [{ type: 'text', text: `Node ${nodeId} removal dispatched` }] }
    }
  )

  server.tool(
    'add_edge',
    'Connect two node ports with an edge. Use get_graph first to know existing node ids.',
    {
      sourceNodeId: z.string().min(1).describe('The id of the source node (from get_graph)'),
      sourceHandle: z.string().min(1).describe('Output port name on the source node (e.g. exec_out, result, health)'),
      targetNodeId: z.string().min(1).describe('The id of the target node (from get_graph)'),
      targetHandle: z.string().min(1).describe('Input port name on the target node (e.g. exec_in, condition, message)')
    },
    async ({ sourceNodeId, sourceHandle, targetNodeId, targetHandle }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'add_edge', sourceNodeId, sourceHandle, targetNodeId, targetHandle })
      return { content: [{ type: 'text', text: `Edge ${sourceNodeId}.${sourceHandle} → ${targetNodeId}.${targetHandle} dispatched` }] }
    }
  )

  server.tool(
    'remove_edge',
    'Remove a specific edge by id.',
    { edgeId: z.string().min(1) },
    async ({ edgeId }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'remove_edge', edgeId })
      return { content: [{ type: 'text', text: `Edge ${edgeId} removal dispatched` }] }
    }
  )

  server.tool(
    'set_variables',
    'Replace the script variables list. Existing variables are overwritten.',
    {
      variables: z.array(z.object({
        name: z.string().min(1),
        type: z.enum(['string', 'number', 'boolean']),
        value: z.union([z.string(), z.number(), z.boolean()]).optional()
      }))
    },
    async ({ variables }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'set_variables', variables })
      return { content: [{ type: 'text', text: `${variables.length} variables dispatched` }] }
    }
  )
}
