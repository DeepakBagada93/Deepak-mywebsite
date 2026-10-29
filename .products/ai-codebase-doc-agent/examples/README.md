# Sample Python API — Example Codebase for Testing

This is a minimal but realistic Python API codebase. Use it to test the AI Codebase Documentation Agent.

## Structure

```
sample-python-api/
├── src/
│   ├── __init__.py
│   ├── main.py              ← FastAPI application entry point
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py          ← User data model
│   │   └── order.py         ← Order data model
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── users.py         ← User CRUD endpoints
│   │   └── orders.py        ← Order management endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py          ← Authentication service
│   │   └── payments.py      ← Payment processing service
│   └── config.py            ← Configuration management
├── tests/
│   ├── test_users.py
│   └── test_orders.py
├── requirements.txt
├── pyproject.toml
└── .env.example
```

## Expected Output

When the agent runs on this codebase, it should produce:
- README.md (project overview, setup, architecture)
- API-reference.md (FastAPI endpoints, Pydantic models, service functions)
- ADR-001-initial-architecture.md (framework choice, project structure)
- onboarding-guide.md (how to set up and contribute)