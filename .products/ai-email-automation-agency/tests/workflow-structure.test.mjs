import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFile(path.join(root, rel), 'utf8');
const exists = async (rel) => !!(await fs.stat(path.join(root, rel)).catch(() => null));

const checks = [];
const check = (name, fn) => checks.push({ name, fn });

async function loadWorkflow(file) {
  return JSON.parse(await read(`workflows/${file}`));
}

check('all three n8n workflows are valid JSON', async () => {
  for (const file of ['n8n-agency-email-engine.json', 'n8n-approval-and-sequence.json', 'n8n-error-handler.json']) {
    const wf = await loadWorkflow(file);
    assert.ok(Array.isArray(wf.nodes) && wf.nodes.length > 0, `${file} nodes`);
    assert.ok(wf.connections && typeof wf.connections === 'object', `${file} connections`);
  }
});

check('main workflow contains the full draft pipeline', async () => {
  const wf = await loadWorkflow('n8n-agency-email-engine.json');
  const types = wf.nodes.map(n => n.type);
  for (const expected of [
    'n8n-nodes-base.webhook',
    '@n8n/n8n-nodes-langchain.chainLlm',
    '@n8n/n8n-nodes-langchain.lmChatOpenAi',
    'n8n-nodes-base.code',
    'n8n-nodes-base.if',
    'n8n-nodes-base.gmail',
    'n8n-nodes-base.postgres',
    'n8n-nodes-base.slack',
    'n8n-nodes-base.respondToWebhook'
  ]) {
    assert.ok(types.includes(expected), `missing node type ${expected}`);
  }
  const guardrail = wf.nodes.find(n => n.name === 'Parse & Guardrail');
  const code = guardrail.parameters.jsCode;
  assert.ok(code.includes('calendly'), 'guardrail checks calendar links');
  assert.ok(code.includes('guardrail_passed'), 'guardrail emits a pass flag');
});

check('approval workflow includes human decision and two follow-ups', async () => {
  const wf = await loadWorkflow('n8n-approval-and-sequence.json');
  const names = wf.nodes.map(n => n.name);
  for (const expected of ['Approval Webhook', 'Approved?', 'Send Approved Email', 'Wait 4 Days', 'Send Follow-up 1', 'Wait 5 Days', 'Send Follow-up 2', 'Mark Sequence Complete']) {
    assert.ok(names.includes(expected), `missing ${expected}`);
  }
  const waitNodes = wf.nodes.filter(n => n.type === 'n8n-nodes-base.wait');
  assert.equal(waitNodes.length, 2, 'expected two wait nodes');
});

check('error workflow writes a dead letter and alerts Slack', async () => {
  const wf = await loadWorkflow('n8n-error-handler.json');
  const types = wf.nodes.map(n => n.type);
  assert.ok(types.includes('n8n-nodes-base.errorTrigger'));
  assert.ok(types.includes('n8n-nodes-base.slack'));
  assert.ok(types.includes('n8n-nodes-base.postgres'));
});

check('all connection targets resolve to real nodes', async () => {
  for (const file of ['n8n-agency-email-engine.json', 'n8n-approval-and-sequence.json', 'n8n-error-handler.json']) {
    const wf = await loadWorkflow(file);
    const names = new Set(wf.nodes.map(n => n.name));
    for (const [source, outputs] of Object.entries(wf.connections)) {
      assert.ok(names.has(source), `${file}: unknown source ${source}`);
      for (const branches of Object.values(outputs)) {
        for (const branch of branches) {
          for (const link of branch) {
            assert.ok(names.has(link.node), `${file}: unknown target ${link.node}`);
          }
        }
      }
    }
  }
});

check('no hardcoded secrets in workflows or env template', async () => {
  const patterns = [/sk-[a-zA-Z0-9]{20,}/, /xox[baprs]-[a-zA-Z0-9]{10,}/, /ghp_[a-zA-Z0-9]{20,}/];
  for (const file of ['n8n-agency-email-engine.json', 'n8n-approval-and-sequence.json', 'n8n-error-handler.json', 'make-agency-email-engine.json']) {
    const body = await read(`workflows/${file}`);
    for (const pattern of patterns) assert.ok(!pattern.test(body), `${file} contains a secret`);
    assert.ok(!body.includes('/Users/'), `${file} contains a developer path`);
  }
  const env = await read('.env.example');
  assert.ok(env.includes('REPLACE_WITH_'), 'env template uses placeholders');
});

check('schema, docker stack, docs, and tests ship together', async () => {
  for (const file of ['schema.sql', 'docker-compose.yml', '.env.example', 'README.md', 'LICENSE.md', 'docs/tutorial-guide.md', 'docs/system-architecture.md', 'docs/store-listing.md', 'tests/sample-lead.json', 'tests/test-email-curl.sh']) {
    assert.ok(await exists(file), `missing ${file}`);
  }
  const schema = await read('schema.sql');
  assert.ok(schema.includes('agency_email_drafts'));
  assert.ok(schema.includes('agency_email_dead_letters'));
});

check('sample lead is valid and includes a corporate domain', async () => {
  const lead = JSON.parse(await read('tests/sample-lead.json'));
  assert.ok(lead.email.includes('@'));
  assert.ok(!lead.email.endsWith('@gmail.com'));
  assert.ok(lead.pain_point.length > 10);
});

let failures = 0;
for (const { name, fn } of checks) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`  ✗ ${name}\n    ${error.message}`);
  }
}
if (failures) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} checks passed.`);
