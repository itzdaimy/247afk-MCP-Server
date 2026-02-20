import { WebSocketServer } from 'ws'

const ws_port = 3002
const clients = new Set()
const pending = new Map()

const wss = new WebSocketServer({ host: '127.0.0.1', port: ws_port })

wss.on('connection', (ws) => {
  clients.add(ws)

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (pending.has(msg.type)) {
        pending.get(msg.type).resolve(msg)
        pending.delete(msg.type)
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

export function sendRequest(cmd, responseType, params = {}, timeoutMs = 5000) {
  if (!isConnected()) {
    return Promise.reject(new Error('No editor tab connected. Open the script editor first.'))
  }
  if (pending.has(responseType)) {
    pending.get(responseType).reject(new Error('Superseded by a newer request'))
  }
  return new Promise((resolve, reject) => {
    const entry = { resolve, reject }
    pending.set(responseType, entry)
    send(Object.assign({}, params, { cmd }))
    setTimeout(() => {
      if (pending.get(responseType) === entry) {
        pending.delete(responseType)
        reject(new Error('Timed out waiting for editor response'))
      }
    }, timeoutMs)
  })
}

export function getGraph(timeoutMs = 5000) {
  return sendRequest('get_graph', 'graph_state', {}, timeoutMs)
}

export function requireBridge() {
  if (!isConnected()) return 'Error: No editor tab connected. Open the script editor first.'
  return null
}

console.error(`[bridge] WebSocket listening on ws://127.0.0.1:${ws_port}`)
