(() => {
let corpus = null;
let selectedCharacters = null;
const target = document.querySelector('#extension');

function glyph(form) {
  const [, , width, height, encoded] = form;
  const bits = Uint8Array.from(atob(encoded), c => c.charCodeAt(0));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const image = canvas.getContext('2d').createImageData(width, height);
  for (let i = 0; i < width * height; i++) {
    const ink = bits[i >> 3] & (1 << (i & 7));
    image.data.set(ink ? [25, 41, 52, 255] : [255, 255, 255, 255], i * 4);
  }
  canvas.getContext('2d').putImageData(image, 0, 0);
  return canvas.toDataURL();
}

function show() {
  if (!corpus) return;
  target.replaceChildren();
  const chars = [...new Set([...(selectedCharacters ?? window.oracleCurrentCharacter ?? '王')].filter(c => c.trim()))];
  if (!chars.length) {
    target.textContent = '当前字形没有已知字头，无法查找扩展字形。';
    return;
  }
  for (const ch of chars.slice(0, 12)) {
    const section = document.createElement('section');
    section.className = 'extension';
    const title = document.createElement('h3');
    title.textContent = window.oracleScript.display(ch);
    section.append(title);
    const stages = document.createElement('div');
    stages.className = 'stages';
    const keys=[...new Set([ch,window.oracleScript.canonical(ch),window.oracleScript.traditional(ch)])];
    const seen=new Set();
    const matches=keys.flatMap(key=>corpus[key]||[]).filter(form=>{const key=JSON.stringify(form);if(seen.has(key))return false;seen.add(key);return true});
    for (const [script, label] of [['oracle-bone','甲骨文'],['bronze','金文'],['clerical','隶书']]) {
      const part = document.createElement('div');
      part.className = 'stage';
      const heading = document.createElement('h4');
      heading.textContent = label;
      part.append(heading);
      const box = document.createElement('div');
      box.className = 'variants';
      const forms = matches.filter(x => x[0] === script);
      if (!forms.length) box.textContent = '此数据集中未收录';
      for (const item of forms) {
        try {
          const variant = document.createElement('div');
          variant.className = 'variant';
          const img = new Image();
          img.src = glyph(item);
          img.alt = `${ch}：${label}字形`;
          const source = document.createElement('small');
          source.textContent = item[1];
          source.title = item[1];
          variant.append(img, source);
          box.append(variant);
        } catch (_) {}
      }
      part.append(box);
      stages.append(part);
    }
    section.append(stages);
    const foot = document.createElement('p');
    foot.className = 'muted';
    foot.textContent = `繁體 ${window.oracleScript.traditional(ch)} · 简体 ${window.oracleScript.canonical(ch)}。按现代字归类的字形；同形异释、假借和承继关系请结合原出处核实。`;
    section.append(foot);
    target.append(section);
  }
}

document.querySelector('#load-dataset').onclick = async event => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = '正在载入历代参考（约 4 MB）…';
  try {
    if(!window.ORACLE_BUNDLE.corpusGzip)await window.oracleLoadScript("assets/extended-data.js?v=271");
    corpus = JSON.parse(await window.oracleDecodeGzip(window.ORACLE_BUNDLE.corpusGzip));
    window.ORACLE_BUNDLE.corpusGzip=null;
    button.textContent = '历代字形参考已载入';
    selectedCharacters=window.oracleCurrentCharacter || '王';
    show();
  } catch (_) {
    button.disabled = false;
    button.textContent = '重试载入历代参考';
    target.textContent = '扩展字库未能载入，请检查网络连接。';
  }
};
document.querySelector('#query').addEventListener('input',()=>{selectedCharacters=document.querySelector('#query').value || window.oracleCurrentCharacter || '王';show()});
window.addEventListener('oracle-character-change',event=>{selectedCharacters=event.detail.character;show()});
window.addEventListener('oracle-script-change', show);
})();
