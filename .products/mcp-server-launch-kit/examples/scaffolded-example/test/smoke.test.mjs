import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'server.mjs');
const child = spawn(process.execPath, [serverPath], { stdio: ['pipe', 'pipe', 'inherit'] });
const responses = new Map();
let buffer = '';

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk) => {
  buffer += chunk;
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, index).trim();
    buffer = buffer.slice(index + 1);
    if (!line) continue;
    const message = JSON.parse(line);
    responses.set(message.id, message);
  }
});

function send(message) {
  child.stdin.write(JSON.stringify(message) + '\n');
}

async function waitFor(id, timeoutMs = 3000) {
  const started = Date.now();
  while (!responses.has(id)) {
    if (Date.now() - started > timeoutMs) throw new Error('Timed out waiting for response ' + id);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  return responses.get(id);
}

send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'smoke', version: '0.0.0' } } });
const init = await waitFor(1);
assert.equal(init.result.protocolVersion, '2024-11-05');
assert.equal(init.result.serverInfo.name, "repo-search-server");
send({ jsonrpc: '2.0', method: 'notifications/initialized' });

send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
const list = await waitFor(2);
assert.equal(list.result.tools.length, 2);
assert.deepEqual(list.result.tools.map((tool) => tool.name).sort(), ["get_file_summary","search_files"]);

const first = {"name":"search_files","description":"Search tracked text files for a literal query and return matching paths with line numbers.","inputSchema":{"type":"object","properties":{"query":{"type":"string","description":"Literal text to search for."},"limit":{"type":"number","description":"Maximum number of matches to return."}},"required":["query"],"additionalProperties":false}};
const required = first.inputSchema.required || [];
if (required.length) {
  send({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: first.name, arguments: {} } });
  const invalid = await waitFor(3);
  assert.equal(invalid.result.isError, true);
}

const sample = {};
for (const key of required) {
  const type = first.inputSchema.properties[key]?.type;
  sample[key] = type === 'number' ? 1 : type === 'boolean' ? true : type === 'array' ? [] : 'sample';
}
send({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: first.name, arguments: sample } });
const call = await waitFor(4);
assert.equal(call.result.isError, undefined);
assert.equal(JSON.parse(call.result.content[0].text).tool, first.name);

child.kill();
console.log('MCP smoke test passed: initialize, tools/list, tools/call, validation.');
