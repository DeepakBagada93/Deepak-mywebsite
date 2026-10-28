# 3-Minute Technical Video (Loom) Audit Script
## Target: SaaSMetrics Inc — Next.js 15 Migration & Performance

### Setup:
- **Tab 1:** SaaSMetrics public marketing & dashboard preview page.
- **Tab 2:** Chrome DevTools Network Tab / Web Vitals showing LCP & bundle sizes.
- **Tab 3:** VS Code showing working Next.js App Router singleton & caching pattern.

---

### Script Breakdown:

#### 0:00 – 0:45: The Neutral Observation (No Blame, Just Data)
*"Hey Marcus, Alex here from Apex Studio. I noticed your team has an open posting for a senior Next.js lead to help drive the platform forward.*

*I was inspecting the public dashboard load times just now, and noticed that on initial hydration, the bundle size is triggering an initial 3.2-second Largest Contentful Paint (LCP) because of un-chunked chart libraries."*

#### 0:45 – 1:45: The Technical Blueprint & Fix
*"Here's how we tackled this exact problem last month with another analytics client. Instead of bundling the entire charting engine into the client bundle, we isolated it using dynamic imports with SSR disabled on client-only widgets, paired with React 19 server components for the summary metrics.*

*This dropped initial bundle transfer from 1.4MB down to 180KB, reducing total load time from 3.2s to 420ms."*

#### 1:45 – 2:30: The Low-Friction Soft Close
*"I know you're busy running the team, so zero pressure to reply. If you want me to send over the exact repo snippet or walk your lead engineer through how we structured the cache tags, feel free to let me know.*

*Either way, hope this saves your team a few days of profiling!"*
