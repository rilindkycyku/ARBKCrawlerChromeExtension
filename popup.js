let apiKey = '';
let db;

function initDB() {
  db = new Dexie('ArbkDatabase');
  db.version(1).stores({
    businesses: '++id, NUI, EmriBiznesit, Komuna, Adresa, NumriFiskal, NumriBiznesit, StatusiARBK'
  });
}
initDB();

async function loadSavedData() {
  const result = await chrome.storage.sync.get(['arbkApiKey']);
  apiKey = result.arbkApiKey || '';
  document.getElementById('apiKey').value = apiKey;
  updateStatus(apiKey ? 'API key loaded.' : 'Enter API key to download data.');
  await checkDbSize();
}

async function checkDbSize() {
  const count = await db.businesses.count();
  if (count > 0) {
    updateStatus(`Local DB ready: ${count.toLocaleString()} active businesses.`, 'green');
  }
}

document.getElementById('saveKey').addEventListener('click', async () => {
  apiKey = document.getElementById('apiKey').value.trim();
  await chrome.storage.sync.set({ arbkApiKey: apiKey });
  updateStatus(apiKey ? 'API key saved!' : 'API key cleared.', 'green');
});

document.getElementById('clearDbBtn').addEventListener('click', async () => {
  if (confirm('Delete all local data? This cannot be undone.')) {
    await db.delete();
    initDB();
    updateStatus('Local database cleared.', 'green');
    await checkDbSize();
  }
});

// Collapsible help section
document.getElementById('helpToggle').addEventListener('click', () => {
  const content = document.getElementById('helpContent');
  const arrow = document.getElementById('helpArrow');
  content.classList.toggle('open');
  arrow.style.transform = content.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
});

document.getElementById('downloadBtn').addEventListener('click', async () => {
  if (!apiKey) return updateStatus('Save API key first!');
  updateStatus('Requesting download link...');
  try {
    const resp = await fetch('https://arbk.micro-devs.com/api/v1/business/download-csv', {
      headers: { 'X-API-Key': apiKey }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    if (!json.success || !json.data?.download_url) throw new Error('Invalid response');

    const link = document.createElement('a');
    link.href = json.data.download_url;
    link.download = json.data.file_name || 'arbk_data.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    updateStatus(`Download started: ${json.data.total_records?.toLocaleString() || '?'} records (expires in ${json.data.expires_in_minutes || 60} min)!`, 'green');
  } catch (err) {
    updateStatus(`Download error: ${err.message}`);
  }
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const importProgress = document.getElementById('importProgress');
  importProgress.style.display = 'block';
  progressBar.value = 0;
  progressText.textContent = 'Loading file...';

  try {
    let csvFile = file;

    if (file.name.toLowerCase().endsWith('.zip')) {
      progressText.textContent = 'Extracting ZIP...';
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(file);

      const csvFiles = Object.keys(zipContent.files).filter(name => name.toLowerCase().endsWith('.csv'));
      if (csvFiles.length === 0) throw new Error('No CSV found in ZIP');

      const csvEntry = zipContent.file(csvFiles[0]);
      const csvBlob = await csvEntry.async('blob');
      csvFile = new File([csvBlob], csvFiles[0]);
    }

    progressText.textContent = 'Importing active businesses...';
    await importCsv(csvFile, (prog) => {
      progressBar.value = prog;
      progressText.textContent = `Importing active only... ${Math.round(prog)}%`;
    });

    progressText.textContent = 'Import complete!';
    await checkDbSize();
    setTimeout(() => importProgress.style.display = 'none', 4000);
  } catch (err) {
    updateStatus('Error: ' + err.message);
    importProgress.style.display = 'none';
  }
});

async function importCsv(file, onProgress) {
  await db.businesses.clear();

  let imported = 0;
  let processedBytes = 0;
  const totalSize = file.size;

  const reader = file.stream().getReader();
  const decoder = new TextDecoder('utf-8');

  let buffer = '';
  let headerProcessed = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    processedBytes += value.byteLength;
    onProgress((processedBytes / totalSize) * 100);

    let lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.trim()) continue;
      if (!headerProcessed) {
        headerProcessed = true;
        continue;
      }

      const matches = line.match(/^"[^"]*","[^"]*","({.*})"$/);
      if (!matches) continue;

      const jsonStr = matches[1].replace(/""/g, '"');
      try {
        const parsed = JSON.parse(jsonStr);
        const biz = parsed.teDhenatBiznesit || {};

        if (biz.StatusiARBK === 'Regjistruar' && Object.keys(biz).length > 0) {
          await db.businesses.add(biz);
          imported++;
        }
      } catch (e) {
        console.warn('Bad row skipped');
      }
    }
  }

  if (buffer.trim()) {
    const matches = buffer.match(/^"[^"]*","[^"]*","({.*})"$/);
    if (matches) {
      const jsonStr = matches[1].replace(/""/g, '"');
      try {
        const parsed = JSON.parse(jsonStr);
        const biz = parsed.teDhenatBiznesit || {};
        if (biz.StatusiARBK === 'Regjistruar' && Object.keys(biz).length > 0) {
          await db.businesses.add(biz);
          imported++;
        }
      } catch (e) {}
    }
  }

  console.log(`Imported ${imported} ACTIVE businesses only`);
  updateStatus(`Import complete: ${imported.toLocaleString()} active businesses loaded.`, 'green');
}

