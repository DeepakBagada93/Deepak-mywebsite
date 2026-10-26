#!/usr/bin/env node
// Build a deduped, MX-checked Indian lead batch for the free-kit + n8n campaign.
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const MEMORY = path.join(HERE, '..', 'memory.md');
const SUBSCRIBERS = '/tmp/subscribers.json';
const OUT = path.join(HERE, '..', 'leads-100-india.json');

const c = (company, email, city, niche, source, name = null, title = null) => ({
  company, email, city, niche, source, name, title,
});

const candidates = [
  // Bengaluru
  c('atm8n', 'hello@atm8n.com', 'Bengaluru', 'AI agent & automation studio', 'https://www.atm8n.com/'),
  c('ScaleWorks AI', 'atishay@usescaleworks.com', 'Bengaluru', 'n8n workflow engineering & AI systems', 'https://www.usescaleworks.com/', 'Atishay Jain', 'Co-Founder'),
  c('ScaleWorks AI', 'arunabha@usescaleworks.com', 'Bengaluru', 'n8n workflow engineering & AI systems', 'https://www.usescaleworks.com/', 'Arunabha Mukherjee', 'Co-Founder'),
  c('Snapserve AI', 'gopi@snapserveai.in', 'Bengaluru', 'AI automation & chatbots', 'https://snapserveai.in/services', 'Gopi', 'Head of Team'),
  c('Ampex Web', 'info@ampexweb.com', 'Bengaluru', 'n8n / Zapier automation studio', 'https://ampexweb.com/services/ai-automation/bengaluru'),
  c('Free Mind Consultancy', 'info@freemindconsult.com', 'India', 'n8n workflow automation', 'https://www.freemindconsult.com/services/n8n-automation'),
  c('Grow Labs AI', 'contact@growlabsai.com', 'Bengaluru', 'n8n workflows & AI agents', 'https://www.growlabsai.com/'),
  c('Scale Us', 'contact@scaleus.in', 'India', 'n8n automation & custom software', 'https://scaleus.in/services/custom-software/n8n-automation'),
  c('Infygru', 'info@infygru.com', 'Chennai', 'self-hosted n8n automation', 'https://infygru.com/services/n8n-automation'),
  c('Marvice / Worxforu', 'yuvarajgs@marvice.in', 'Bengaluru', 'n8n & WhatsApp business automation', 'https://marvice.in/our-services/worxforu/business-process-automation/', 'Yuvaraj', 'Automation Lead'),
  c('Abhishek Patoliya', 'patoliya.abhishek@gmail.com', 'Surat', 'senior n8n developer & automation architect', 'https://www.abhishekpatoliya.com/', 'Abhishek Patoliya', 'Senior n8n Developer'),
  c('Amar Angadi', 'amarangadi.freelancer@gmail.com', 'Bengaluru', 'freelance n8n / Make automation specialist', 'https://linkedin.com/in/amarangadi55', 'Amar Angadi', 'Workflow Automation Specialist'),

  // Indie founders / developers
  c('Bytonomics / Smritea', 'tushar@smritea.ai', 'Bengaluru', 'AI-agent infrastructure founder', 'https://tushardwivedi.com/index.html', 'Tushar Dwivedi', 'Founder'),
  c('Ssimplifi', 'ravi@ssimplifi.com', 'Bengaluru', 'developer tools / AI API proxy', 'https://ssimplifi.com/about', 'Ravi Patel', 'Founder'),
  c('spoo.me', 'aditya@singhi.me', 'Bengaluru', 'backend & infra engineer / founder', 'https://aditya.singhi.me/', 'Aditya Singhi', 'Founder & Engineer'),
  c('Confluo', 'shashank@confluo.in', 'India', 'AI context management / dev tools', 'https://shekharshashank.web.app/', 'Shashank Shekhar', 'Founder'),
  c('NoEffortsAI', 'rohit@noeffortsai.ai', 'India', 'agentic AI dev platform', 'https://noeffortsai.ai/press', 'Rohit Vishal', 'Founder & CEO'),
  c('Toolghar', 'therahulkumar.dev@gmail.com', 'India', 'indie hacker / dev tools', 'https://therahulkumar.in/', 'Rahul Kumar', 'Founder'),
  c('GoToolsOnline', 'contact@gotoolsonline.com', 'Tamil Nadu', 'solo developer / utilities', 'https://gotoolsonline.com/about', 'Ben Praveen J', 'Developer'),
  c('NURPAM Tech', 'hello@nurpam.in', 'Chennai', 'developer tools / AI dev control plane', 'https://linkedin.com/in/p-ramalakshmi-52069b231', 'P Ramalakshmi', 'Founder'),
  // Mumbai / Pune
  c('Orbixel Labs', 'hello@orbixellabs.in', 'Mumbai', 'WhatsApp AI, voice agents & CRM automation', 'https://orbixellabs.in/ai-automation-agency-mumbai/'),
  c('Webhorse Studio', 'hi@webhorse.studio', 'Mumbai', 'custom AI automation with n8n', 'https://www.webhorse.studio/ai-services/custom-ai-automation-services'),
  c('Maventec AI', 'hello@maventechai.com', 'Mumbai', 'AI automation consulting', 'https://maventecai.com/'),
  c('Robodeus Labs', 'hello@robodeuslabs.com', 'Mumbai', 'agentic AI & systems lab', 'https://robodeuslabs.com/'),
  c('Ziora Global', 'hello@zioraglobal.com', 'Mumbai', 'business automation & digital transformation', 'https://zioraglobal.com/', 'Vivek Verma', 'Founder & CEO'),
  c('Metaminds Studio', 'business@metaminds.studio', 'Thane', 'AI automation & internal tools', 'https://www.metaminds.studio/ai-mumbai'),
  c('Third Eye Solutions', 'info@thirdeyesolutions.co', 'Mumbai', 'WhatsApp & n8n automation for SMBs', 'https://thirdeyesolutions.co/'),
  c('White Infotech', 'info@whiteinfotech.com', 'Mumbai', 'AI agents & n8n workflow development', 'https://www.whiteinfotech.com/mumbai/ai-agent-n8n-workflow-company/'),
  c('Associative', 'info@associative.in', 'Pune', 'custom n8n development', 'https://associative.in/custom-n8n-development-workflow-automation/'),
  c('Sucetas Technologies', 'contact@sucetastech.com', 'Pune', 'AI automation & agentic systems', 'https://sucetastech.com/services/ai-automation'),
  c('PyrusMedia', 'info@pyrusmedia.in', 'Pune', 'AI workflow automation & chatbots', 'https://pyrusmedia.in/services/ai-automation'),
  c('Techronyx', 'admin@techronyx.com', 'Pune', 'AI automation & document intelligence', 'https://techronyx.com/services/ai-automation/'),
  c('Kairoo Technologies', 'info@kairootechnologies.com', 'Pune', 'AI automation for owners', 'https://kairootechnologies.com/', 'Sagar', 'Founder'),
  c('Trivikra Tech', 'info.sales@trivikratech.com', 'Pune', 'agentic AI & workflow automation', 'https://trivikratech.com/ai-automation.html'),
  c('Automaton AI', 'info@automatonai.com', 'Pune', 'enterprise AI & document automation', 'https://automatonai.com/'),
  c('Codemites', 'hi@codemites.com', 'India', 'AI automation & software', 'https://codemites.com/'),
  c('Spyraabizz', 'shilp@spyraabizz.com', 'Pune', 'n8n automation services', 'https://spyraabizz.com/ai-automation-services-in-pune/', 'Shilpa Dudhanikar', 'Founder'),
  c('Curve Metrics', 'contact@curvemetrics.in', 'Nagpur', 'AI agents & WhatsApp automation', 'https://curvemetrics.in/ai-automation-company-in-nagpur/'),
  c('Triggr AI Automations', 'contact@triggrai.com', 'Nagpur', 'AI automation', 'https://triggrai.com/contact-2/'),

  // Delhi NCR / North
  c('Techglock', 'sales@techglock.com', 'Mohali', 'n8n workflow automation', 'https://techglock.com/india/n8n-workflow-automation'),
  c('Vanijya Technology', 'info@vanijyatech.in', 'Greater Noida', 'n8n development & workflow automation', 'https://vanijyatech.in/n8n-developer/'),
  c('Hidden Mind Solutions', 'info@hiddenmindsolutions.in', 'Udaipur', 'n8n automation agency', 'https://hiddenmindsolutions.in/services/n8n-automation'),
  c('Fruition', 'contact@fruitionservices.io', 'New Delhi', 'certified n8n integration partner', 'https://www.fruitionservices.io/partnerships/n8n-integration-partner'),
  c('One Eighty Aamoksh', 'diwesh.saxena@aamokshoneeighty.com', 'Gurgaon', 'n8n / Make workflow automation', 'https://www.oneeightyaamoksh.com/services/workflow-automation', 'Diwesh Saxena', 'Automation Lead'),
  c('Udaan Technologies', 'info@udaantechnologies.com', 'Ghaziabad', 'AI agents & n8n automation', 'https://www.udaantechnologies.com/ai-agents-automation'),
  c('AInSEO', 'info@ainseo.com', 'Noida', 'AI workflow automation', 'https://ainseo.com/services/ai-automation-agency-in-noida', 'Goutam Singh', 'Founder'),
  c('SS Infoserve', 'info@ssinfoserve.com', 'Delhi', 'AI & marketing automation', 'https://www.ssinfoserve.com/ai-automation'),
  c('Digiogram', 'contact@digiogram.com', 'Sonipat', 'WhatsApp & n8n automation', 'https://www.digiogram.com/about'),
  c('MNB Research', 'contact@mnbresearch.com', 'Faridabad', 'AI automation for SMEs', 'https://www.mnbresearch.com/ai-automation-delhi-ncr'),
  c('Harsh Ranjan', 'mr.harshranjan@gmail.com', 'Delhi NCR', 'n8n workflow automation freelancer', 'https://harshranjan.in/ai-automation', 'Harsh Ranjan', 'Founder'),
  c('Eastonix', 'adyan@eastonix.com', 'India', 'AI automation systems', 'https://eastonix.com/', 'Adyan', 'Founder'),
  c('Hitender.biz', 'hi@hitender.biz', 'New Delhi', 'AI automation & WhatsApp CRM', 'https://hitender.biz/', 'Hitender Tanwar', 'Founder'),
  c('Scult', 'connect@scult.in', 'Noida', 'AI agents & n8n pipelines', 'https://scult.in/services/ai-agents-automation'),
  c('Innovatrix Infotech', 'contact@innovatrixinfotech.com', 'Kolkata', 'production n8n automation', 'https://www.innovatrixinfotech.com/hire/n8n-automation-expert', 'Rishabh Sethia', 'Founder'),
  c('NexOper', 'hello@nexoper.in', 'Mohali', 'n8n automation agency', 'https://www.nexoper.in/automation/n8n-automation'),
  c('Imperial Digitech', 'info@imperialdigitech.com', 'Chandigarh', 'AI & business automation', 'https://imperialdigitech.com/'),
  c('Bright Infonet', 'support@brightinfonet.com', 'Panchkula', 'AI agents & workflow automation', 'https://www.brightinfonet.com/ai-development-company-chandigarh'),
  c('Founderscodes', 'info@foundercodes.com', 'Lucknow', 'AI agent development', 'https://foundercodes.com/best-ai-agent-devlopment-company-lucknow'),
  c('CodeNova Technologies', 'technologiescodenova@gmail.com', 'Lucknow', 'AI automation & chatbots', 'https://technologycodenova.com/best-ai-services-company-in-lucknow/'),
  c('The Arise AI', 'hello@theariseai.com', 'Lucknow', 'AI automation agency', 'https://theariseai.com/about', 'Aryan Srivastav', 'Founder & Operations'),
  c('Sudarshan AI Labs', 'sudarshanailabs@gmail.com', 'Lucknow', 'AI automation & governance', 'https://sudarshan-ai.com/ai-automation-lucknow'),
  c('Askus Studio', 'askusstudio@gmail.com', 'Lucknow', 'AI chatbots & WhatsApp automation', 'https://www.askusstudio.in/ai-automation-agency-lucknow'),
  c('Shree Meeracorp', 'meeracorp@gmail.com', 'Lucknow', 'AI agent development', 'https://shreemeeracorp.com/ai-agent-development-services-in-lucknow', 'Pawan Kumar Singh', 'AI/ML Expert'),
  c('NodeWise', 'nodewise.in@gmail.com', 'India', 'n8n & AI workflow automation', 'https://www.aiautomationdb.com/ai-automation-agencies/nodewise'),
  c('Shiv Shakti Digiworld', 'support@shivshaktidigiworld.in', 'Kota', 'n8n & WhatsApp automation', 'https://bdial.in/2025/08/13/n8n-expert-in-kota/', 'Deepak Kumar Lashkari', 'Founder'),
  c('Grrbaow', 'bhuvan@grrbaow.com', 'India', 'AI automation agency', 'https://community.n8n.io/t/were-hiring-need-a-killer-n8n-expert-to-join-our-team/222027', 'Bhuvan Shakthi', 'Founder'),

  // Gujarat
  c('ProdovaAI', 'contact@prodovaai.com', 'Ahmedabad', 'AI agents & n8n automation', 'https://www.prodovaai.com/service/ai-agents-automation'),
  c('InfyOm Technologies', 'contact@infyom.in', 'Surat', 'n8n developers & AI automation', 'https://infyom.com/services/hire-n8n-automation-developers'),
  c('MultiDivs', 'contact@multidivs.com', 'Ahmedabad', 'AI automation & chatbots', 'https://www.multidivs.com/ai-automation-agency-india/'),
  c('Triveni Global Soft', 'info@triveniglobalsoft.com', 'Surat', 'AI automation & custom software', 'https://triveniglobalsoft.com/contact-us/'),
  c('Lets Automation', 'hello@letsautomation.com', 'Surat', 'AI agents & workflow automation', 'https://letsautomation.com/about', 'Vraj Bhander', 'Founder'),
  c('Agility Tech', 'hello@agilitytech.ai', 'Ahmedabad', 'AI consulting & automation', 'https://agilitytech.ai/contact'),
  c('VectovateAI', 'hello@vectovateai.com', 'Ahmedabad', 'multi-agent orchestration & RAG', 'https://vectovateai.com/contact', 'Yaman Kavishwar', 'Founder & CEO'),
  c('Rutilant Technology', 'info@rutilanttechnology.com', 'Surat', 'AI automation & software', 'https://rutilanttechnology.com/'),
  c('SoftUs Infotech', 'contact@softusinfotech.com', 'Surat', 'AI-powered software', 'https://softusinfotech.com/software-company-surat'),
  c('BytezTech', 'info@byteztech.in', 'Surat', 'autonomous AI agents', 'https://byteztech.com/custom-autonomous-ai-agents/'),
  c('NMR Infotech', 'nirmal@nmrinfotech.com', 'Vadodara', 'n8n consulting & AI training', 'https://nirmalrabari.in/expertise/n8n-consultant', 'Nirmal Rabari', 'n8n Consultant'),
  c('Empiric Infotech', 'contact@empiricinfotech.com', 'Surat', 'dedicated n8n developers', 'https://empiricinfotech.com/services/n8n-workflow-automation'),
  c('Prakash Infotech', 'info@prakashinfotech.com', 'Vadodara', 'n8n automation services', 'https://prakashinfotech.com/n8n-automation-services-workflow-development'),

  // Central India
  c('Saturn Edge', 'hello@saturnedge.in', 'Indore', 'AI automation & AI SaaS', 'https://saturnedge.in/service/ai-automation.html'),
  c('Neeravna AI', 'neeraj@neeravnaai.in', 'Indore', 'n8n workflow engineering', 'https://neeravnaai.in/', 'Neeraj', 'Founder'),
  c('BizByTech', 'support@bizbytech.in', 'Indore', 'AI agents & workflow automation', 'https://bizbytech.in/'),
  c('AIBOOTSTRAPPER', 'founder@aibootstrapper.com', 'Indore', 'n8n & Make automation', 'https://aibootstrapper.com/ai-automation-agency-in-indore'),
  c('AdVortex AI', 'support@advortex.in', 'Indore', 'AI automation & growth systems', 'https://www.advortex.in/'),
  c('Namastetu Technologies', 'info@namastetu.com', 'Indore', 'AI-enabled automation', 'https://namastetu.com/ai-enabled-automation/'),
  c('Curos AI', 'ashmeet3008@gmail.com', 'Indore', 'AI automation agency', 'https://curosai.com/', 'Ashmeet Singh Chhabra', 'Founder'),
  c('HowAutomate', 'hello@howautomate.com', 'Jaipur', 'AI automation agency', 'https://howautomate.com/ai-automation-agency-jaipur'),
  c('AASA', 'info@aiautomationservicesagency.com', 'Jaipur', 'AI automation services', 'https://aiautomationservicesagency.com/contact-us/'),
  c('IterativeTech Research', 'info@iterativetech.com', 'Jaipur', 'AI automation & custom integrations', 'https://iterativetech.com/'),
  c('PropelKit', 'support@propelkit.dev', 'Jaipur', 'developer tools / SaaS boilerplate', 'https://www.intelpilot.ai/company/propelkit/69b8b5eec9a22c3a2730ffa2', 'Tanishq Agarwal', 'Founder'),

  // Hyderabad
  c('ElevAIte Labs', 'contact@elevaitelabs.in', 'Hyderabad', 'AI automation agency', 'https://elevaitelabs.in/contact'),
  c('AvlokAI', 'hello@avlokai.com', 'Hyderabad', 'n8n & WhatsApp automation', 'https://www.avlokai.com/ai-automation-agency-hyderabad'),
  c('EnabledBrains', 'contact@enabledbrains.com', 'Hyderabad', 'AI agents & automations', 'https://enabledbrains.com/'),
  c('ThreeAtoms', 'contact@threeatoms.com', 'Hyderabad', 'AI agents & web engineering', 'https://www.threeatoms.com/'),
  c('Erudite AI', 'info@erudite.ai.in', 'Hyderabad', 'AI agents & sales automation', 'https://www.erudite.ai.in/'),
  c('Thought Pinnacle', 'hello@thoughtpinnacle.com', 'Hyderabad', 'custom AI solutions', 'https://thoughtpinnacle.com/'),
  c('Khanect AI', 'connect@khanect.com', 'Hyderabad', 'AI automation', 'https://khanect.com/contact'),
  c('BuildNexTech', 'info@bnxt.ai', 'Hyderabad', 'AI automation & cloud', 'https://www.bnxt.ai/contact-us'),
  c('Skanda AI Solutions', 'karthik@skandaai.in', 'Hyderabad', 'AI agents & automation', 'https://www.skandaai.in/contact.html', 'Karthik Raj Gupta', 'Founder'),
  c('ForeFold Consulting', 'contact@forefoldai.com', 'Hyderabad', 'AI products & automation', 'https://forefoldai.com/'),

  // East / South
  c('DXDasia', 'team@dxdasia.com', 'Kolkata', 'AI automation agency', 'https://dxdasia.com/ai-automation-agency-india/'),
  c('Codostuff', 'info@codostuff.com', 'Kolkata', 'AI automation & agentic AI', 'https://www.codostuff.com/service/AI-Automation-Services'),
  c('MindMesh AI', 'info@mindmeshai.io', 'Kolkata', 'AI automation & integration', 'https://mindmeshai.io/'),
  c('Premier AI', 'contact@premier-ai.co', 'Kolkata', 'AI voice agents', 'https://www.premier-ai.co/'),
  c('Aroha Edge', 'support@arohaedge.co', 'Kolkata', 'AI automation & web development', 'https://arohaedge.co/'),
  c('AIRIZZ', 'connect@airizz.co', 'Kochi', 'AI automation & digital transformation', 'https://airizz.co/'),
  c('Webeez', 'contact@webeez.io', 'Kochi', 'AI automation services', 'https://webeez.io/services/ai-automation-services'),
  c('Tech46', 'info@tech46.in', 'Kochi', 'AI agents & workflow automation', 'https://www.tech46.in/'),
  c('Coremind', 'contact@coremind.co.in', 'Kochi', 'AI integration & workflow orchestration', 'https://coremind.co.in/'),
  c('CodePlus', 'codeplusetech@gmail.com', 'Coimbatore', 'AI automation agency', 'http://www.codepluse.com/services/artificial-intelligence-automation-agency'),

];

