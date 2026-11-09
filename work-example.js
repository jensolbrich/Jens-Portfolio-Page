(() => {
 const show=document.querySelector('#show-prepared-result');
 const reset=document.querySelector('#reset-prepared-result');
 const panel=document.querySelector('#prepared-result');
 if(show && reset && panel){
  const content=panel.querySelector('.prepared-result-content');
  const placeholder=panel.querySelector('.example-placeholder');
  const status=document.querySelector('#prepared-status');
  content.hidden=true;placeholder.hidden=false;show.setAttribute('aria-expanded','false');
  show.addEventListener('click',()=>{
   content.hidden=false;placeholder.hidden=true;panel.classList.add('is-revealed');
   show.setAttribute('aria-expanded','true');show.disabled=true;reset.hidden=false;
   status.textContent='Beispiel strukturiert: Zusammenfassung, zwei Entscheidungen und drei Aufgaben. Vorbereitete Darstellung ohne KI-Aufruf oder Speicherung.';
  });
  reset.addEventListener('click',()=>{
   content.hidden=true;placeholder.hidden=false;panel.classList.remove('is-revealed');
   show.setAttribute('aria-expanded','false');show.disabled=false;reset.hidden=true;
   status.textContent='Vorbereitetes Beispiel zur Veranschaulichung. Es wird keine KI-Anfrage ausgeführt und nichts gespeichert.';show.focus();
  });
 }
 if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('focus-visible');observer.unobserve(entry.target);}
 }),{threshold:.2});
 document.querySelectorAll('.focus-lockup').forEach(route=>{route.classList.add('focus-ready');observer.observe(route);});
})();
