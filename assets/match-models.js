// Experimental raster-template classifiers, not trained OCR networks.
function thinBits(input) {
  const b=input.slice(); let changed=true;
  for(let pass=0;changed&&pass<32;pass++) { changed=false;
    for(let phase=0;phase<2;phase++) {
      const remove=[];
      for(let y=1;y<31;y++)for(let x=1;x<31;x++) {
        const i=y*32+x;if(!b[i])continue;
        const p=[b[i-32],b[i-31],b[i+1],b[i+33],b[i+32],b[i+31],b[i-1],b[i-33]];
        const n=p.reduce((a,v)=>a+v,0);let transitions=0;
        for(let k=0;k<8;k++)if(!p[k]&&p[(k+1)%8])transitions++;
        if(n<2||n>6||transitions!==1)continue;
        if(phase===0 ? (!p[0]||!p[2]||!p[4])&&(!p[2]||!p[4]||!p[6]) : (!p[0]||!p[2]||!p[6])&&(!p[0]||!p[4]||!p[6]))remove.push(i);
      }
      for(const i of remove)b[i]=0;changed ||= remove.length>0;
    }
  }return b;
}
function zoneFeatures(bits) {
  const f=new Float32Array(80);let count=0;
  for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(bits[y*32+x]){
    f[Math.floor(y/4)*8+Math.floor(x/4)]++;f[64+Math.floor(x/4)]++;f[72+Math.floor(y/4)]++;count++;
  }for(let i=0;i<f.length;i++)f[i]/=Math.max(1,count);return f;
}
function enrichDescriptor(d) {
  const bits=thinBits(d.bits);
  return {...d,skeleton:{bits,distance:distanceMap(bits)},zones:zoneFeatures(bits)};
}
function featureDistance(a,b) {let sum=0;for(let i=0;i<a.length;i++)sum+=Math.abs(a[i]-b[i]);return sum/6;}
function modelDistance(a,b,model) {
  const contour=scoreShape(a,b);
  if(model==='contour')return contour;
  const skeleton=scoreShape(a.skeleton,b.skeleton);
  if(model==='skeleton')return skeleton;
  const zones=featureDistance(a.zones,b.zones);
  if(model==='zones')return zones;
  return .35*contour+.45*skeleton+.20*zones;
}
const MATCH_MODELS={ensemble:'融合',contour:'双向轮廓',skeleton:'骨架',zones:'分区与投影'};
function installModelControls(){
  const box=document.createElement('div');box.className='model-controls';box.style.cssText='display:flex;flex-direction:column;gap:10px;margin:16px 0';
  box.innerHTML='<label for="match-model">匹配方法</label><select id="match-model"><option value="ensemble">融合（实验）</option><option value="contour">双向轮廓（基线）</option><option value="skeleton">骨架距离（减弱笔画粗细影响）</option><option value="zones">分区与投影（整体结构）</option></select><label><input type="checkbox" id="allow-mirror" checked>允许左右镜像（左、右除外）</label>';
  document.querySelector('.notice').before(box);
  const note=document.createElement('p');note.className='muted';note.textContent='四种离线模板方法，非训练式 OCR。位置和大小归一化；分数是距离而非正确概率。可用同一幅手绘切换方法后重新搜索。';box.after(note);
}
installModelControls();
