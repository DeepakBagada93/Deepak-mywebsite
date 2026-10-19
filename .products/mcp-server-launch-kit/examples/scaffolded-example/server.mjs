#!/usr/bin/env node
import { TOOLS } from './tools.mjs';

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = { name: "repo-search-server", version: "0.1.0" };

function send(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

function validate(schema, args) {
  const errors = [];
  if (!schema || schema.type !== 'object') return errors;
  for (const key of schema.required || []) {
    if (args[key] === undefined) errors.push('missing required argument: ' + key);
  }
  for (const [key, definition] of Object.entries(schema.properties || {})) {
    const value = args[key];
    if (value === undefined) continue;
    const type = definition.type;
    if (type === 'string' && typeof value !== 'string') errors.push(key + ' must be a string');
    if (type === 'number' && typeof value !== 'number') errors.push(key + ' must be a number');
    if (type === 'boolean' && typeof value !== 'boolean') errors.push(key + ' must be a boolean');
    if (type === 'array' && !Array.isArray(value)) errors.push(key + ' must be an array');
    if (type === 'object' && (typeof value !== 'object' || Array.isArray(value))) errors.push(key + ' must be an object');
  }
  return errors;
}

async function handle(request) {
  const { id, method, params } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
      },
    };
  }

  if (method === 'notifications/initialized') return null;
  if (method === 'ping') return { jsonrpc: '2.0', id, result: {} };

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
      },
    };
  }

  if (method === 'tools/call') {
    const name = params?.name;
    const tool = TOOLS.find((candidate) => candidate.name === name);
    if (!tool) return { jsonrpc: '2.0', id, error: { code: -32602, message: 'Unknown tool: ' + String(name) } };

    const args = params?.arguments || {};
    const problems = validate(tool.inputSchema, args);
    if (problems.length) {
      return {
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: JSON.stringify({ error: 'invalid_arguments', details: problems }) }], isError: true },
      };
    }

    try {
      const output = await tool.handler(args);
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(output) }] } };
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id,
        result: { content: [{ type: 'text', text: JSON.stringify({ error: error.message }) }], isError: true },
      };
    }
  }

  return { jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found: ' + String(method) } };
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    let request;
    try {
      request = JSON.parse(line);
    } catch {
      continue;
    }
    const response = await handle(request);
    if (response) send(response);
  }
});
