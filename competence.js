(() => {
 const section=document.querySelector('.competence-map');
 if(!section || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 section.classList.add('circuit-ready');
 const observer=new IntersectionObserver(entries=>{
  if(entries.some(entry=>entry.isIntersecting)){
   section.classList.add('circuit-visible');observer.disconnect();
  }
 },{threshold:.15});
 observer.observe(section);
})();
