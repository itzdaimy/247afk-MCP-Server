export const node_defenitions = {
  on_bot_join: {
    label: 'On Bot Join',
    category: 'event',
    inputs: {},
    outputs: { exec_out: { type: 'exec' } }
  },
  on_chat_message: {
    label: 'On Chat Message',
    category: 'event',
    inputs: {},
    outputs: {
      exec_out: { type: 'exec' },
      sender: { type: 'string', label: 'Sender' },
      message: { type: 'string', label: 'Message' }
    }
  },
  on_timer: {
    label: 'On Timer',
    category: 'event',
    inputs: {
      interval: { type: 'number', label: 'Seconds', default: 5 }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  on_health_change: {
    label: 'On Health Change',
    category: 'event',
    inputs: {},
    outputs: {
      exec_out: { type: 'exec' },
      health: { type: 'number', label: 'Health' }
    }
  },
  on_death: {
    label: 'On Death',
    category: 'event',
    inputs: {},
    outputs: { exec_out: { type: 'exec' } }
  },

  send_chat: {
    label: 'Send Chat',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      message: { type: 'string', label: 'Message' }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  move: {
    label: 'Move',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      direction: { type: 'string', label: 'Direction', options: ['forward', 'back', 'left', 'right'] },
      duration: { type: 'number', label: 'Duration', default: 1 }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  jump: {
    label: 'Jump',
    category: 'action',
    inputs: { exec_in: { type: 'exec' } },
    outputs: { exec_out: { type: 'exec' } }
  },
  sneak: {
    label: 'Sneak',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      toggle: { type: 'boolean', label: 'Sneak On', default: true }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  look_at: {
    label: 'Look At',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      x: { type: 'number', label: 'X', default: 0 },
      y: { type: 'number', label: 'Y', default: 0 },
      z: { type: 'number', label: 'Z', default: 0 }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  attack: {
    label: 'Attack',
    category: 'action',
    inputs: { exec_in: { type: 'exec' } },
    outputs: { exec_out: { type: 'exec' } }
  },
  use_item: {
    label: 'Use Item',
    category: 'action',
    inputs: { exec_in: { type: 'exec' } },
    outputs: { exec_out: { type: 'exec' } }
  },
  select_slot: {
    label: 'Select Slot',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      slot: { type: 'number', label: 'Slot (0-8)', default: 0 }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  wait: {
    label: 'Wait',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      seconds: { type: 'number', label: 'Seconds', default: 1 }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  log: {
    label: 'Log',
    category: 'action',
    inputs: {
      exec_in: { type: 'exec' },
      message: { type: 'string', label: 'Message' }
    },
    outputs: { exec_out: { type: 'exec' } }
  },

  branch: {
    label: 'Branch',
    category: 'logic',
    inputs: {
      exec_in: { type: 'exec' },
      condition: { type: 'boolean', label: 'Condition' }
    },
    outputs: {
      exec_true: { type: 'exec', label: 'True' },
      exec_false: { type: 'exec', label: 'False' }
    }
  },
  if_variable: {
    label: 'If Variable',
    category: 'logic',
    inputs: {
      exec_in: { type: 'exec' },
      variable: { type: 'string', label: 'Variable', variablePicker: true },
      operator: { type: 'string', label: 'Op', options: ['==', '!=', '>', '<', '>=', '<='] },
      value: { type: 'string', label: 'Value', dynamicType: true }
    },
    outputs: {
      exec_true: { type: 'exec', label: 'True' },
      exec_false: { type: 'exec', label: 'False' }
    }
  },
  loop: {
    label: 'Loop',
    category: 'logic',
    inputs: {
      exec_in: { type: 'exec' },
      count: { type: 'number', label: 'Count', default: 10 }
    },
    outputs: {
      exec_loop: { type: 'exec', label: 'Loop' },
      exec_done: { type: 'exec', label: 'Done' }
    }
  },
  while_loop: {
    label: 'While Loop',
    category: 'logic',
    inputs: {
      exec_in: { type: 'exec' },
      condition: { type: 'boolean', label: 'Condition' }
    },
    outputs: {
      exec_loop: { type: 'exec', label: 'Loop' },
      exec_done: { type: 'exec', label: 'Done' }
    }
  },
  compare: {
    label: 'Compare',
    category: 'logic',
    inputs: {
      a: { type: 'number', label: 'A' },
      b: { type: 'number', label: 'B' },
      operator: { type: 'string', label: 'Op', options: ['==', '!=', '>', '<', '>=', '<='] }
    },
    outputs: {
      result: { type: 'boolean', label: 'Result' }
    }
  },
  and: {
    label: 'And',
    category: 'logic',
    inputs: {
      a: { type: 'boolean', label: 'A' },
      b: { type: 'boolean', label: 'B' }
    },
    outputs: { result: { type: 'boolean', label: 'Result' } }
  },
  or: {
    label: 'Or',
    category: 'logic',
    inputs: {
      a: { type: 'boolean', label: 'A' },
      b: { type: 'boolean', label: 'B' }
    },
    outputs: { result: { type: 'boolean', label: 'Result' } }
  },
  not: {
    label: 'Not',
    category: 'logic',
    inputs: {
      value: { type: 'boolean', label: 'Value' }
    },
    outputs: { result: { type: 'boolean', label: 'Result' } }
  },

  get_variable: {
    label: 'Get Variable',
    category: 'variable',
    inputs: {
      name: { type: 'string', label: 'Name', variablePicker: true }
    },
    outputs: {
      value: { type: 'string', label: 'Value', dynamicType: true }
    }
  },
  set_variable: {
    label: 'Set Variable',
    category: 'variable',
    inputs: {
      exec_in: { type: 'exec' },
      name: { type: 'string', label: 'Name', variablePicker: true },
      value: { type: 'string', label: 'Value' }
    },
    outputs: { exec_out: { type: 'exec' } }
  },
  math: {
    label: 'Math',
    category: 'variable',
    inputs: {
      a: { type: 'number', label: 'A', default: 0 },
      b: { type: 'number', label: 'B', default: 0 },
      operator: { type: 'string', label: 'Op', options: ['+', '-', '*', '/', '%'] }
    },
    outputs: { result: { type: 'number', label: 'Result' } }
  },

  get_health: {
    label: 'Get Health',
    category: 'data',
    inputs: {},
    outputs: { health: { type: 'number', label: 'Health' } }
  },
  get_position: {
    label: 'Get Position',
    category: 'data',
    inputs: {},
    outputs: {
      x: { type: 'number', label: 'X' },
      y: { type: 'number', label: 'Y' },
      z: { type: 'number', label: 'Z' }
    }
  },
  get_nearest_player: {
    label: 'Get Nearest Player',
    category: 'data',
    inputs: {},
    outputs: { name: { type: 'string', label: 'Name' } }
  },
  get_nearest_entity: {
    label: 'Get Nearest Entity',
    category: 'data',
    inputs: {},
    outputs: {
      type: { type: 'string', label: 'Type' },
      distance: { type: 'number', label: 'Distance' }
    }
  }
}
