(async () => {
const svg = document.querySelector('#network-svg');
const list = document.querySelector('#category-list');
const detail = document.querySelector('#network-detail');
const total = document.querySelector('#network-total');
const search = document.querySelector('#network-query');
const message = document.querySelector('#network-message');
const NS = 'http://www.w3.org/2000/svg';
let graph, center = null, shownOthers = 80;
const navigationTrail=[];
const forwardTrail=[];
let categoryMode="meaning";
let neighborCount=12;
const headwords = new Map();
const browseLabel = label => label==='萬' ? '万' : label;
const orderedCategories = ['天干','地支','数字'];
const categoryOrders = {
  '天干':[...'甲乙丙丁戊己庚辛壬癸'],
  '地支':[...'子丑寅卯辰巳午未申酉戌亥'],
  '数字':[...'一二三四五六七八九十百千万']
};

function S(tag, attrs = {}) {
  const element = document.createElementNS(NS, tag);
  for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, value);
  return element;
}

function name(node) {
  return node.label ? window.oracleScript.display(node.label) : `第${node.page}页 · ${node.position}`;
}

function nodeDetail(id, score = null, shape = null) {
  const node = graph.nodes[id];
  detail.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = node.label ? window.oracleScript.display(node.label) : '待核对释字';
  detail.append(heading);
  const lines = [node.synthetic ? '人工镜像补充：由中大“左”字例水平翻转；非中大提供的“右”原图' : node.source === '用户截图' || node.source === '用户截图（人工逐条审校）'
    ? `用户提供的对照表截图第 ${node.page} 页，位置 ${node.position}`
    : node.atlas === 'humanum-dog' || node.atlas === 'humanum-all'
      ? `中文大学「汉语多功能字库」甲骨字例 ${node.position}；本站据图片录入`
      : `character-evolution-dataset-1bit 扩展字库条目：${node.position}；不是中文大学字库图片`,
    node.labelStatus,
    node.imageQualityWarning ? '图像疑似黑块或空白，仅供核查' : '',
    node.components?.length ? `甲骨部件：${node.components.join('、')}` : '',
    node.category.length ? `主题：${node.category.join('、')}` : '主题：其他 / 未分类'];
  if(browseLabel(node.label)==='万')lines.push('原始字头：'+node.label+'；萬为蝎子象形，万是另一个古老字头；此处合并浏览并保留原始来源');
  if (score !== null) lines.push(`甲骨字形相似指标 ${(shape * 100).toFixed(0)} / 100（不是释读概率）。`);
  if (node.watermark) lines.push(`${node.watermark}水印已预处理；原笔画可能仍有缺损`);
  const p = document.createElement('p');
  p.textContent = lines.join(' · ');
  detail.append(p);
  if(node.source === '用户截图') {
    const caption=document.createElement('div');caption.className='original-caption';
    const title=document.createElement('span');title.textContent='原图左下角：';caption.append(title);
    const t=56,h=24,columns=25,rows=Math.ceil(1684/columns);
    const preview=S('svg',{width:84,height:36,viewBox:`${node.id%columns*t} ${Math.floor(node.id/columns)*h} ${t} ${h}`});
    preview.append(S('image',{href:'assets/caption-atlas.webp',x:0,y:0,width:columns*t,height:rows*h}));caption.append(preview);detail.append(caption);
  }
  if (node.label && headwords.get(browseLabel(node.label))?.length >= 1) {
    const variants = document.createElement('div'); variants.className = 'variant-switch';
    const title = document.createElement('span'); title.textContent = `${browseLabel(node.label)==='万'?'万／萬合并浏览的':'同一个字的'} ${headwords.get(browseLabel(node.label)).length} 幅字形（人工代表优先，其余按聚类排序）：`; title.className='variant-title'; variants.append(title);
    for (const alternative of headwords.get(browseLabel(node.label))) {
      const button=document.createElement('button'); button.type='button';
      button.className = alternative.id === id ? 'active' : '';
      button.append(tile(alternative,32,31,58));
      const text=document.createElement('span');text.textContent=alternative.synthetic ? '人工镜像补充' : alternative.source?.startsWith('用户截图') ? `审校图 第${alternative.page}页` : alternative.atlas?.startsWith('humanum-') ? `中大 ${alternative.position}` : '扩展';button.append(text);
      button.title=`第${alternative.variantCluster||1}类 · ${alternative.variantClusterSize||1}幅${alternative.representativeCurated?' · 人工指定代表图':alternative.representative?' · 代表图':''}`;
      button.onclick = () => focus(alternative.id); variants.append(button);
    }
    detail.append(variants);
  }
  if (['㞢','又'].includes(node.label)) {
    const relatedLabel = node.label === '㞢' ? '又' : '㞢';
    const relatedNode = headwords.get(relatedLabel)?.[0];
    const note = document.createElement('p');
    note.textContent = '通假与用法关联：㞢、又可通读；㞢在甲骨文中可表示有、又及福祐之祐。关联不等于字形相似。';
    if (relatedNode) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = '查看关联字：' + relatedLabel;
      button.onclick = () => focus(relatedNode.id); note.append(' ',button);
    }
    detail.append(note);
  }
  if (node.label) {
    const a = document.createElement('a');
    a.href = node.sourceUrl || `https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=${encodeURIComponent(node.label)}`;
    a.target = '_blank'; a.rel = 'noopener'; a.textContent = '查看中文大学字库字例（仅标注为中大来源的图片取自此处） ↗';
    detail.append(a);
  }
}

