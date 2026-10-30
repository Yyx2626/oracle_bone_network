let allHeads = [], allVariants = [];
const SIMPLE_TO_TRAD=window.oracleScript.simpleToTrad;
const TRAD_TO_SIMPLE=window.oracleScript.tradToSimple;
function showHeads(list, title='已释字') {
  $('#heading').textContent=title;
  $('#count').textContent=`${list.length} 个字`;
  $('#results').replaceChildren();
  const fragment=document.createDocumentFragment();
  for(const d of list){
    const card=document.createElement('article');card.className='card';
    const shown=window.oracleScript.display(d.ch);
    const img=document.createElement('img');img.src=d.img;img.alt=`${shown}的甲骨文字形`;card.append(img);img.style.cursor='pointer';img.onclick=()=>{const id=d.variants[0]?.id;if(id!==undefined&&window.oracleFocus)window.oracleFocus(id)};
    const name=document.createElement('strong');name.textContent=shown;name.style.cursor='pointer';name.onclick=()=>{const id=d.variants[0]?.id;if(id!==undefined&&window.oracleFocus)window.oracleFocus(id)};card.append(name);
    const meta=document.createElement('small');meta.textContent=`${d.variants.length} 种甲骨文字形 · 简体 ${d.ch} · 繁體 ${d.trad}`;card.append(meta);
    if(d.variants.some(v=>v.synthetic)){const note=document.createElement('small');note.textContent='人工镜像补充：由“左”翻转，非中大“右”原图';card.append(note);}
    if(d.variants.length>1){
      const strip=document.createElement('div');strip.className='variants';
      for(const v of d.variants){
        const b=document.createElement('button');b.type='button';b.className='glyph-choice';b.title=`${v.source} ${v.page?`第${v.page}页`:''} ${v.position||''}`;
        const small=document.createElement('img');small.src=v.img;small.alt=`${shown}的另一甲骨文字形`;
        b.append(small);b.onclick=()=>{img.src=v.img;originalBox?.remove();originalBox=window.appendOriginalGlyph(card,v.id);link.href=v.sourceUrl||`https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=${encodeURIComponent(d.trad)}`;link.textContent=v.atlas==='extended-oracle'?'查看扩展甲骨数据集来源 ↗':v.atlas==='curated-screenshot'?'查看对照表来源 ↗':'查看香港中文大学字库字例 ↗';if(window.oracleFocus)window.oracleFocus(v.id);else location.hash=`glyph-${v.id}`};strip.append(b);
      }card.append(strip);
    }
    const link=document.createElement('a');link.href=d.variants[0]?.sourceUrl || `https://humanum.arts.cuhk.edu.hk/Lexis/lexi-mf/search.php?word=${encodeURIComponent(d.trad)}`;link.target='_blank';link.rel='noopener';link.textContent=d.variants[0]?.atlas==='extended-oracle'?'查看扩展甲骨数据集来源 ↗':d.variants[0]?.atlas==='curated-screenshot'?'查看对照表来源 ↗':'查看中文大学「汉语多功能字库」 ↗';card.append(link);let originalBox=window.appendOriginalGlyph(card,d.variants[0]?.id);fragment.append(card);
  }
  $('#results').append(fragment);
}
function otsu(values){const h=new Uint32Array(256);for(const v of values)h[v]++;let total=values.length,sum=0;for(let i=0;i<256;i++)sum+=i*h[i];let bg=0,bgSum=0,best=-1,t=160;for(let i=0;i<256;i++){bg+=h[i];if(!bg)continue;const fg=total-bg;if(!fg)break;bgSum+=i*h[i];const a=bgSum/bg,b=(sum-bgSum)/fg,v=bg*fg*(a-b)*(a-b);if(v>best){best=v;t=i}}return Math.max(55,Math.min(205,t))}
function normalizedBits(image){
  const {data,width:w,height:h}=image,gray=new Uint8Array(w*h),border=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x,k=p*4,v=Math.round(.299*data[k]+.587*data[k+1]+.114*data[k+2]);gray[p]=v;if(x===0||y===0||x===w-1||y===h-1)border.push(v)}
  border.sort((a,b)=>a-b);const invert=border[Math.floor(border.length/2)]<128,t=otsu(gray),ink=(x,y)=>invert?gray[y*w+x]>t:gray[y*w+x]<t;let minX=w,minY=h,maxX=-1,maxY=-1,count=0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(ink(x,y)){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);count++}if(!count)return null;
  const sw=maxX-minX+1,sh=maxY-minY+1,scale=Math.min(28/sw,28/sh),tw=Math.max(1,Math.round(sw*scale)),th=Math.max(1,Math.round(sh*scale)),ox=Math.floor((32-tw)/2),oy=Math.floor((32-th)/2),bits=new Uint8Array(1024);
  for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const sx=Math.min(maxX,Math.max(minX,Math.round(minX+(x+.5)/scale-.5))),sy=Math.min(maxY,Math.max(minY,Math.round(minY+(y+.5)/scale-.5)));if(ink(sx,sy))bits[(oy+y)*32+ox+x]=1}
  return {bits,ratio:sw/sh};
}
function distanceMap(bits){const m=new Float32Array(1024),d=Math.SQRT2;for(let i=0;i<1024;i++)m[i]=bits[i]?0:64;for(let y=0;y<32;y++)for(let x=0;x<32;x++){const i=y*32+x;let v=m[i];if(x)v=Math.min(v,m[i-1]+1);if(y)v=Math.min(v,m[i-32]+1);if(x&&y)v=Math.min(v,m[i-33]+d);if(x<31&&y)v=Math.min(v,m[i-31]+d);m[i]=v}for(let y=31;y>=0;y--)for(let x=31;x>=0;x--){const i=y*32+x;let v=m[i];if(x<31)v=Math.min(v,m[i+1]+1);if(y<31)v=Math.min(v,m[i+32]+1);if(x<31&&y<31)v=Math.min(v,m[i+33]+d);if(x&&y<31)v=Math.min(v,m[i+31]+d);m[i]=v}return m}
function describe(shape){return enrichDescriptor({...shape,distance:distanceMap(shape.bits)})}
function flipShape(shape){const bits=new Uint8Array(1024);for(let y=0;y<32;y++)for(let x=0;x<32;x++)bits[y*32+x]=shape.bits[y*32+31-x];return describe({bits,ratio:shape.ratio})}
function chamfer(a,b){let sum=0,count=0;for(let i=0;i<1024;i++)if(a.bits[i]){sum+=Math.min(8,b.distance[i]);count++}return sum/Math.max(1,count)/8}
function scoreShape(a,b){return a&&b?(chamfer(a,b)+chamfer(b,a))/2:Infinity}
async function loadHeads(){
  const items=JSON.parse(new TextDecoder().decode(window.oracleBase64Bytes(window.ORACLE_BUNDLE.recognitionBase64)));
  window.ORACLE_BUNDLE.recognitionBase64=null;
  window.ORACLE_BUNDLE.recognitionBase64=null;
  const sheetSources={'extended-oracle':window.ORACLE_BUNDLE.extendedOracleAtlas,synthetic:window.ORACLE_BUNDLE.syntheticAtlas,category:window.ORACLE_BUNDLE.categoryAtlas,'humanum-dog':window.ORACLE_BUNDLE.humanumAtlas,'humanum-all':window.ORACLE_BUNDLE.humanumAllAtlas,'curated-screenshot':window.ORACLE_BUNDLE.curatedScreenshotAtlas};
  const sheets=Object.fromEntries(await Promise.all(Object.entries(sheetSources).filter(([,src])=>src).map(async([name,src])=>[name,await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})])));
  const canvas=document.createElement('canvas');canvas.width=56;canvas.height=56;const g=canvas.getContext('2d',{willReadFrequently:true});
  let prepared=0;
  for(const item of items){
    if(++prepared%64===0)await new Promise(resolve=>setTimeout(resolve,0));
    const category=item.atlas==='category', humanum=item.atlas==='humanum-dog', humanumAll=item.atlas==='humanum-all', curated=item.atlas==='curated-screenshot', columns=item.atlas==='extended-oracle'?32:item.atlas==='synthetic'?1:curated?10:humanumAll?32:humanum?3:category?20:25, index=item.tile??item.id;
    const sheet=sheets[item.atlas];if(!sheet)continue;
    g.fillStyle='white';g.fillRect(0,0,56,56);g.drawImage(sheet,index%columns*56,Math.floor(index/columns)*56,56,56,0,0,56,56);
    item.img=canvas.toDataURL('image/png');const shape=normalizedBits(g.getImageData(0,0,56,56));if(!shape)continue;item.shape=shape;allVariants.push(item);
  }
  const grouped=new Map();
  for(const item of [...allVariants].sort((a,b)=>(a.variantRank??9999)-(b.variantRank??9999))){const simple=TRAD_TO_SIMPLE[item.label]||item.label,traditional=SIMPLE_TO_TRAD[simple]||item.label;let d=grouped.get(simple);if(!d){d={ch:simple,img:item.img,variants:[],trad:traditional};grouped.set(simple,d)}d.variants.push(item)}
  allHeads=[...grouped.values()];
  $('#query').oninput=()=>{
    const q=[...new Set([...$('#query').value].filter(x=>x.trim()))];
    const list=q.length?allHeads.filter(d=>q.some(ch=>window.oracleScript.canonical(ch)===d.ch)||(q.includes('零')&&d.ch==='霝')||q.some(ch=>window.oracleRelatedSearch?.[ch]?.labels.includes(d.ch))):[];
    showHeads(list,q.length?'文字检索结果':'检索结果');
    $('#feedback').textContent='';
    for(const ch of q.filter(ch=>!list.some(d=>window.oracleScript.canonical(ch)===d.ch))) {
      const card=window.oracleMissingResult(ch);
      card.className='card';
      $('#results').append(card);
    }
    if(q.includes('零'))$('#feedback').textContent='零：中大未列甲骨字例；相关字霝（雨义）供参照，不是数字0的甲骨写法。';
    const relatedNotes=q.map(ch=>window.oracleRelatedSearch?.[ch]?.note).filter(Boolean);
    if(relatedNotes.length)$('#feedback').textContent=[$('#feedback').textContent,...relatedNotes].filter(Boolean).join(' ');
    $('#candidates').classList.add('hidden');
  };
  $('#query').oninput();
  $('#match').onclick=()=>recognizeShapes(cv);
  $('#recognize').onclick=()=>inputImage&&recognizeShapes(inputImage);
  document.querySelector('.notice').textContent=`图片与手绘检索采用保比例归一化、双向轮廓距离和左右镜像比较，只提供视觉相似候选，不能直接作为释字依据。当前可比对 ${allVariants.length} 种已标注字形、${allHeads.length} 个字。`;
  document.querySelector('#upload .muted').textContent='在浏览器内按竖向空白尝试分割多个字；新算法可容忍少量平移、笔画粗细和轻微形变，复杂背景、倾斜或相连字形仍建议逐字裁剪。';
}
// Merge canonical character rankings by rank tier, never by incomparable distances.
function mergeRankTiers(rankings) {
  const lists=rankings.map(({method,ranked})=>{
    const seen=new Set();return ranked.filter(r=>{const ch=TRAD_TO_SIMPLE[r.item.label]||r.item.label;if(seen.has(ch))return false;seen.add(ch);return true}).map(r=>({...r,method}));
  });
  const emitted=new Set(),out=[];
  for(let tier=0;tier<Math.max(0,...lists.map(x=>x.length));tier++){
    const layer=new Map();
    for(const list of lists){const r=list[tier];if(!r)continue;const ch=TRAD_TO_SIMPLE[r.item.label]||r.item.label;if(emitted.has(ch))continue;
      if(!layer.has(ch))layer.set(ch,{...r,ch,tier:tier+1,votes:0,methods:[]});
      const entry=layer.get(ch);entry.votes++;entry.methods.push(r.method);
    }
    for(const entry of [...layer.values()].sort((a,b)=>b.votes-a.votes)){emitted.add(entry.ch);out.push(entry)}
  }
  return out;
}
let recognitionRun=0;
let descriptorsReady=false;
async function recognizeShapes(source) {
  if(!allVariants.length){$('#feedback').textContent='字形索引正在载入，请稍后重试。';return}
  const run=++recognitionRun;
  const pieces=source===cv?[cv.getContext('2d').getImageData(0,0,cv.width,cv.height)]:samples(source).slice(0,12),results=[];
  const allowMirror=$('#allow-mirror').checked,methods=['robust','localwarp','aspect','ensemble','zones','components'];
  const container=$('#candidates');container.replaceChildren();container.classList.toggle('hidden',false);
  const progress=document.createElement('div');progress.className='recognition-progress';progress.setAttribute('role','status');progress.setAttribute('aria-live','polite');
  const status=document.createElement('p'),track=document.createElement('div'),bar=document.createElement('div');track.className='recognition-track';bar.className='recognition-bar';track.append(bar);progress.append(status,track);container.append(progress);
  const yieldUI=()=>new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
  try {
    if(!descriptorsReady){
    for(let i=0;i<allVariants.length;i++){
      if(i%64===0){status.textContent=`首次搜索：正在准备识别索引 ${i} / ${allVariants.length}`;bar.style.width=`${Math.max(3,100*i/allVariants.length)}%`;await yieldUI();if(run!==recognitionRun)return;}
      const item=allVariants[i];if(!item.desc){item.desc=describe(item.shape);delete item.shape;}
    }
    descriptorsReady=true;
    }
    for(let k=0;k<pieces.length;k++){
      const shape=normalizedBits(pieces[k]);if(!shape)continue;
      const directShape=describe(shape),mirroredShape=flipShape(shape),rankings=[];
      for(let m=0;m<methods.length;m++){
        const model=methods[m];status.textContent=`正在识别第 ${k+1} / ${pieces.length} 个字形 · 已完成 ${m} / ${methods.length} 种匹配`;
        bar.style.width=`${Math.max(3,100*(k*methods.length+m)/(pieces.length*methods.length))}%`;
        $('#feedback').textContent='正在综合比较字形，请稍候…';await yieldUI();if(run!==recognitionRun)return;
        const ranked=model==='localwarp'?await rankLocalWarp(directShape,allVariants,allowMirror):model==='robust'?rankRobust(directShape,allVariants,allowMirror):allVariants.map(item=>{
          const direct=(model==='components'?componentDistance(directShape,item.desc):modelDistance(directShape,item.desc,model)),flipped=allowMirror&&!['左','右'].includes(item.label)?(model==='components'?componentDistance(mirroredShape,item.desc):modelDistance(mirroredShape,item.desc,model)):Infinity;
          return {item,score:Math.min(direct,flipped),mirrored:flipped<direct};
        }).sort((a,b)=>a.score-b.score);
        if(run!==recognitionRun)return;
        // Preserve the existing long-horizontal-stroke structural prior in each ranking.
        if(shape.ratio>4.2){const pos=ranked.findIndex(x=>x.item.label==='一');if(pos>0)ranked.unshift(ranked.splice(pos,1)[0]);}
        rankings.push({method:model,ranked});
      }
      results.push(mergeRankTiers(rankings));
    }
    if(run!==recognitionRun)return;
    container.replaceChildren();const best=[];
    results.forEach((choices,k)=>{
      const group=document.createElement('div');group.className='candidate-group';
      const heading=document.createElement('small'),grid=document.createElement('div');grid.className='candidate-grid';group.append(heading,grid);
      let visibleCount=0;const more=document.createElement('button');more.type='button';more.className='btn secondary';
      const appendChoices=()=>{
        for(const {item,mirrored,tier,votes,methods:matched} of choices.slice(visibleCount,visibleCount+16)){
          const b=document.createElement('button');b.type='button';b.className='candidate candidate-choice';
          const image=document.createElement('img');image.src=item.img;image.alt='';b.append(image);
          const simple=TRAD_TO_SIMPLE[item.label]||item.label,label=document.createElement('b');label.textContent=window.oracleScript.display(simple)+(mirrored?' · 镜像':'');b.append(label);

          b.onclick=()=>{if(window.oracleFocus)window.oracleFocus(item.id);else location.hash=`glyph-${item.id}`};grid.append(b);
        }
        visibleCount=Math.min(choices.length,visibleCount+16);heading.textContent=`第 ${k+1} 个形状 · 已显示 ${visibleCount} / ${choices.length} 个候选`;
        if(visibleCount<choices.length){more.textContent='显示更多16个';group.append(more)}else more.remove();
      };
      more.onclick=appendChoices;appendChoices();container.append(group);if(choices[0])best.push(choices[0].ch);
    });
    container.classList.toggle('hidden',!results.length);$('#results').replaceChildren();$('#heading').textContent='图像检索候选';$('#count').textContent='';
    $('#feedback').textContent=results.length?'已综合六组匹配结果：按名次逐层合并，同层命中方法更多的优先；点击候选确认，或显示更多16个。':'未发现有效笔画，请重新绘制。';
  }catch(error){if(run!==recognitionRun)return;container.replaceChildren();$('#feedback').textContent='识别未完成，请重试。';console.error(error)}
}
let headsPromise=null;
function ensureHeads(){
  if(!headsPromise){
    $('#feedback').textContent='首次使用检索：正在准备字形图片，请稍候…';
    headsPromise=(async()=>{
      if(!window.ORACLE_BUNDLE.recognitionBase64)await window.oracleLoadScript('assets/recognition-data.js?v=274');
      await loadHeads();
    })().catch(error=>{headsPromise=null;descriptorsReady=false;allHeads=[];allVariants=[];$('#feedback').textContent='检索索引载入失败，请再次点击重试。';throw error});
  }
  return headsPromise;
}
$('#match').onclick=async()=>{try{await ensureHeads();await recognizeShapes(cv)}catch(error){console.error(error)}};
$('#recognize').onclick=async()=>{if(!inputImage)return;try{await ensureHeads();await recognizeShapes(inputImage)}catch(error){console.error(error)}};
$('#query').oninput=async()=>{try{await ensureHeads()}catch(error){console.error(error)}};
document.querySelector('.notice').textContent='网络浏览无需准备检索索引；首次文字、手写或图片搜索时按需载入。';
window.addEventListener('oracle-script-change',()=>{$('#query')?.oninput?.()});

