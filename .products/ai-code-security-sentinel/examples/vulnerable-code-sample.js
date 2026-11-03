/**
 * Vulnerable Code Sample - AI Generated Codebase Anti-Pattern Demonstration
 * Contains typical vulnerabilities introduced by rapid AI agent generation.
 * (Used as a test fixture for the AI Code Security Sentinel scanner).
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

// VULNERABILITY 1: Insecure CORS with Wildcard & Credentials
app.use(cors({ origin: true, credentials: true }));

// VULNERABILITY 2: Hardcoded Secrets & Token Leaks (OpenAI & Database credentials)
const OPENAI_AUTH = "sk-proj-999999999999999999999999999999999999999999999999";
const DB_URL = "postgres://dbadmin:SuperSecretP@ssword123!@db.internal.company.com:5432/production";
const JWT_SECRET = process.env.JWT_SECRET || 'insecure_default_fallback_secret_123';

// VULNERABILITY 3: SQL Injection via String Concatenation
app.get('/api/users', async (req, res) => {
  const userId = req.query.id;
  const sql = "SELECT * FROM users WHERE id = " + userId;
  const results = await db.query(sql);
  res.json(results);
});

// VULNERABILITY 4: OWASP LLM01 - Prompt Injection via Raw User Input Interpolation
app.post('/api/generate-summary', async (req, res) => {
  const userInput = req.body.input;
  
  // Directly interpolating untrusted user input into LLM prompt
  const promptPayload = {
    model: "gpt-4o",
    messages: [
      { role: "system", prompt: `You are a helpful assistant. Summarize: ${userInput}` }
    ]
  };

  // VULNERABILITY 5: Dynamic Code Execution (Eval)
  if (req.body.customParser) {
    const parsed = eval(req.body.customParser);
    return res.json({ parsed });
  }

  // VULNERABILITY 6: Command Injection via Shell Interpolation
  if (req.body.exportFormat) {
    exec(`pandoc report.md -o output.${req.body.exportFormat}`, (err, stdout) => {
      res.send(stdout);
    });
  }
});

// VULNERABILITY 7: Path Traversal
app.get('/api/download', (req, res) => {
  const filename = req.query.file;
  const targetFile = path.join(__dirname, 'uploads', filename);
  res.sendFile(targetFile);
});

module.exports = app;
