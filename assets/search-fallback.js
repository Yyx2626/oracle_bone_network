window.oracleMissingResult = function(character) {
  const container = document.createElement('div');
  const heading = document.createElement('strong');
  heading.textContent = character;
  heading.setAttribute('data-original-script', 'true');
  const note = document.createElement('p');
  note.textContent = '没有匹配的甲骨文';
  const link = document.createElement('a');
  link.href = `https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=${encodeURIComponent(character)}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = '查看香港中文大学字库字例（仅标注为中大来源的图片取自此处） ↗';
  container.append(heading, note, link);
  return container;
};
