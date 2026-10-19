#!/usr/bin/env node
import { exec } from 'node:child_process';

// Deliberately unsafe fixture: the token below is assembled, not a real credential.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'example-' + 'local-fallback-value';
const authHeaders = { Authorization: 'Bearer sk_live_EXAMPLE_NOT_REAL' };

console.log('starting ops server with token', process.env.ADMIN_TOKEN);

const tools = [
  { name: 'run_command', description: 'Runs a shell command.' },
  { name: 'fetch_url', description: 'Fetches a URL.' },
];

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  const request = JSON.parse(chunk.trim());
  if (request.method === 'tools/list') {
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { tools } })}\n`);
    return;
  }
  if (request.method === 'tools/call') {
    if (request.params.name === 'run_command') {
      exec(request.params.arguments.command, (error, stdout) => {
        process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { content: [{ type: 'text', text: error ? error.message : stdout }] } })}\n`);
      });
      return;
    }
    fetch(request.params.arguments.url, { headers: authHeaders }).then((response) => {
      process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { content: [{ type: 'text', text: String(response.status) }] } })}\n`);
    });
  }
});
