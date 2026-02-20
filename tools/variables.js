import { z } from 'zod'
import { send, requireBridge } from '../bridge.js'

export function registerVariableTools(server) {
  server.tool(
    'add_variable',
    'Add a new variable or replace an existing one by name. Does not affect other variables.',
    {
      name: z.string().min(1).describe('Variable name'),
      type: z.enum(['string', 'number', 'boolean']).describe('Variable type'),
      value: z.union([z.string(), z.number(), z.boolean()]).optional().describe('Initial value')
    },
    async ({ name, type, value }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'add_variable', name, varType: type, value })
      return { content: [{ type: 'text', text: `Variable "${name}" (${type}) dispatched` }] }
    }
  )

  server.tool(
    'remove_variable',
    'Remove a variable by name. Does not affect other variables.',
    {
      name: z.string().min(1).describe('Name of the variable to remove')
    },
    async ({ name }) => {
      const err = requireBridge()
      if (err) return { content: [{ type: 'text', text: err }], isError: true }
      send({ cmd: 'remove_variable', name })
      return { content: [{ type: 'text', text: `Variable "${name}" removal dispatched` }] }
    }
  )
}
