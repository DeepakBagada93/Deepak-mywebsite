# Image Generation Roadmap & Tomorrow's Action Plan

**Scheduled Execution Window:** Current Active Batch (Nov 6, 2026 onwards)  
*Note: The Gemini 3.1 Flash Image quota resets every 4.5 hours.*

---

## 🟢 Completed 3D Mockup Products (Live on deepakbagada.in)
1. ✅ **The AI Systems Master Bundle** (`/products/agent-skills-master-bundle`) — [`public/images/products/agent-skills-master-bundle-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/agent-skills-master-bundle-mockup.webp)
2. ✅ **GEO Visibility OS** (`/products/geo-visibility-os`) — [`public/images/products/geo-visibility-os-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/geo-visibility-os-mockup.webp)
3. ✅ **Indian D2C ROAS & Anti-RTO Engine** (`/products/d2c-roas-anti-rto-engine`) — [`public/images/products/d2c-roas-anti-rto-engine-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/d2c-roas-anti-rto-engine-mockup.webp)
4. ✅ **AI Agency Delivery OS** (`/products/agency-delivery-os`) — [`public/images/products/agency-delivery-os-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/agency-delivery-os-mockup.webp)
5. ✅ **MCP Server Launch Kit** (`/products/mcp-server-launch-kit`) — [`public/images/products/mcp-server-launch-kit-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/mcp-server-launch-kit-mockup.webp)
6. ✅ **Agent Context Architect** (`/products/agent-context-architect`) — [`public/images/products/agent-context-architect-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/agent-context-architect-mockup.webp)
7. ✅ **n8n Production Hardening Pack** (`/products/n8n-hardening-pack`) — [`public/images/products/n8n-hardening-pack-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/n8n-hardening-pack-mockup.webp)
8. ✅ **UGC Ad Studio** (`/products/ugc-ad-studio`) — [`public/images/products/ugc-ad-studio-mockup.webp`](file:///Users/deepakbagada/saasnext%20project/my-website/public/images/products/ugc-ad-studio-mockup.webp)

---

## 📋 Queue for Next Batch (Batch 3)

When resuming, the exact copy-paste prompts are in [`docs/IMAGE-PROMPTS-CATALOG.md`](file:///Users/deepakbagada/saasnext%20project/my-website/docs/IMAGE-PROMPTS-CATALOG.md):

1. **Ad Creative Lab** (`ad-creative-lab`)
   * Target: `public/images/products/ad-creative-lab-mockup.webp`
2. **CRO Landing Page Architect** (`cro-landing-page-architect`)
   * Target: `public/images/products/cro-landing-page-architect-mockup.webp`
3. **Bharat Local SEO Kit** (`bharat-local-seo-kit`)
   * Target: `public/images/products/bharat-local-seo-kit-mockup.webp`
4. **AI Inbound Lead Qualification** (`ai-lead-intelligence-engine`)
   * Target: `public/images/products/ai-lead-intelligence-engine-mockup.webp`
5. **AI Customer Support Sentinel** (`ai-support-triage-sentinel`)
   * Target: `public/images/products/ai-support-triage-sentinel-mockup.webp`
6. **AI Content Factory Pipeline** (`ai-content-factory-pipeline`)
   * Target: `public/images/products/ai-content-factory-pipeline-mockup.webp`

---

## 🛠️ Automated Processing Script
When new PNG/JPG images are placed in `public/images/products/`, convert them in one command:
```bash
cwebp -q 88 <source-image.png> -o public/images/products/<slug>-mockup.webp
sips -s format jpeg -s formatOptions 85 <source-image.png> --out public/images/products/<slug>-mockup.jpg
```
The application's `file_exists` safeguard will immediately detect the file and display the 3D showcase on the product page.
