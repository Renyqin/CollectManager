/*
 * 右上角语言菜单（全站共用）
 *
 * 用法：在页面 <head> 里加入
 *   <link rel="stylesheet" href="../assets/site.css">
 *   <script src="../assets/lang-menu.js" defer></script>
 *
 * 脚本会根据 <html lang="..."> 判断当前语言，
 * 并自动链接到另一种语言文件夹下的同名页面。
 * 要加新语言：在 LANGS 里加一行（code 必须和文件夹名一致），再建对应的文件夹。
 */
(function () {
  var LANGS = [
    { code: 'zh',      lang: 'zh-hans', label: '简体中文' },
    { code: 'zh-hant', lang: 'zh-hant', label: '繁體中文' },
    { code: 'en',      lang: 'en',      label: 'English' }
  ];

  // 按 <html lang> 匹配当前语言；取匹配最长的一项，避免 zh-Hant 被识别成 zh
  var htmlLang = (document.documentElement.lang || '').toLowerCase();
  var current = null;
  LANGS.forEach(function (l) {
    if (htmlLang.indexOf(l.lang) === 0 && (!current || l.lang.length > current.lang.length)) current = l;
  });
  if (!current) current = LANGS[0];

  // 当前文件名，如 privacy.html；访问文件夹时为空字符串
  var file = location.pathname.split('/').pop();

  // ---- 生成菜单 ----
  var menu = document.createElement('div');
  menu.className = 'lang-menu';

  var btn = document.createElement('button');
  btn.className = 'lang-btn';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '🌐 ' + current.label + ' <span class="arrow">▼</span>';

  var list = document.createElement('ul');
  list.className = 'lang-list';
  list.setAttribute('role', 'menu');

  LANGS.forEach(function (l) {
    var a = document.createElement('a');
    a.textContent = l.label;
    a.setAttribute('role', 'menuitem');
    a.href = l.code === current.code ? (file || './') : '../' + l.code + '/' + file;
    if (l.code === current.code) a.className = 'current';
    a.addEventListener('click', function () {
      try { localStorage.setItem('lang', l.code); } catch (err) {}
    });
    var li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  });

  menu.appendChild(btn);
  menu.appendChild(list);
  document.body.insertBefore(menu, document.body.firstChild);

  // ---- 展开 / 收起 ----
  function close() {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();