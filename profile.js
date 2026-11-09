const profile = {
  email: 'dtt486302414@163.com',
  schools: [
    {zh:'山东大学 · 齐鲁医学院', en:'Shandong University · Cheeloo College of Medicine', degreeZh:'硕士、博士', degreeEn:'Master’s & Doctoral Studies'},
    {zh:'兰州大学 · 第一临床学院', en:'Lanzhou University · First Clinical Medical College', degreeZh:'本科', degreeEn:'Undergraduate Studies'}
  ],
  papers: verifiedPapers
};
const schoolBox = document.createElement('div');
schoolBox.className = 'schools';
document.querySelector('#about .note').replaceWith(schoolBox);
const papersBox = document.createElement('div');
papersBox.className = 'papers';
document.querySelector('#publications .empty').replaceWith(papersBox);
const emailLink = document.createElement('a');
emailLink.className = 'contact-note';
emailLink.href = 'mailto:' + profile.email;
emailLink.textContent = profile.email;
document.querySelector('.contact-note').replaceWith(emailLink);

function appendAuthors(container, paper, en) {
  const names = en && paper.authorsEn ? paper.authorsEn : paper.authors;
  names.forEach((name, index) => {
    if (index) container.append(document.createTextNode(', '));
    if (/^(Tiantian Du|杜甜甜|DU Tiantian)$/i.test(name)) {
      const strong = document.createElement('strong');
      strong.textContent = name;
      container.append(strong);
    } else container.append(document.createTextNode(name));
    if (paper.equalFirst?.includes(index)) {
      const marker = document.createElement('sup');
      marker.textContent = '†';
      marker.title = en ? 'These authors contributed equally' : '这些作者贡献相同';
      container.append(marker);
    }
  });
}
function externalLink(label, url) {
  const a = document.createElement('a');
  a.textContent = label;
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  return a;
}
function renderProfile() {
  const en = document.documentElement.lang === 'en';
  schoolBox.replaceChildren();
  const label = document.createElement('p');
  label.className = 'small-label';
  label.textContent = en ? 'EDUCATION' : '教育背景';
  schoolBox.append(label);
  profile.schools.forEach(s => {
    const entry = document.createElement('div');
    entry.className = 'school-entry';
    const degree = document.createElement('p');
    degree.className = 'school-degree';
    degree.textContent = en ? s.degreeEn : s.degreeZh;
    const name = document.createElement('p');
    name.textContent = en ? s.en : s.zh;
    entry.append(degree, name);
    schoolBox.append(entry);
  });
  papersBox.replaceChildren();
  [true, false].forEach(first => {
    const h = document.createElement('h3');
    h.className = 'publication-group';
    h.textContent = first ? (en ? 'First-author publications' : '第一作者论文') : (en ? 'Coauthored publications' : '合作论文');
    papersBox.append(h);
    profile.papers.filter(p => !!p.first === first).forEach(p => {
      const article = document.createElement('article');
      article.className = 'paper';
      const title = document.createElement('h4');
      title.append(externalLink(en && p.titleEn ? p.titleEn : p.title, p.url));
      const authors = document.createElement('p');
      authors.className = 'paper-authors';
      appendAuthors(authors, p, en);
      const journal = document.createElement('p');
      journal.textContent = en && p.journalEn ? p.journalEn : p.journal;
      const links = document.createElement('div');
      links.className = 'paper-links';
      links.append(externalLink('DOI: ' + p.doi, 'https://doi.org/' + p.doi));
      links.append(externalLink(en ? 'Journal article ↗' : '期刊原文 ↗', p.url));
      const role = document.createElement('span');
      role.className = 'paper-role';
      role.textContent = en ? p.en : p.zh;
      article.append(title, authors, journal, links, role);
      if (p.equalFirst) {
        const note = document.createElement('p');
        note.className = 'author-note';
        note.textContent = en ? '† These authors contributed equally.' : '† 这些作者贡献相同。';
        article.append(note);
      }
      papersBox.append(article);
    });
  });
}
const previousSetLanguage = setLanguage;
setLanguage = function(next) { previousSetLanguage(next); renderProfile(); };
renderProfile();