function atlasInfo(node) {
  if(node.atlas==='synthetic') return {columns:1,rows:1,asset:window.ORACLE_BUNDLE.syntheticAtlas};
  if(node.atlas === 'curated-screenshot') return {columns:graph.curatedScreenshotColumns||10,rows:graph.curatedScreenshotRows,asset:window.ORACLE_BUNDLE.curatedScreenshotAtlas};
  if(node.atlas === 'humanum-all') return {columns:graph.humanumAllColumns||32,rows:graph.humanumAllRows,asset:window.ORACLE_BUNDLE.humanumAllAtlas};
  if(node.atlas === 'humanum-dog') return {columns:3,rows:graph.humanumRows,asset:window.ORACLE_BUNDLE.humanumAtlas};
  if(node.atlas === 'category') return {columns:graph.categoryColumns,rows:graph.categoryRows,asset:window.ORACLE_BUNDLE.categoryAtlas};
  return {columns:graph.atlasColumns,rows:graph.atlasRows,asset:window.ORACLE_BUNDLE.oracleAtlas};
}

function tile(node, x, y, size) {
  const index = node.tile ?? node.id;
  const {columns,rows,asset}=atlasInfo(node);
  const t = graph.tileSize;
  const nested = S('svg', {x:x-size/2, y:y-size/2, width:size, height:size,
    viewBox:`${index%columns*t} ${Math.floor(index/columns)*t} ${t} ${t}`});
  nested.append(S('image', {href:asset, x:0, y:0, width:columns*t, height:rows*t}));
  return nested;
}

function categoryGlyph(node) {
  const index = node.tile ?? node.id;
  const {columns,rows,asset}=atlasInfo(node);
  const t = graph.tileSize;
  const preview=S('svg',{width:42,height:42,viewBox:`${index%columns*t} ${Math.floor(index/columns)*t} ${t} ${t}`,'aria-hidden':'true'});
  preview.append(S('image',{href:asset,x:0,y:0,width:columns*t,height:rows*t}));
  return preview;
}

