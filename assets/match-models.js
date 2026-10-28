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
// Normalize horizontal and vertical extent independently for handwriting proportions.
function aspectNormalizedDescriptor(d) {
  if(d.aspectNormalized)return d.aspectNormalized;
  let x0=32,y0=32,x1=-1,y1=-1;
  for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(d.bits[y*32+x]){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  if(x1<0)return d;
  const bits=new Uint8Array(1024);
  for(let y=0;y<28;y++)for(let x=0;x<28;x++)bits[(y+2)*32+x+2]=d.bits[Math.round(y0+y*(y1-y0)/27)*32+Math.round(x0+x*(x1-x0)/27)];
  d.aspectNormalized=describe({bits,ratio:1});return d.aspectNormalized;
}
function modelDistance(a,b,model) {
  if(model==='aspect')return modelDistance(aspectNormalizedDescriptor(a),aspectNormalizedDescriptor(b),'ensemble');
  const contour=scoreShape(a,b);
  if(model==='contour')return contour;
  const skeleton=scoreShape(a.skeleton,b.skeleton);
  if(model==='skeleton')return skeleton;
  const zones=featureDistance(a.zones,b.zones);
  if(model==='zones')return zones;
  return .35*contour+.45*skeleton+.20*zones;
}
// Multi-view retrieval: retain the best candidates from both aspect policies,
// then compare small rotations without using character identities as priors.
function rotatedDescriptor(shape, degrees) {
  if(!degrees)return shape;
  const side=48,data=new Uint8ClampedArray(side*side*4);data.fill(255);
  const angle=degrees*Math.PI/180,c=Math.cos(angle),s=Math.sin(angle);
  for(let y=0;y<side;y++)for(let x=0;x<side;x++){
    const dx=x-(side-1)/2,dy=y-(side-1)/2;
    const sx=Math.round(c*dx+s*dy+15.5),sy=Math.round(-s*dx+c*dy+15.5);
    if(sx>=0&&sx<32&&sy>=0&&sy<32&&shape.bits[sy*32+sx]){const k=(y*side+x)*4;data[k]=data[k+1]=data[k+2]=0;}
  }
  return describe(normalizedBits({data,width:side,height:side}));
}
function rankRobust(shape, items, allowMirror=true) {
  const flipped=flipShape(shape),records=items.map(item=>{
    const mirror=allowMirror&&!['左','右'].includes(item.label);
    const direct=modelDistance(shape,item.desc,'ensemble'),aspect=modelDistance(shape,item.desc,'aspect');
    const flippedDirect=mirror?modelDistance(flipped,item.desc,'ensemble'):Infinity;
    const flippedAspect=mirror?modelDistance(flipped,item.desc,'aspect'):Infinity;
    return {item,base:Math.min(direct,flippedDirect),aspect:Math.min(aspect,flippedAspect),score:Math.min(direct,aspect,flippedDirect,flippedAspect),mirrored:Math.min(flippedDirect,flippedAspect)<Math.min(direct,aspect)};
  });
  const shortlist=new Set([...records].sort((a,b)=>a.base-b.base).slice(0,256).concat([...records].sort((a,b)=>a.aspect-b.aspect).slice(0,256)));
  for(const angle of [-15,-10,-5,5,10,15]){
    const d=rotatedDescriptor(shape,angle),f=flipShape(d);
    for(const r of shortlist){
      const direct=Math.min(modelDistance(d,r.item.desc,'ensemble'),modelDistance(d,r.item.desc,'aspect'));
      const reverse=allowMirror&&!['左','右'].includes(r.item.label)?Math.min(modelDistance(f,r.item.desc,'ensemble'),modelDistance(f,r.item.desc,'aspect')):Infinity;
      const score=Math.min(direct,reverse);
      if(score<r.score){r.score=score;r.mirrored=reverse<direct;}
    }
  }
  return records.sort((a,b)=>a.score-b.score);
}

// Experimental vertical piecewise deformation; no character-specific ranking.
function localWarpDescriptor(shape, midpoint) {
  const data=new Uint8ClampedArray(4096);data.fill(255);
  for(let y=2;y<30;y++)for(let x=0;x<32;x++){
    const sy=y<16?2+(y-2)*(midpoint-2)/14:midpoint+(y-16)*(30-midpoint)/14;
    if(shape.bits[Math.min(31,Math.round(sy))*32+x]){const k=(y*32+x)*4;data[k]=data[k+1]=data[k+2]=0;}
  }
  return describe(normalizedBits({data,width:32,height:32}));
}
async function rankLocalWarp(shape,items,allowMirror=true) {
  const views=[8,10,12,14,16,18,20,22,24].map(mid=>{const d=localWarpDescriptor(shape,mid);return [d,flipShape(d)]});
  const ranked=[];
  for(let i=0;i<items.length;i++){
    if(i%256===0)await new Promise(resolve=>setTimeout(resolve,0));
    const item=items[i];let score=Infinity,mirrored=false;
    for(const [d,f] of views){
      const direct=modelDistance(d,item.desc,'aspect');
      const reverse=allowMirror&&!['左','右'].includes(item.label)?modelDistance(f,item.desc,'aspect'):Infinity;
      if(Math.min(direct,reverse)<score){score=Math.min(direct,reverse);mirrored=reverse<direct;}
    }
    ranked.push({item,score,mirrored});
  }
  return ranked.sort((a,b)=>a.score-b.score);
}

function componentFeatures(d){
 if(d.components)return d.components;
 const seen=new Uint8Array(1024),parts=[];
 for(let i=0;i<1024;i++){if(!d.bits[i]||seen[i])continue;const queue=[i];seen[i]=1;let sx=0,sy=0;
 for(let k=0;k<queue.length;k++){const p=queue[k],x=p%32,y=p>>5;sx+=x;sy+=y;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy,j=ny*32+nx;if(nx>=0&&nx<32&&ny>=0&&ny<32&&d.bits[j]&&!seen[j]){seen[j]=1;queue.push(j)}}}
 if(queue.length>=2){const xs=queue.map(p=>p%32),ys=queue.map(p=>p>>5);parts.push({n:queue.length,x:sx/queue.length/32,y:sy/queue.length/32,w:(Math.max(...xs)-Math.min(...xs)+1)/32,h:(Math.max(...ys)-Math.min(...ys)+1)/32});}
 }
 parts.sort((a,b)=>b.n-a.n);return d.components=parts;
}
// Compare disconnected geometry without anchoring to the largest stroke: equal strokes
// may swap area order with pen width or rasterization. No character-specific priors.
function componentDistance(a,b){const A=componentFeatures(a),B=componentFeatures(b);if(!A.length||!B.length)return 1;
 const layout=(P,Q)=>P.reduce((sum,p)=>sum+Math.min(...Q.map(q=>.3*Math.hypot(p.x-q.x,p.y-q.y)+.25*Math.abs(p.h-q.h)+.1*Math.abs(p.w-q.w)+.1*Math.abs(p.n/P[0].n-q.n/Q[0].n)+.25*Math.min(1,Math.abs(Math.log((p.h/p.w)/(q.h/q.w)))/2))),0)/P.length;
 return .7*(layout(A,B)+layout(B,A))/2+.3*Math.abs(A.length-B.length)/Math.max(A.length,B.length);
}

const MATCH_MODELS={components:"分离笔画结构",localwarp:"局部比例容错",robust:"综合容错",aspect:'宽高容错',ensemble:'融合',contour:'双向轮廓',skeleton:'骨架',zones:'分区与投影'};
function installModelControls(){
  const box=document.createElement('div');box.className='model-controls';box.style.cssText='display:flex;flex-direction:column;gap:10px;margin:16px 0';
  box.innerHTML='<label><input type="checkbox" id="allow-mirror" checked>允许左右镜像（左、右除外）</label>';
  document.querySelector('.notice').before(box);

}
installModelControls();
