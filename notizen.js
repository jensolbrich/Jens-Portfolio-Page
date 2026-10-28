// Öffentliche n8n-Production-URL des Notizen-Sortierers. Keine Zugangsdaten im Frontend speichern.
(() => {
 const WEBHOOK_URL = 'https://ki-automatisierung.startplatz-ai-hub.de/webhook/notizen';
 const EXAMPLE = 'Meeting Nepal-Büro: Support-Chat soll automatisiert werden, Ram kümmert sich bis Freitag um FAQ-Liste. Wir nehmen n8n statt Zapier. Uploads künftig automatisch in Google Drive ablegen, Sita prüft Ordnerstruktur. Nächstes Treffen Montag.';

 const form = document.querySelector('#notes-form');
 if (!form) return;
 const status = document.querySelector('#notes-status');
 const result = document.querySelector('#notes-result');
 const button = form.querySelector('[type="submit"]');
 const exampleButton = document.querySelector('#notes-example');
 const label = button.innerHTML;
 let busy = false;

 if (exampleButton) {
  exampleButton.addEventListener('click', () => {
   form.elements.namedItem('notes').value = EXAMPLE;
   form.elements.namedItem('notes').focus();
  });
 }

 // Antwort vereinheitlichen: Objekt, Array oder { output: … } vom KI-Agenten
 function normalize(data) {
  if (Array.isArray(data)) data = data[0] || {};
  if (data && typeof data.output === 'string') {
   const cleaned = data.output.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
   try { data = JSON.parse(cleaned); } catch { return { summary: data.output }; }
  } else if (data && data.output && typeof data.output === 'object') {
   data = data.output;
  }
  return data || {};
 }

 // Ausgabe nur per textContent – KI-Text wird nie als HTML eingefügt
 function block(title, content) {
  const h = document.createElement('h3');
  h.textContent = title;
  result.append(h);
  if (Array.isArray(content)) {
   if (!content.length) { const p = document.createElement('p'); p.textContent = '–'; result.append(p); return; }
   const ul = document.createElement('ul');
   content.forEach(item => { const li = document.createElement('li'); li.textContent = String(item); ul.append(li); });
   result.append(ul);
  } else {
   const p = document.createElement('p');
   p.textContent = content || '–';
   result.append(p);
  }
 }

 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const name = form.elements.namedItem('name');
  const notes = form.elements.namedItem('notes');
  name.value = name.value.trim(); notes.value = notes.value.trim();
  if (!form.reportValidity()) return;

  busy = true; button.disabled = true; button.textContent = 'Wird sortiert …'; form.setAttribute('aria-busy', 'true');
  status.dataset.state = 'pending'; status.textContent = 'Der KI-Agent sortiert deine Notizen. Das dauert einige Sekunden.';
  result.hidden = true; result.replaceChildren();
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 60000);

  try {
   const response = await fetch(WEBHOOK_URL, {
    method: 'POST', mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer', signal: controller.signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, notes: notes.value, timestamp: new Date().toISOString(), source: 'portfolio' })
   });
   if (!response.ok) throw Error();
   const text = await response.text();
   let data; try { data = JSON.parse(text); } catch { data = { summary: text }; }
   const d = normalize(data);
   block('Zusammenfassung', d.summary);
   block('Entscheidungen', Array.isArray(d.decisions) ? d.decisions : []);
   block('To-dos', Array.isArray(d.todos) ? d.todos : []);
   result.hidden = false;
   status.dataset.state = 'success'; status.textContent = 'Fertig. Deine Notizen wurden sortiert.';
  } catch {
   status.dataset.state = 'error'; status.textContent = 'Die Sortierung hat nicht geklappt. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut.';
  } finally {
   clearTimeout(timeout); busy = false; button.disabled = false; button.innerHTML = label; form.removeAttribute('aria-busy');
  }
 });
})();