function focus(id, recordHistory=true) {
  if(recordHistory && center!==null && center!==id) { navigationTrail.push(center); forwardTrail.length=0; }
  center = id;
  document.querySelector('#network-back').disabled=navigationTrail.length===0;
  document.querySelector('#network-forward').disabled=forwardTrail.length===0;
  const used = new Set([id]);
  const usedNames = new Set(graph.nodes[id].label ? [graph.nodes[id].label] : []);
  const first = [];
  for (const item of graph.neighbors[id]) {
    if (first.length >= neighborCount) break;
    if (used.has(item[0])) continue;
    if(graph.nodes[item[0]].excluded) continue;
    const label=graph.nodes[item[0]].label; if(label && usedNames.has(label)) continue;
    first.push(item); used.add(item[0]); if(label) usedNames.add(label);
  }
  const second = [];
  first.forEach((parent, idx) => {
    let count = 0;
    for (const item of graph.neighbors[parent[0]]) {
      if (used.has(item[0])) continue;
      if(graph.nodes[item[0]].excluded) continue;
      const label=graph.nodes[item[0]].label; if(label && usedNames.has(label)) continue;
      second.push({item, parent:idx, offset:count});
      used.add(item[0]); if(label) usedNames.add(label);
      if (++count === 2) break;
    }
  });
  svg.replaceChildren();
  const cx = 500, cy = 375;
  const xy1 = first.map((_,i) => {
    const a = -Math.PI/2 + i*2*Math.PI/first.length;
    return [cx+225*Math.cos(a),cy+225*Math.sin(a)];
  });
  const xy2 = second.map(x => {
    const a = -Math.PI/2 + (x.parent+(x.offset ? .25:-.25))*2*Math.PI/first.length;
    return [cx+330*Math.cos(a),cy+330*Math.sin(a)];
  });
  for (let k=0;k<second.length;k++) {
    let [x,y]=xy2[k], [px,py]=xy1[second[k].parent];
    svg.append(S('line',{x1:px,y1:py,x2:x,y2:y,class:'edge'}));
  }
  xy1.forEach(([x,y])=>svg.append(S('line',{x1:cx,y1:cy,x2:x,y2:y,class:'edge primary'})));
  function add(id, x, y, level, rank) {
    const node=graph.nodes[id];
    const radius=level===0?54:level===1?Math.min(38,Math.max(13,Math.PI*225/Math.max(first.length,1)-15)):Math.min(26,Math.max(10,Math.PI*330/Math.max(second.length,1)-12));
    const group=S('g',{class:`node ${level===0?'center':''}`,tabindex:'0',role:'button',
      'aria-label':`${name(node)}，点击移到关系图中心`});
    group.append(S('circle',{cx:x,cy:y,r:radius+5}));
    group.append(tile(node,x,y,radius*1.65));
    const label=S('text',{x,y:y+radius+(level===2?17:27),class:level===2?'minor':''});
    label.textContent=node.label ? window.oracleScript.display(node.label) : (level===0 ? '释字待核' : `第${node.page}页`);
    group.append(label);
    group.addEventListener('click',()=>focus(id));
    group.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();focus(id)}});
    svg.append(group);
  }
  second.forEach((v,k)=>add(v.item[0],...xy2[k],2,k));
  first.forEach((v,k)=>add(v[0],...xy1[k],1,k));
  add(id,cx,cy,0,0);
  nodeDetail(id);
  document.querySelectorAll('.category-items button.selected,.other-list button.selected').forEach(b=>b.classList.remove('selected'));
  const selected=list.querySelector(`[data-id="${id}"]`);
  if (selected) selected.classList.add('selected');
  history.replaceState(null,'',`#glyph-${id}`);
}

function buildCategories() {
  list.replaceChildren();
  total.textContent = `${headwords.size} 个已释字 · ${graph.nodes.filter(n=>!n.excluded).length} 幅字形`;
  const categories=categoryMode==='component' ? [...graph.componentCategories,'部件待核对'] : [...orderedCategories,...graph.categories.filter(cat=>!orderedCategories.includes(cat)),'其他 / 未分类'];
  for (const cat of categories) {
    const raw=graph.nodes.filter(n=>{const cats=categoryMode==='component'?(n.components||[]):n.category;return !n.excluded&&((cat==='其他 / 未分类'||cat==='部件待核对')?!cats.length:cats.includes(cat))});
    const entries=raw.filter((n,i)=>!n.label || raw.findIndex(other=>browseLabel(other.label)===browseLabel(n.label))===i)
      .map(n=>headwords.get(browseLabel(n.label))?.[0] || n)
      .sort((a,b)=>{
        const order=categoryOrders[cat];
        if(!order)return (a.label||'').localeCompare(b.label||'','zh-Hans-CN');
        const ai=order.indexOf(a.label),bi=order.indexOf(b.label);
        return (ai<0?999:ai)-(bi<0?999:bi);
      });
    const panel=document.createElement('details');
    panel.open=true;
    const title=document.createElement('summary');
    title.textContent=`${cat}（${entries.length}）`;
    panel.append(title);
    const area=document.createElement('div');
    area.className=cat==='其他 / 未分类'?'other-list':'category-items';
    let count=0;
    function append(batch) {
      for(const node of batch){
        const button=document.createElement('button');
        button.type='button';button.dataset.id=node.id;
        button.append(categoryGlyph(node));
        const text=document.createElement('span');text.textContent=node.label ? window.oracleScript.display(node.label) : `第${node.page}页 #${node.id}`;button.append(text);
        const variantCount=node.label ? headwords.get(browseLabel(node.label))?.length || 1 : 1;
        button.title=`${node.labelStatus}${variantCount>1?`；${variantCount} 种字形`:''}`;
        button.onclick=()=>{focus(node.id);document.querySelector('.network-wrap').scrollIntoView({behavior:'smooth',block:'start'})};
        area.append(button);
      }
      count+=batch.length;
    }
    if(cat==='其他 / 未分类'){
      append(entries.slice(0,shownOthers));
      const more=document.createElement('button');
      more.className='btn secondary';more.textContent='显示更多';
      more.onclick=()=>{append(entries.slice(count,count+80));if(count>=entries.length)more.remove()};
      panel.append(area,more);
    }else {append(entries);panel.append(area)}
    list.append(panel);
  }
}

