// DEMO: botões de entrada e aviso de dados fictícios.
(function () {
  var tag = document.createElement('div');
  tag.textContent = 'Demonstração · dados fictícios';
  tag.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:99999;font:600 12px Manrope,system-ui,sans-serif;color:#1d1c1c;background:#e49e2b;padding:6px 12px;border-radius:999px;pointer-events:none;box-shadow:0 2px 10px rgba(0,0,0,.4)';
  var st=document.createElement('style');
  st.textContent='@media (max-width:820px){.demo-tag{bottom:84px!important;right:8px!important;font-size:11px!important;padding:4px 10px!important}}';
  tag.className='demo-tag'; document.head.appendChild(st); document.body.appendChild(tag);
  function entrar(login, f) {
    f.querySelector('[name=login]').value = login; f.querySelector('[name=senha]').value = 'teste123';
    (f.querySelector('button[type=submit]') || f.querySelector('button')).click();
  }
  function injeta() {
    var f = document.getElementById('f-login'); if (!f || f.parentNode.querySelector('.demo-btns')) return;
    var w = document.createElement('div'); w.className = 'demo-btns'; w.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;margin-top:14px';
    [['Entrar como dono', 'marcos'], ['Entrar como barbeiro', 'diego']].forEach(function (x) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.textContent = x[0]; b.style.flex = '1 1 160px';
      b.onclick = function () { entrar(x[1], f); }; w.appendChild(b);
    });
    f.insertAdjacentElement('afterend', w);
  }
  new MutationObserver(injeta).observe(document.getElementById('app'), { childList: true, subtree: true }); injeta();
})();
