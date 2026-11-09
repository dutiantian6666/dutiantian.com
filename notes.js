// Articles are plain text blocks; no HTML from the index is executed.
(async function () {
  const list = document.getElementById('note-list');
  const article = document.getElementById('note-article');
  const el = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };
  try {
    const response = await fetch('notes.json');
    if (!response.ok) throw new Error('Cannot load notes');
    const notes = await response.json();
    if (!Array.isArray(notes)) throw new Error('Invalid notes index');
    notes.sort((a,b) => b.date.localeCompare(a.date));
    if (list && notes.length) {
      list.replaceChildren();
      notes.forEach(note => {
        const link = el('a', '', 'note-card');
        link.href = 'article.html?slug=' + encodeURIComponent(note.slug);
        link.append(el('span', note.date + ' · ' + note.category, 'note-meta'), el('h2',note.title),el('p',note.summary),el('span','阅读全文 ↗','note-read'));
        list.append(link);
      });
    }
    if (article) {
      const slug = new URLSearchParams(location.search).get('slug');
      const note = notes.find(n => n.slug === slug);
      article.replaceChildren();
      if (!note) {
        article.append(el('h1','这篇随笔还没有写下。'), el('p','可以回到随笔列表，看看新的记录。'));
        document.title = '文章未找到 · 杜甜甜';
        return;
      }
      document.title = note.title + ' · 杜甜甜';
      article.append(el('p',note.date + ' · ' + note.category,'note-meta'),el('h1',note.title),el('p',note.summary,'article-summary'));
      const body = el('div','','article-body');
      note.blocks.forEach(block => {
        if (block.type === 'code') {
          const pre = el('pre'); pre.append(el('code',block.text)); body.append(pre);
        } else if (block.type === 'list') {
          const ul = el('ul'); block.items.forEach(item => ul.append(el('li',item))); body.append(ul);
        } else body.append(el(block.type === 'heading' ? 'h2' : block.type === 'quote' ? 'blockquote' : 'p',block.text));
      });
      article.append(body);
    }
  } catch {
    const target = article || list;
    target.replaceChildren(el('p','文章暂时没有加载成功，请刷新页面重试。','notes-error'));
  }
})();