function find() {
  const query=search.value.trim();
  if(!query)return;
  const requested=query[0],label=window.oracleScript.canonical(requested);
  let entry=headwords.get(label)?.[0] || [...headwords.entries()].find(([key])=>window.oracleScript.canonical(key)===label)?.[1]?.[0];
  const related=window.oracleRelatedSearch?.[requested];
  if(!entry&&related){entry=related.labels.map(ch=>headwords.get(ch)?.[0]).find(Boolean);if(entry){focus(entry.id);message.textContent=related.note;return}}
  if(!entry&&requested==='零'){entry=headwords.get('霝')?.[0];if(entry){focus(entry.id);message.textContent='零：中大未列甲骨字例。这里展示相关字霝（雨义），不是数字0的甲骨写法。';return}}
  if(!entry&&/^\d{1,2}$/.test(query))entry=graph.nodes.find(n=>n.page===Number(query));
  if(!entry){message.textContent='没有匹配的已核对字。可在下方的“其他 / 未分类”中按页查看。';return}
  message.textContent='';focus(entry.id);
}
document.querySelector('#neighbor-count').oninput=e=>{
  if(!e.target.value)return;
  const value=Number(e.target.value);
  neighborCount=Number.isFinite(value)?Math.max(1,Math.min(32,Math.round(value))):12;
  e.target.value=neighborCount;
  if(center!==null)focus(center,false);
};
document.querySelector('#network-back').onclick=()=>{if(navigationTrail.length){forwardTrail.push(center);focus(navigationTrail.pop(),false)}};
document.querySelector('#network-forward').onclick=()=>{if(forwardTrail.length){navigationTrail.push(center);focus(forwardTrail.pop(),false)}};
document.querySelector('#category-mode').onchange=e=>{categoryMode=e.target.value;buildCategories()};
document.querySelector('#network-find').onclick=find;
search.addEventListener('keydown',e=>{if(e.key==='Enter')find()});
window.addEventListener('oracle-script-change',()=>{if(!graph)return;buildCategories();if(center!==null)focus(center)});

try {
  graph=JSON.parse(await window.oracleDecodeGzip(window.ORACLE_BUNDLE.networkGzip));
  graph.humanumRows=Math.ceil(graph.nodes.filter(n=>n.atlas==='humanum-dog').length/3);
  graph.humanumAllColumns=32;
  graph.humanumAllRows=Math.ceil(graph.nodes.filter(n=>n.atlas==='humanum-all').length/graph.humanumAllColumns);
  for(const [category,order] of Object.entries(categoryOrders))for(const node of graph.nodes)if(order.includes(node.label)){
    node.category=(node.category||[]).filter(existing=>!orderedCategories.includes(existing));
    node.category.unshift(category);
  }
  window.oracleFocus=(id,scroll=true)=>{if(!graph.nodes[id]||graph.nodes[id].excluded)return;focus(id);if(scroll)document.querySelector('.network-wrap').scrollIntoView({behavior:'smooth',block:'start'})};
  for(const node of graph.nodes) if(node.label==='萬'&&!node.excluded)node.category=['数字'];
  for(const node of graph.nodes) if(node.label&&!node.excluded){const group=headwords.get(browseLabel(node.label))||[];group.push(node);headwords.set(browseLabel(node.label),group)}
  for(const variants of headwords.values()) variants.sort((a,b)=>(a.variantRank??9999)-(b.variantRank??9999));
  const wan=headwords.get('万');
  if(wan)wan.sort((a,b)=>(a.label==='萬'?0:1)-(b.label==='萬'?0:1)||(a.variantRank??9999)-(b.variantRank??9999));
  window.oracleGraph=graph;window.dispatchEvent(new Event('oracle-graph-ready'));
  document.querySelector('#network-method').textContent = graph.method+' '+(graph.variantOrdering||'');
  buildCategories();
  const requested=/^#glyph-(\d+)$/.exec(location.hash);
  const fallback=headwords.get('王')?.[0] || graph.nodes.find(n=>!n.excluded&&n.atlas==='humanum-all') || graph.nodes.find(n=>!n.excluded);
  const id=requested?Number(requested[1]):fallback.id;
  focus(id>=0&&id<graph.nodes.length&&!graph.nodes[id].excluded?id:fallback.id);
}catch(e){detail.textContent='关系图暂时无法载入，请刷新页面重试。'}
})();

for (const [id, open] of [["categories-expand", true], ["categories-collapse", false]]) {
 document.getElementById(id).onclick=()=>document.querySelectorAll("#category-list details").forEach(panel=>{panel.open=open;});
}
