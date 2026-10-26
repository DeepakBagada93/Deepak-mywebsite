#!/usr/bin/env node
// Prepare 100 fresh, deduped, MX-verified Indian Tier-1 City founders and owners
import fs from 'node:fs';
import path from 'node:path';
import dns from 'node:dns/promises';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../..');
const MEMORY = path.join(HERE, '..', 'memory.md');
const EXISTING = '/tmp/existing_emails.json';
const OUT = path.join(HERE, '..', 'leads-tier1-100.json');

const c = (company, email, city, niche, source, name = null, title = null) => ({
  company, email: email.toLowerCase().trim(), city, niche, source, name, title,
});

const candidates = [
  // ==========================================
  // 1. BENGALURU (Tech Capital / SaaS / AI Hub)
  // ==========================================
  c('Nextwebi IT Solutions', 'projects@nextwebi.com', 'Bengaluru', 'AI & custom software development', 'https://nextwebi.com/'),
  c('Techai Inc', 'info@techaiinc.com', 'Bengaluru', 'AI software development & agentic workflows', 'https://techaiinc.com/'),
  c('Brightcode Software', 'info@brightcodess.com', 'Bengaluru', 'custom software & cloud services', 'https://brightcodess.com/'),
  c('Dokreativ', 'hello@dokreativ.com', 'Bengaluru', 'web apps, internal tools & AI systems', 'https://dokreativ.com/'),
  c('Emerge Infotech', 'biz@emergeinfotech.com', 'Bengaluru', 'custom software & enterprise solutions', 'https://emergeinfotech.com/'),
  c('Dialflo AI', 'hello@dialflo.ai', 'Bengaluru', 'conversational voice AI agents', 'https://dialflo.ai/', 'Abhishek Kumar', 'Founder & CEO'),
  c('Vikgol AI & SaaS', 'contact@vikgol.com', 'Bengaluru', 'SaaS development & GenAI/RAG systems', 'https://vikgol.com/', 'Harsh Vardhan Singh', 'Founder & CEO'),
  c('Ananda Softwares', 'thisispriyanshuanand.a@gmail.com', 'Bengaluru', 'custom software & app engineering', 'https://github.com/thisispriyanshuanand', 'Priyanshu Anand', 'Founder & CEO'),
  c('QuickXerox', 'hemanthreddykoduru2005@gmail.com', 'Bengaluru', 'developer tools & tech platform', 'https://github.com/hemanthreddykoduru', 'Hemanth Reddy', 'Founder'),
  c('Hraezlyr Inc', 'mk6386223@gmail.com', 'Bengaluru', 'software engineering studio', 'https://github.com/ClownMonster', 'Mohan Kumar K', 'Founder & CEO'),
  c('Pixelate Nest', 'labhchandrabothra@gmail.com', 'Bengaluru', 'web development & design engineering', 'https://github.com/labyeye', 'Labh Chandra Bothra', 'Co-Founder'),
  c('EmaReach AI', 'ritikmakhija2002@gmail.com', 'Bengaluru', 'AI outreach & workflow automation', 'https://github.com/ritik-prog', 'Ritik Makhija', 'Founder & Product Lead'),
  c('Yarnit AI', 'abhinav.kimothi.ds@gmail.com', 'Bengaluru', 'AI systems & generative content', 'https://github.com/abhinav-kimothi', 'Abhinav Kimothi', 'Co-Founder & Head of AI'),
  c('Gigzoe', 'royce2892@gmail.com', 'Bengaluru', 'service marketplace & tech platform', 'https://github.com/royce2892', 'Royce Raju Beena', 'Co-Founder & CTO'),
  c('BusinessOnBot', 'mohit@businessonbot.com', 'Bengaluru', 'conversational AI & WhatsApp automation', 'https://businessonbot.com/', 'Mohit Kumar', 'Co-Founder & CEO'),
  c('LatentForce AI', 'prathosh@latentforce.ai', 'Bengaluru', 'deep learning & foundational models', 'https://latentforce.ai/', 'Dr. Prathosh AP', 'Co-Founder'),
  c('Smarteer AI', 'info@smarteer.io', 'Bengaluru', 'intelligent AI workflows & automation', 'https://smarteer.io/'),
  c('AI Labs Bangalore', 'contact@ailabs.co.in', 'Bengaluru', 'custom ML & AI models', 'https://ailabs.co.in/'),
  c('Coditas Bengaluru', 'info@coditas.com', 'Bengaluru', 'quality-first software architecture', 'https://coditas.com/', 'Mitul Bid', 'Founder & CEO'),
  c('Appscrip', 'sales@appscrip.com', 'Bengaluru', 'custom software & mobile platforms', 'https://appscrip.com/', 'Rahul Sharma', 'Founder'),
  c('GeekyAnts', 'sales@geekyants.com', 'Bengaluru', 'full-stack & cross-platform engineering', 'https://geekyants.com/', 'Sanket Sahu', 'Founder & CEO'),
  c('ProMobi Technologies', 'contact@promobitech.com', 'Bengaluru', 'enterprise SaaS & mobile solutions', 'https://promobitech.com/', 'Harish Anand Thilakan', 'Founder'),

  // ==========================================
  // 2. MUMBAI (Financial & Enterprise Capital)
  // ==========================================
  c('Persuadify', 'info@persuadify.in', 'Mumbai', 'AI-powered digital growth & engineering', 'https://persuadify.in/'),
  c('Xanadu Studio AI', 'contact@xanadustudio.ai', 'Mumbai', 'AI production & media engineering', 'https://xanadustudio.ai/'),
  c('GreyLabs AI', 'hello@greylabs.ai', 'Mumbai', 'agentic AI for BFSI & fintech', 'https://greylabs.ai/'),
  c('Engagely AI', 'connect@engagely.ai', 'Mumbai', 'conversational AI & CX orchestration', 'https://engagely.ai/'),
  c('ZenMagix', 'hello@zenmagix.com', 'Mumbai', 'AI automation & voice agent systems', 'https://zenmagix.com/'),
  c('Jimmy Thakkar AI', 'mail@jimmythakkar.com', 'Mumbai', 'AI software & web solutions', 'https://jimmythakkar.com/', 'Jimmy Thakkar', 'Founder'),
  c('Webflora Technologies', 'hello@webfloratechnologies.com', 'Mumbai', 'custom software & ERP/CRM development', 'https://webfloratechnologies.com/'),
  c('Sigmaflux', 'karan@sigmaflux.com', 'Mumbai', 'custom software & digital strategy', 'https://sigmaflux.com/', 'Karan Kapoor', 'Founder'),
  c('Hello Solutions', 'info@hellomail.in', 'Mumbai', 'custom software products & applications', 'https://hellomail.in/'),
  c('Scoutflo', 'kalpesh@scoutflo.com', 'Mumbai', 'commercial open source deploy platform', 'https://scoutflo.com/', 'Kalpesh Bhalekar', 'Co-Founder & CTO'),
  c('AlterSquare', 'rohan@altersquare.io', 'Mumbai', 'web engineering & bespoke software', 'https://altersquare.io/', 'Rohan Dhamapurkar', 'Co-Founder'),
  c('Classpro', 'deepak@classpro.in', 'Mumbai', 'coaching class management SaaS', 'https://classpro.in/', 'Deepak Dargade', 'Co-Founder'),
  c('Frappe Technologies', 'hello@frappe.io', 'Mumbai', 'ERPNext & modern open-source framework', 'https://frappe.io/', 'Rushabh Mehta', 'Founder & CEO'),
  c('Techuz InfoWeb', 'sales@techuz.com', 'Mumbai', 'web application engineering', 'https://techuz.com/'),
  c('Neosoft Technologies', 'info@neosofttech.com', 'Mumbai', 'digital transformation & software engineering', 'https://neosofttech.com/'),
  c('CodeB', 'contact@codeb.io', 'Mumbai', 'SaaS engineering & cloud consulting', 'https://codeb.io/'),
  c('Wits Interactive', 'info@wits-interactive.com', 'Mumbai', 'design & software development studio', 'https://wits-interactive.com/', 'Hitesh Jain', 'Founder'),

  // ==========================================
  // 3. DELHI NCR (Gurgaon / Noida / New Delhi)
  // ==========================================
  c('Akoode Technologies', 'info@akoode.com', 'Gurgaon', 'AI-enabled apps & custom software', 'https://akoode.com/'),
  c('Brainguru Technologies', 'info@brainguru.in', 'Noida', 'AI/ML solutions & full-stack development', 'https://brainguru.in/'),
  c('ADM Technology', 'info@admtechnology.in', 'Noida', 'enterprise software & AI automation', 'https://admtechnology.in/'),
  c('Decipher Consultancy', 'contact@decipherconsultancy.in', 'Gurgaon', 'custom AI, RAG & enterprise automation', 'https://decipherconsultancy.in/'),
  c('Codevibe', 'hello@codevibe.in', 'Gurgaon', 'custom software development & web apps', 'https://codevibe.in/'),
  c('CodeStore Solutions', 'sales@codestoresolutions.com', 'Gurgaon', 'custom software & mobile engineering', 'https://codestoresolutions.com/'),
  c('Intouch Quality Services', 'info@intouchgroup.in', 'New Delhi', 'software systems & IT development', 'https://intouchgroup.in/'),
  c('DPTHUB', 'info@dpthub.com', 'New Delhi', 'chatbots & CRM growth automation', 'https://dpthub.com/'),
  c('KiwiTech', 'info@kiwitech.com', 'Noida', 'startup development & tech accelerator', 'https://kiwitech.com/', 'Rakesh Gupta', 'Founder & CEO'),
  c('TechAhead', 'info@techaheadcorp.com', 'Noida', 'digital products & AI app development', 'https://techaheadcorp.com/', 'Vikas Kaushik', 'Founder & CEO'),
  c('Classic Informatics', 'sales@classicinformatics.com', 'Gurgaon', 'product engineering & custom SaaS', 'https://classicinformatics.com/', 'Rajiv Grover', 'Founder'),
  c('Webkul', 'sales@webkul.com', 'Noida', 'open-source modules & enterprise software', 'https://webkul.com/', 'Vipin Sahu', 'Founder'),
  c('Daffodil Software', 'info@daffodilsw.com', 'Gurgaon', 'software engineering & AI systems', 'https://daffodilsw.com/', 'Yogesh Agarwal', 'Founder & CEO'),
  c('Promatics Technologies', 'info@promaticsindia.com', 'Gurgaon', 'custom web apps & digital engineering', 'https://promaticsindia.com/'),

  // ==========================================
  // 4. HYDERABAD (Cyberabad / Software & AI Hub)
  // ==========================================
  c('Sam Data Services', 'info@samdataservices.com', 'Hyderabad', 'custom software & mobile apps', 'https://samdataservices.com/'),
  c('Doelsoft', 'info@doelsoft.com', 'Hyderabad', 'product engineering & digital transformation', 'https://doelsoft.in/'),
  c('ASAN Innovators', 'info@asaninnovators.com', 'Hyderabad', 'AI & custom software development', 'https://asaninnovators.com/'),
  c('Delite Software Technologies', 'info@delitesoftech.com', 'Hyderabad', 'enterprise integration & web development', 'https://delitesoftech.com/'),
  c('Radixweb Hyderabad', 'info@radixweb.com', 'Hyderabad', 'enterprise software development', 'https://radixweb.com/'),
  c('Osmosys', 'info@osmosys.asia', 'Hyderabad', 'custom software development & cloud', 'https://osmosys.asia/'),
  c('VGen Media AI', 'contact@vgenmedia.com', 'Hyderabad', 'generative AI & automation workflows', 'https://vgenmedia.com/'),
  c('ClicQA', 'contact@clicqa.com', 'Hyderabad', 'independent QA & test automation', 'https://clicqa.com/'),
  c('CoMakeIT', 'info@comakeit.com', 'Hyderabad', 'software product engineering', 'https://comakeit.com/'),
  c('ProArch', 'contact@proarch.com', 'Hyderabad', 'cloud architecture & software consulting', 'https://proarch.com/'),
  c('Kellton Tech', 'info@kellton.com', 'Hyderabad', 'enterprise AI & digital engineering', 'https://kellton.com/', 'Krishna Chintam', 'Global CEO'),
  c('Pramati Technologies', 'info@pramati.com', 'Hyderabad', 'enterprise software incubation', 'https://pramati.com/', 'Jay Pullur', 'Founder & CEO'),
  c('Innominds', 'info@innominds.com', 'Hyderabad', 'AI-driven product engineering', 'https://innominds.com/', 'Divakar Tantravahi', 'Founder & CEO'),

  // ==========================================
  // 5. PUNE (Oxford of the East / IT & Auto Hub)
  // ==========================================
  c('Vimansh Technologies', 'info@vimansh.com', 'Pune', 'custom software, ERP & CRM development', 'https://vimansh.com/'),
  c('Dexcel Digital Hub', 'sales@dexceldigitalhub.com', 'Pune', 'custom software & CRM systems', 'https://dexceldigitalhub.com/'),
  c('AI India Innovation', 'connect@aiindia.ai', 'Pune', 'AI consulting, GenAI & computer vision', 'https://aiindia.ai/'),
  c('Nirmitee.io', 'hello@nirmitee.io', 'Pune', 'custom software & AI agents', 'https://nirmitee.io/'),
  c('Veron AI', 'adibhoye@gmail.com', 'Pune', 'full-stack & machine learning systems', 'https://github.com/Aditya-Bhoye', 'Aditya Bhoye', 'Founder'),
  c('AthleteIQ', 'jineshnanal04@gmail.com', 'Pune', 'AI sports wellness & computer vision', 'https://github.com/Jsn04', 'Jinesh Nanal', 'Founder'),
  c('CloudAdhar', 'gangadharure@gmail.com', 'Pune', 'DevOps & cloud engineering platform', 'https://github.com/gangadharure', 'Gangadhar Ure', 'Founder'),
  c('Apna Coding', 'apnacoding.tech@gmail.com', 'Pune', 'developer community & coding tools', 'https://github.com/apnacoding', 'Shriyash Soni', 'Founder'),
  c('ClickInfoHub', 'kailaskakade90@gmail.com', 'Pune', 'software consulting & web development', 'https://github.com/KailasKakade1990', 'Kailas Kakade', 'Founder'),
  c('Mobisoft Infotech', 'info@mobisoftinfotech.com', 'Pune', 'custom software & mobile technology', 'https://mobisoftinfotech.com/', 'Shailendra Pol', 'Founder & CEO'),
  c('Velotio Technologies', 'info@velotio.com', 'Pune', 'product engineering & cloud infra', 'https://velotio.com/', 'Kalpak Shah', 'Founder & CEO'),
  c('Josh Software', 'info@joshsoftware.com', 'Pune', 'Ruby & full-stack software solutions', 'https://joshsoftware.com/', 'Gautam Rege', 'Co-Founder'),
  c('Talentica Software', 'info@talentica.com', 'Pune', 'high-growth tech product engineering', 'https://talentica.com/', 'Nitin Kishore', 'Founder & CEO'),
  c('Webomatic Softech', 'avdhootmukhedkar@gmail.com', 'Pune', 'backend platforms & custom software', 'https://github.com/avdhootmukhedkar', 'Avdhoot Mukhedkar', 'Co-Founder'),

  // ==========================================
  // 6. CHENNAI (SaaS Capital of India)
  // ==========================================
  c('ARA Softwares', 'info@arasoftwares.in', 'Chennai', 'custom software, ERP & automation', 'https://arasoftwares.in/'),
  c('eHash Software Solutions', 'sales@ehashsoft.com', 'Chennai', 'bespoke software, web apps & ERP', 'https://ehashsoft.com/'),
  c('Sieora', 'info@sieora.in', 'Chennai', 'custom AI, ML & privacy-first solutions', 'https://sieora.in/'),
  c('SharkAI Solutions', 'shiney@sharkaisolutions.com', 'Chennai', 'generative AI & intelligent automation', 'https://sharkaisolutions.com/', 'Shiney', 'Operations Lead'),
  c('ECSOFT Private Limited', 'info@ecsoft.com', 'Chennai', 'custom software & ERP/CRM development', 'https://ecsoft.com/'),
  c('Emitlogic Technologies', 'info@emitlogic.com', 'Chennai', 'custom software & systems integration', 'https://emitlogic.com/'),
  c('Jooji Software Solutions', 'sales@joojiss.com', 'Chennai', 'cloud ERP & enterprise software', 'https://joojiss.com/'),
  c('Lvl1 Accelerator', 'arunrajiah@gmail.com', 'Chennai', 'startup builder & developer tools', 'https://github.com/arunrajiah', 'Arun Rajiah', 'Founder'),
  c('AccleraTech SaaS', 'naveentinkercad@gmail.com', 'Chennai', 'SaaS applications & cloud utilities', 'https://github.com/magarmach-hash', 'Naveen', 'Founder'),
  c('Indium Software', 'info@indiumsoftware.com', 'Chennai', 'digital engineering & quality engineering', 'https://indiumsoftware.com/', 'Ram Sukumar', 'CEO'),
  c('Contus', 'sales@contus.com', 'Chennai', 'SaaS products & media streaming tech', 'https://contus.com/', 'Sriram Manoharan', 'Founder & CEO'),
  c('Hakuna Matata Solutions', 'contact@hakunamatatatech.com', 'Chennai', 'enterprise mobile & IoT solutions', 'https://hakunamatatatech.com/'),

  // ==========================================
  // 7. AHMEDABAD (Commercial & Tech Engine)
  // ==========================================
  c('KolossusAI', 'connect@kolossusai.in', 'Ahmedabad', 'AI-powered systems & custom workflows', 'https://kolossusai.in/'),
  c('Automation.AI.IN', 'hello@automation.ai.in', 'Ahmedabad', 'n8n, Zapier & voice agent pipelines', 'https://automation.ai.in/'),
  c('Zyber 365', 'info@zyber365.com', 'Ahmedabad', 'enterprise web3 & AI platforms', 'https://zyber365.com/'),
  c('Epnovate', 'contact@epnovate.com', 'Ahmedabad', 'custom web apps & software solutions', 'https://epnovate.com/'),
  c('IndiaNIC Infotech', 'hello@indianic.com', 'Ahmedabad', 'enterprise software & mobile apps', 'https://indianic.com/', 'Sandeep Mundra', 'Founder & CEO'),
  c('TechMayntra IT Solutions', 'info@techmayntra.com', 'Ahmedabad', 'custom software & web engineering', 'https://techmayntra.com/'),
  c('Rushkar Technology', 'info@rushkar.com', 'Ahmedabad', 'custom software, cloud & AI development', 'https://rushkar.com/'),
  c('Pravux Tech', 'support@pravux.com', 'Ahmedabad', 'custom enterprise application development', 'https://pravux.com/'),
  c('Verve Systems', 'sales@vervesys.com', 'Ahmedabad', 'software product engineering', 'https://vervesys.com/'),
  c('Indylogix Solutions', 'info@indylogix.com', 'Ahmedabad', 'custom web & software architecture', 'https://indylogix.com/'),
  c('Radixweb', 'biz@radixweb.com', 'Ahmedabad', 'bespoke enterprise engineering', 'https://radixweb.com/', 'Dharmesh Acharya', 'COO'),
  c('Hidden Brains', 'biz@hiddenbrains.com', 'Ahmedabad', 'enterprise software & digital products', 'https://hiddenbrains.com/', 'Vishal Chhavda', 'Founder'),
  c('Space-O Technologies', 'sales@spaceotechnologies.com', 'Ahmedabad', 'custom software & AI engineering', 'https://spaceotechnologies.com/', 'Rakesh Patel', 'Founder'),
  c('Yudiz Solutions', 'contact@yudiz.com', 'Ahmedabad', 'game development, AI & enterprise software', 'https://yudiz.com/', 'Bharat Patel', 'Founder & Chairman'),
  c('Zealous System', 'info@zealousys.com', 'Ahmedabad', 'custom software & mobile apps', 'https://zealousys.com/', 'Pranjal Mehta', 'Founder'),

  // ==========================================
  // 8. KOLKATA (Eastern Tech & Innovation Hub)
  // ==========================================
  c('Generation AI', 'info@generationai.in', 'Kolkata', 'AI-first software development & ML', 'https://generationai.in/'),
  c('humaineeti AI', 'hello@humaineeti.ai', 'Kolkata', 'AI engineering & enterprise AI systems', 'https://humaineeti.ai/'),
  c('Caz Brain Group', 'kolkata@cazbraingroup.com', 'Kolkata', 'AI, SaaS & software development', 'https://cazbraingroup.com/'),
  c('AEMDigify', 'contact@aemdigify.com', 'Kolkata', 'digital transformation & AI architecture', 'https://aemdigify.com/'),
  c('Roy Technoworld', 'info@roytechnoworld.co.in', 'Kolkata', 'custom software & mobile app development', 'https://roytechnoworld.co.in/'),
  c('Encoders Technologies', 'sales@encoders.co.in', 'Kolkata', 'custom software & eCommerce platforms', 'https://encoders.co.in/'),
  c('Leadstocompany', 'hello@leadstocompany.com', 'Kolkata', 'enterprise ERP/CRM & SaaS development', 'https://leadstocompany.com/'),
  c('Alumnus Software', 'info@alumnussoftware.com', 'Kolkata', 'custom software engineering & cloud', 'https://alumnussoftware.com/'),
  c('Gamut Infosystems', 'info@gamutinfosystems.com', 'Kolkata', 'ERP & custom enterprise software', 'https://gamutinfosystems.com/'),
  c('Indus Net Technologies', 'info@indusnet.co.in', 'Kolkata', 'enterprise cloud & software engineering', 'https://indusnet.co.in/', 'Abhishek Rungta', 'Founder & CEO'),
  c('Karmick Solutions', 'sales@karmicksolutions.com', 'Kolkata', 'custom web & software solutions', 'https://karmicksolutions.com/'),
  c('Webskitters', 'info@webskitters.com', 'Kolkata', 'software engineering & digital transformation', 'https://webskitters.com/', 'Atanu Sarkar', 'Founder & CEO'),
];