const base = (p) => path.resolve(HERE, p);
const readJson = (p, fallback = []) => {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
};

const known = new Set();
const memory = fs.existsSync(MEMORY) ? fs.readFileSync(MEMORY, 'utf8').toLowerCase() : '';
for (const f of fs.readdirSync(base('..')).filter((f) => f.startsWith('leads-') && f.endsWith('.json') && f !== 'leads-100-india.json')) {
  const rows = readJson(base(`../${f}`));
  if (Array.isArray(rows)) rows.forEach((r) => r?.email && known.add(String(r.email).toLowerCase().trim()));
}
for (const s of readJson(SUBSCRIBERS)) if (s?.email) known.add(String(s.email).toLowerCase().trim());

const seen = new Set();
const duplicates = [];
const rows = [];

for (const x of candidates) {
  const email = x.email.toLowerCase().trim();
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) { duplicates.push({ email, reason: 'invalid' }); continue; }
  if (seen.has(email)) { duplicates.push({ email, reason: 'in-batch-duplicate' }); continue; }
  if (known.has(email) || memory.includes(email)) { duplicates.push({ email, reason: 'already-contacted-or-subscribed' }); continue; }
  seen.add(email);
  rows.push({ ...x, email });
}

const mx = new Map();
const domainOf = (e) => e.split('@')[1].toLowerCase();
for (const d of [...new Set(rows.map((r) => domainOf(r.email)))]) {
  try {
    const recs = await dns.resolveMx(d);
    mx.set(d, recs.length > 0);
  } catch {
    try { await dns.resolve4(d); mx.set(d, false); } catch { mx.set(d, null); }
  }
}

const verified = rows.filter((r) => mx.get(domainOf(r.email)) !== null);
const dead = rows.filter((r) => mx.get(domainOf(r.email)) === null);
const final = verified.slice(0, 100).map((r, i) => ({
  id: `IN-FK-${String(i + 1).padStart(3, '0')}`,
  ...r,
  region: 'India',
  verification: 'public-website',
  mx: mx.get(domainOf(r.email)),
}));

fs.writeFileSync(OUT, JSON.stringify(final, null, 2));
fs.writeFileSync('/tmp/india-100-report.json', JSON.stringify({ candidates: candidates.length, uniqueFresh: rows.length, verified: verified.length, dead, duplicates }, null, 2));

console.log(JSON.stringify({
  candidates: candidates.length,
  fresh: rows.length,
  verified: verified.length,
  selected: final.length,
  deadDomains: dead.length,
  duplicates: duplicates.length,
  out: OUT,
}, null, 2));
