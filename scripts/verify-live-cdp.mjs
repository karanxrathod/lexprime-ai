import fs from 'node:fs';
import path from 'node:path';

async function run() {
  console.log('=== LexPrime AI: Live Production Verification via CDP ===');
  const cacheBuster = Date.now();
  const targetUrl = `https://astra-ai-eb8fc.web.app/?nocache=${cacheBuster}`;
  console.log(`Target URL: ${targetUrl}`);

  // Create new target tab
  const newTab = await fetch('http://localhost:9222/json/new', { method: 'PUT' }).then(r => r.json());
  console.log(`Tab opened: ${newTab.id}`);
  const wsUrl = newTab.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const networkRequests = [];
  const consoleMessages = [];
  const exceptions = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
      return;
    }

    if (msg.method === 'Console.messageAdded') {
      const m = msg.params.message;
      consoleMessages.push({ level: m.level, text: m.text });
      if (m.level === 'error') {
        console.log(`[Browser Console Error] ${m.text}`);
      }
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const args = msg.params.args.map(a => a.value || a.description || '').join(' ');
      consoleMessages.push({ level: msg.params.type, text: args });
      if (msg.params.type === 'error') {
        console.log(`[Browser Console Error] ${args}`);
      } else if (args.includes('Gemini') || args.includes('LexPrime')) {
        console.log(`[Browser Console] ${args}`);
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
      exceptions.push(desc);
      console.log(`[Browser Exception] ${desc}`);
    } else if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp.url.includes('generateContent') || resp.url.includes('googleapis') || resp.url.includes('firebase')) {
        networkRequests.push({
          url: resp.url,
          status: resp.status,
          statusText: resp.statusText
        });
        console.log(`[Network Response] ${resp.status} ${resp.statusText} -> ${resp.url.split('?')[0]}`);
      }
    }
  };

  await new Promise(resolve => ws.onopen = resolve);
  console.log('Connected to Chrome DevTools Protocol.');

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');
  await send('Network.enable');

  console.log(`Navigating to ${targetUrl}...`);
  await send('Page.navigate', { url: targetUrl });

  // Wait for page to finish loading
  console.log('Waiting for application to load and render...');
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
    if (titleRes?.result?.value && titleRes.result.value.includes('LexPrime')) {
      console.log(`Page ready: "${titleRes.result.value}"`);
      break;
    }
  }

  await new Promise(r => setTimeout(r, 2000));

  // Wait for and click Paste Text button
  console.log('Looking for Paste Text button...');
  let pasteClicked = false;
  for (let attempt = 0; attempt < 10; attempt++) {
    const clickResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const pasteBtn = buttons.find(b => b.innerText && (b.innerText.includes('Paste Text') || b.innerText.includes('Paste text')));
          if (pasteBtn) {
            pasteBtn.click();
            return { found: true, text: pasteBtn.innerText.trim() };
          }
          return { found: false, availableButtons: buttons.map(b => b.innerText ? b.innerText.trim() : '').filter(Boolean) };
        })()
      `,
      returnByValue: true
    });
    if (clickResult?.result?.value?.found) {
      console.log('Paste button click result:', clickResult.result.value);
      pasteClicked = true;
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!pasteClicked) {
    throw new Error('Paste Text button could not be clicked');
  }

  // Wait for textarea to appear in DOM
  console.log('Waiting for textarea modal...');
  let textareaReady = false;
  const ndaText = 'This Non-Disclosure Agreement (the "Agreement") is entered into by and between Company Alpha and Consultant Beta. 1. Confidential Information: Contractor agrees to hold all proprietary trade secrets, software code, and financial data in strict confidence. 2. Non-Disclosure: Contractor shall not disclose any confidential information to third parties without prior written consent. 3. Remedies: Company Alpha is entitled to seek injunctive relief in addition to monetary damages in case of breach. 4. Governing Law: This Agreement shall be governed by Delaware law.';

  for (let attempt = 0; attempt < 10; attempt++) {
    const insertResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const textarea = document.querySelector('textarea');
          if (!textarea) return { success: false, reason: 'no textarea yet' };
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
          setter.call(textarea, ${JSON.stringify(ndaText)});
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
          return { success: true, length: textarea.value.length };
        })()
      `,
      returnByValue: true
    });
    if (insertResult?.result?.value?.success) {
      console.log('Insert result:', insertResult.result.value);
      textareaReady = true;
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!textareaReady) {
    throw new Error('Textarea was not found or could not be populated');
  }

  await new Promise(r => setTimeout(r, 1000));

  // Click Submit / Analyze Document button
  console.log('Clicking Analyze Document button...');
  let analyzeClicked = false;
  for (let attempt = 0; attempt < 5; attempt++) {
    const submitResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const analyzeBtn = buttons.find(b => 
            b.innerText && (
              b.innerText.includes('Analyze Document') || 
              b.innerText.includes('Run Analysis') || 
              b.innerText.includes('Analyze')
            )
          );
          if (analyzeBtn) {
            analyzeBtn.click();
            return { found: true, text: analyzeBtn.innerText.trim() };
          }
          return { found: false, availableButtons: buttons.map(b => b.innerText ? b.innerText.trim() : '').filter(Boolean) };
        })()
      `,
      returnByValue: true
    });
    if (submitResult?.result?.value?.found) {
      console.log('Analyze button click result:', submitResult.result.value);
      analyzeClicked = true;
      break;
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  if (!analyzeClicked) {
    throw new Error('Analyze button could not be clicked');
  }

  // Poll for completion (up to 45 seconds)
  console.log('Waiting for AI document analysis to complete on live website...');
  let completed = false;
  let analysisData = null;

  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const check = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const bodyText = document.body.innerText;
          const hasError = bodyText.includes('Analysis failed');
          const hasOverview = bodyText.includes('Overview') || bodyText.includes('Summary');
          const hasClauses = bodyText.includes('Clause Lens') || bodyText.includes('Confidential Information');
          const hasRisk = bodyText.includes('Risk Radar') || bodyText.includes('VERY LOW') || bodyText.includes('Risk Score');
          const isAnalyzing = bodyText.includes('Analyzing') || bodyText.includes('Analyzing Document');
          
          return {
            hasError,
            hasOverview,
            hasClauses,
            hasRisk,
            isAnalyzing,
            bodySnippet: bodyText.slice(0, 300).replace(/\\s+/g, ' ')
          };
        })()
      `,
      returnByValue: true
    });

    const status = check.result.value;
    if (status.hasError) {
      console.error('[Live Test] FAILED: Page displayed "Analysis failed"');
      break;
    }

    if ((status.hasOverview || status.hasClauses) && !status.isAnalyzing) {
      console.log(`\n[Live Test] Completed at ~${(i + 1) * 1.5}s!`);
      completed = true;
      analysisData = status;
      break;
    }
    process.stdout.write('.');
  }
  console.log('');

  // Capture screenshot
  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const screenshotPath = path.resolve(process.cwd(), 'live_production_verification.png');
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'));
  console.log(`Saved screenshot to: ${screenshotPath}`);

  // Query rendered details
  const domDetails = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => h.innerText.trim()).filter(Boolean);
        const tabs = Array.from(document.querySelectorAll('button[role="tab"], nav button')).map(t => t.innerText.trim()).filter(Boolean);
        const errorAlerts = Array.from(document.querySelectorAll('[role="alert"]')).map(a => a.innerText.trim());
        return { headings, tabs, errorAlerts };
      })()
    `,
    returnByValue: true
  });
  console.log('Rendered headings:', domDetails.result.value.headings);
  console.log('Available tabs:', domDetails.result.value.tabs);

  // Close tab
  await fetch(`http://localhost:9222/json/close/${newTab.id}`).catch(() => {});
  ws.close();

  // Summary analysis
  const geminiCalls = networkRequests.filter(r => r.url.includes('generateContent'));
  const hasGemini404 = geminiCalls.some(r => r.status === 404);
  const hasGemini200 = geminiCalls.some(r => r.status === 200);
  const hasSvgError = consoleMessages.some(m => m.text.includes('Unexpected end of attribute') || m.text.includes('<path> attribute d'));

  console.log('\n=========================================');
  console.log('=== LIVE PRODUCTION VERIFICATION REPORT ===');
  console.log(`Target URL:               ${targetUrl}`);
  console.log(`Gemini Network Requests:  ${geminiCalls.length}`);
  geminiCalls.forEach((r, idx) => {
    console.log(`  [${idx + 1}] Status: ${r.status} | URL: ${r.url.split('?')[0]}`);
  });
  console.log(`Gemini HTTP 200 Success:  ${hasGemini200 ? 'YES' : 'NO'}`);
  console.log(`Gemini HTTP 404 Error:    ${hasGemini404 ? 'PRESENT' : 'RESOLVED (NONE)'}`);
  console.log(`SVG Path Error:           ${hasSvgError ? 'PRESENT' : 'RESOLVED (NONE)'}`);
  console.log(`Uncaught JS Exceptions:   ${exceptions.length}`);
  console.log(`Document Analysis Render: ${completed ? 'PASS' : 'FAIL'}`);
  console.log('=========================================\n');

  if (hasGemini200 && completed && !hasGemini404 && !hasSvgError) {
    console.log('ALL LIVE PRODUCTION VERIFICATION CHECKS PASSED!');
    process.exit(0);
  } else {
    console.error('LIVE PRODUCTION VERIFICATION CHECKS FAILED!');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('CDP verification error:', err);
  process.exit(1);
});
