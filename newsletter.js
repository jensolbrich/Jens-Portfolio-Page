(() => {
 const form = document.querySelector('#newsletter-form');
 if (!form) return;
 const status = document.querySelector('#newsletter-status');
 const button = form.querySelector('[type="submit"]');
 const label = button.innerHTML;
 let busy = false;
 form.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  const email = form.elements.namedItem('email');
  const name = form.elements.namedItem('name');
  email.value = email.value.trim().toLowerCase(); name.value = name.value.trim();
  if (!form.reportValidity()) return;
  const config = window.PORTFOLIO_NEWSLETTER;
  let endpoint;
  try {
   const base = new URL(config.url);
   if (base.protocol !== 'https:' || !config.publishableKey.startsWith('sb_publishable_') || !/^[a-z_]+$/.test(config.table)) throw Error();
   endpoint = new URL('/rest/v1/' + config.table, base);
  } catch { status.dataset.state='error';status.textContent='Die Anmeldung ist derzeit nicht verfügbar.';return; }
  busy=true; button.disabled=true; button.textContent='Wird gespeichert …';form.setAttribute('aria-busy','true');
  status.dataset.state='pending';status.textContent='Dein Demo-Eintrag wird gespeichert.';
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try {
   const response = await fetch(endpoint.href, {
    method:'POST',mode:'cors',credentials:'omit',referrerPolicy:'no-referrer',signal:controller.signal,
    headers:{apikey:config.publishableKey,'Content-Type':'application/json',Prefer:'return=minimal'},
    body:JSON.stringify({email:email.value,name:name.value || null,consent:true,consent_version:config.consentVersion})
   });
   // Gleiche Rückmeldung für neue und bereits vorhandene Adressen.
   let duplicate=false;
   if(response.status===409){try{duplicate=(await response.json()).code==='23505';}catch{}}
   if(!response.ok && !duplicate) throw Error();
   status.dataset.state='success';status.textContent='Danke! Der Demo-Eintrag wurde gespeichert oder ist bereits vorhanden. Es werden keine E-Mails versendet.';
   form.reset();
  }catch{
   status.dataset.state='error';status.textContent='Die Speicherung konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut.';
  }finally{
   clearTimeout(timeout);busy=false;button.disabled=false;button.innerHTML=label;form.removeAttribute('aria-busy');
  }
 });
})();
