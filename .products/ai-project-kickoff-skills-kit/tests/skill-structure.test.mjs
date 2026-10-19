import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2] || '.');
for (const skill of ['project-discovery', 'implementation-plan']) {
  const body = await readFile(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8');
  assert.match(body, /^---\nname: .+\ndescription: .+\n---/);
  assert.match(body, /## (Workflow|Input)/);
}
const expected = await readFile(path.join(root, 'examples', 'saas-integration-expected-plan.md'), 'utf8');
for (const phrase of ['Explicit exclusions', 'Acceptance criteria', 'Implementation plan']) assert.match(expected, new RegExp(phrase));
console.log('Skill structural and end-to-end example checks passed.');
