import { WebSocketServer } from 'ws'

const ws_port = 3002
const clients = new Set()
let pendingGraph = null

const wss = new WebSocketServer({ host: '127.0.0.1', port: ws_port })

wss.on('connection', (ws) => {
  clients.add(ws)

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'graph_state' && pendingGraph) {
        pendingGraph.resolve(msg)
        pendingGraph = null
      }
    } catch {}
  })

  ws.on('close', () => clients.delete(ws))
  ws.on('error', () => clients.delete(ws))
})

export function isConnected() {
  return [...clients].some(c => c.readyState === 1)
}

export function send(cmd) {
  const msg = JSON.stringify(cmd)
  for (const c of clients) {
    if (c.readyState === 1) c.send(msg)
  }
}

export function getGraph(timeoutMs = 5000) {
  if (!isConnected()) {
    return Promise.reject(new Error('No editor tab connected. Open the script editor first.'))
  }
  if (pendingGraph) {
    pendingGraph.reject(new Error('Superseded by a newer getGraph call'))
    pendingGraph = null
  }
  return new Promise((resolve, reject) => {
    pendingGraph = { resolve, reject }
    send({ cmd: 'get_graph' })
    setTimeout(() => {
      if (pendingGraph) {
        pendingGraph = null
        reject(new Error('Timed out waiting for editor response'))
      }
    }, timeoutMs)
  })
}

export function requireBridge() {
  if (!isConnected()) return 'Error: No editor tab connected. Open the script editor first.'
  return null
}

console.error(`[bridge] WebSocket listening on ws://127.0.0.1:${ws_port}`)
