type Row = Record<string, unknown>;

let client: { query: (sql: string, params?: unknown[]) => Promise<Row[]> } | null = null;

export function getDb() {
  if (!client) {
    client = {
      async query(_sql: string, _params?: unknown[]) {
        return [];
      },
    };
  }
  return client;
}
