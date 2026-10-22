(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.querySelector('#contact-status');
  const button = form.querySelector('[type="submit"]');
  const defaultLabel = button.innerHTML;
  let submitting = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    for (const name of ['name', 'email', 'anliegen']) {
      const field = form.elements.namedItem(name);
      field.value = field.value.trim();
    }
    if (!form.reportValidity()) return;
    let endpoint;
    try {
      endpoint = new URL(window.PORTFOLIO_CONTACT?.webhookUrl || '');
      if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password) throw new Error('Invalid endpoint');
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Das Formular ist noch nicht verbunden. Bitte kontaktiere mich per E-Mail.';
      return;
    }
    const body = new URLSearchParams();
    for (const name of ['name', 'email', 'anliegen']) body.set(name, form.elements.namedItem(name).value);
    submitting = true;
    button.disabled = true;
    button.textContent = 'Wird gesendet …';
    form.setAttribute('aria-busy', 'true');
    status.dataset.state = 'pending';
    status.textContent = 'Deine Nachricht wird übermittelt.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint.href, {
        method: 'POST', body, mode: 'cors', credentials: 'omit',
        referrerPolicy: 'no-referrer', signal: controller.signal
      });
      if (!response.ok) throw new Error('Request rejected');
      status.dataset.state = 'success';
      status.textContent = 'Danke! Deine Anfrage wurde entgegengenommen.';
      form.reset();
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Die Übermittlung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte kontaktiere mich bei Bedarf per E-Mail.';
    } finally {
      clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.innerHTML = defaultLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
