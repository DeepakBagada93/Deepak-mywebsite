// Node loads a directory argument through its index file. Import both suites so
// `node --test tests/` works on current Node releases as well as file globs.
(async () => {
  await import('./gst-invoice-compliance-kit.test.mjs');
  await import('./skill-structure.test.mjs');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