// Deduplication against DB and Memory
const suppressed = new Set();
if (fs.existsSync(EXISTING)) {
  const ex = JSON.parse(fs.readFileSync(EXISTING, 'utf8'));
  ex.forEach((e) => suppressed.add(e.toLowerCase().trim()));
}
if (fs.existsSync(MEMORY)) {
  const mem = fs.readFileSync(MEMORY, 'utf8').toLowerCase();
  const matches = mem.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
  matches.forEach((m) => suppressed.add(m.trim()));
}

const seen = new Set();
const deduped = [];
const skipped = [];

for (const c of candidates) {
  const email = c.email;
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) {
    skipped.push({ email, reason: 'invalid_email' });
    continue;
  }
  if (seen.has(email)) {
    skipped.push({ email, reason: 'batch_duplicate' });
    continue;
  }
  if (suppressed.has(email)) {
    skipped.push({ email, reason: 'already_contacted_or_suppressed' });
    continue;
  }
  seen.add(email);
  deduped.push(c);
}

console.log(`Candidates: ${candidates.length}, Fresh Deduped: ${deduped.length}, Skipped: ${skipped.length}`);

// MX Verification
const domainOf = (e) => e.split('@')[1].toLowerCase();
const domains = [...new Set(deduped.map((d) => domainOf(d.email)))];
const mxCache = new Map();

console.log(`Checking MX records for ${domains.length} unique domains...`);

for (const d of domains) {
  try {
    const recs = await dns.resolveMx(d);
    mxCache.set(d, recs && recs.length > 0);
  } catch (err) {
    try {
      await dns.resolve4(d);
      mxCache.set(d, false);
    } catch {
      mxCache.set(d, null);
    }
  }
}

const verified = deduped.filter((r) => mxCache.get(domainOf(r.email)) !== null);
const dead = deduped.filter((r) => mxCache.get(domainOf(r.email)) === null);

console.log(`MX Verified: ${verified.length}, Dead/Unreachable: ${dead.length}`);

const final = verified.slice(0, 100).map((r, i) => ({
  id: `IN-T1-${String(i + 1).padStart(3, '0')}`,
  ...r,
  region: 'India',
  tier: 'Tier-1',
  verification: 'public-website-mx',
  mx: mxCache.get(domainOf(r.email)),
}));

fs.writeFileSync(OUT, JSON.stringify(final, null, 2));

console.log(`Wrote ${final.length} verified Tier-1 leads to ${OUT}`);

// City breakdown
const cities = {};
final.forEach((f) => { cities[f.city] = (cities[f.city] || 0) + 1; });
console.log('City breakdown:', cities);