// Live search as you type
document.getElementById('query').addEventListener('input', debounce(performSearch, 400));

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function performSearch() {
  const query = document.getElementById('query').value.trim();

  const dbCount = await db.businesses.count();
  if (dbCount === 0) {
    document.getElementById('results').innerHTML = '';
    updateStatus('No data loaded. Import a file first.');
    return;
  }

  if (!query) {
    document.getElementById('results').innerHTML = '<p style="text-align:center; padding:40px; opacity:0.7;">Start typing to search active businesses...</p>';
    updateStatus('');
    return;
  }

  document.getElementById('searchLoading').style.display = 'flex';
  document.getElementById('results').innerHTML = '';
  updateStatus('Searching...', '#2980b9');

  const lowerQuery = query.toLowerCase();

  let results = await db.businesses
    .where('StatusiARBK').equals('Regjistruar')
    .filter(row => 
      (row.EmriBiznesit && row.EmriBiznesit.toLowerCase().includes(lowerQuery)) ||
      (row.NUI && row.NUI.toLowerCase().includes(lowerQuery)) ||
      (row.Komuna && row.Komuna.toLowerCase().includes(lowerQuery)) ||
      (row.Adresa && row.Adresa.toLowerCase().includes(lowerQuery)) ||
      (row.NumriFiskal && row.NumriFiskal.toLowerCase().includes(lowerQuery)) ||
      (row.Telefoni && row.Telefoni.toLowerCase().includes(lowerQuery)) ||
      (row.Email && row.Email.toLowerCase().includes(lowerQuery)) ||
      (row.Vendi && row.Vendi.toLowerCase().includes(lowerQuery))
    )
    .limit(200)
    .toArray();

  if (results.length < 20) {
    const active = await db.businesses.where('StatusiARBK').equals('Regjistruar').toArray();
    results = active
      .filter(row => JSON.stringify(Object.values(row)).toLowerCase().includes(lowerQuery))
      .slice(0, 200);
  }

  document.getElementById('searchLoading').style.display = 'none';
  displayResults(results);
  updateStatus(`${results.length} active match(es) found.`, 'green');
}

function displayResults(results) {
  const container = document.getElementById('results');
  if (results.length === 0) {
    container.innerHTML = '<p style="text-align:center; padding:40px; opacity:0.7;">No matching active businesses found.</p>';
    return;
  }

  const fields = [
    'NUI',
    'EmriBiznesit',
    'EmriTregtar',
    'Vendi',
    'Adresa',
    'Komuna',
    'NumriBiznesit',
    'NumriFiskal',
    'Email',
    'Telefoni',
    'WebFaqja'
  ];

  let html = '<table><thead><tr>';
  fields.forEach(field => html += `<th>${escapeHtml(field)}</th>`);
  html += '</tr></thead><tbody>';

  results.forEach(row => {
    html += '<tr>';
    fields.forEach(field => {
      const value = row[field] || '';
      const cleanValue = value.toString().trim();
      const displayValue = escapeHtml(value);
      html += `<td data-value="${escapeHtml(cleanValue)}">${displayValue || '&nbsp;'}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  if (results.length === 200) html += '<p style="text-align:center; margin:16px 0; opacity:0.8;">Limited to 200 results (many more may exist).</p>';
  container.innerHTML = html;

  // Attach click-to-copy
  container.querySelectorAll('td').forEach(td => {
    td.style.cursor = 'pointer';
    td.title = 'Click to copy';
    td.addEventListener('click', function() {
      const text = this.getAttribute('data-value') || '';
      if (text) copyToClipboard(text, this);
    });
  });
}

function copyToClipboard(text, element) {
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const tooltip = document.createElement('div');
    tooltip.className = 'copied-tooltip';
    tooltip.textContent = 'Copied!';
    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top + window.scrollY - 30) + 'px';

    tooltip.classList.add('show');

    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => document.body.removeChild(tooltip), 300);
    }, 1200);
  }).catch(err => {
    console.warn('Copy failed:', err);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateStatus(msg, color = '#e74c3c') {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.style.color = color;
  el.style.background = color + '15';
}

window.addEventListener('DOMContentLoaded', loadSavedData);