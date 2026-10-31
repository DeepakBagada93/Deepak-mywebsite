# Security and privacy

GEO Visibility OS is a local, zero-dependency command-line product. It does not ship a server, a telemetry client, an analytics SDK or an update checker.

## Data handling

- Local scans read only the files you point them at and write only to the output path you choose.
- URL scans fetch public HTML, `robots.txt`, `sitemap.xml` and `llms.txt`. They do not log in, submit forms, execute page JavaScript or download binaries.
- Snapshots and packs can contain public page copy. Treat them as client-confidential material. Do not commit them to a public repository or upload them to a third-party service without the client's permission.
- The tool does not collect, transmit or sell usage data.
- The tool does not store credentials. Do not put API keys, passwords or private customer data in a brief, snapshot or pack.

## URL-scan safety

URL scanning is intentionally constrained:

| Control | Default |
| --- | --- |
| Protocols | `http://` and `https://` only |
| Credentials in URL | Rejected |
| Localhost / loopback | Rejected |
| Private IPv4 ranges | Rejected (`10/8`, `172.16/12`, `192.168/16`, `127/8`, `169.254/16`, `100.64/10`, `198.18/15`, multicast/reserved) |
| Private IPv6 ranges | Rejected (`::1`, `fc00::/7`, `fe80::/10`, multicast, IPv4-mapped private) |
| DNS resolution | Public addresses only; a hostname resolving to a private address is rejected |
| Redirects | Maximum 5; HTTPS-to-HTTP downgrade rejected |
| Response size | 5 MB hard cap |
| Request timeout | 15 seconds |
| Content types | Text, HTML, XHTML, XML, JSON only |
| User agent | `GEO-Visibility-OS/1.1 (+audit; contact site owner)` |

`--allow-private` exists for trusted local staging only. It bypasses the localhost/private-address checks. Never use it on a shared or untrusted network, and never expose the CLI as a public URL-fetching service.

### Residual risk

This is a local audit tool, not a hardened multi-tenant fetcher. DNS rebinding and host-level network attacks are outside its threat model. If you need a hosted scanning service, put the fetcher behind an egress proxy with an allowlist, run it in an isolated network namespace, and add request authentication and rate limiting.

## Supply chain

- No npm runtime dependencies; only the Node.js standard library.
- The distribution ZIP is built from the product root and excludes `dist/`, `.git`, `.agent`, `node_modules`, environment files and OS metadata.
- `product-manifest.json` records the byte length and SHA-256 for every shipped file. Verify the manifest before installing an archive from an untrusted channel.

## Responsible disclosure

Report a security issue to `support@deepakbagada.in` with the affected version, a minimal reproduction and the impact. Do not include client data or secrets. Do not open a public issue before the report is acknowledged.

## Scope of this document

This document describes the shipped tool's controls. It is not a legal opinion, a penetration-test report or a guarantee that a third-party site is safe to scan. Get written permission before auditing a client's site.
