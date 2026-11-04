(()=>{const N=96,cv=document.getElementById('seq'),cx=cv.getContext('2d'),imgs=new Array(N);let cur=-1,loaded=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const src=i=>`sequence/frame_${String(i).padStart(3,'0')}.webp`,bar=document.querySelector('#loader span');
function load(i){const im=new Image();im.decoding='async';im.src=src(i);im.onload=()=>{loaded++;bar.style.width=(loaded/N*100)+'%';if(loaded===N)bar.parentNode.style.opacity=0;if(i===cur||cur<0)draw(Math.max(cur,0))};imgs[i]=im}
load(0);if(!reduce){const order=[];for(let s=16;s>=1;s>>=1)for(let i=0;i<N;i+=s)if(!imgs[i]&&!order.includes(i))order.push(i);order.forEach(load)}
const mobile=()=>innerWidth<=820;
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cur=-1;onScroll()}
function nearest(i){for(let k=0;k<N;k++){for(const j of[i-k,i+k]){const im=imgs[(j+N)%N];if(im&&im.complete&&im.naturalWidth)return im}}}
let fx=0,fy=0;
function draw(i){const im=nearest(i);if(!im)return;const W=cv.width,H=cv.height,d=W/innerWidth;cx.clearRect(0,0,W,H);
 const top=(mobile()?58:72)*d,avail=mobile()?H*0.55-top:H-top-24*d,h=Math.min(avail,1000*d),w=im.naturalWidth*h/im.naturalHeight;
 const cxp=mobile()?W/2:W*0.7;const x=cxp-w/2,y=top+(mobile()?0:(avail-h)/2);cx.drawImage(im,x,y,w,h);
 const f=innerWidth-cxp/d,fb=(H-(y+h*0.975))/d-20;if(Math.abs(f-fx)>1||Math.abs(fb-fy)>1){fx=f;fy=fb;const st=document.documentElement.style;st.setProperty('--fx',f+'px');st.setProperty('--fy',fb+'px')}}
const nav=document.querySelector('.nav'),sec=document.querySelector('.scrolly'),ov=[...document.querySelectorAll('.ov')],pbar=document.getElementById('bar'),deg=document.getElementById('deg'),pipe=document.querySelector('.pipe'),nodes=[...pipe.querySelectorAll('.node')];
let counted=false;
function onScroll(){const r=sec.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(sec.offsetHeight-innerHeight)));
 const i=reduce?0:Math.round(p*(N-1));if(i!==cur){cur=i;requestAnimationFrame(()=>draw(i))}
 pbar.style.width=p*100+'%';deg.textContent=reduce?0:Math.round(p*360);
 ov.forEach(o=>{const a=+o.dataset.from,b=+o.dataset.to,on=p>=a&&p<b;o.classList.toggle('on',on);if(on&&!reduce){const lp=(p-a)/(b-a);o.style.setProperty('--py',(10-20*lp).toFixed(1)+'px');
  if(o.contains(pipe)){pipe.classList.add('go');nodes.forEach(n=>n.classList.toggle('lit',lp*5.5>=+n.dataset.k))}}});
 if(reduce)nodes.forEach(n=>n.classList.add('lit'));
 if(!counted&&p>=.91){counted=true;document.querySelectorAll('[data-count]').forEach(el=>{const t=+el.dataset.count;if(reduce){el.textContent=t;return}let s=null;const st=ts=>{s??=ts;const k=Math.min(1,(ts-s)/1200);el.textContent=Math.round(t*k);if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st)})}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',size);size();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.getElementById('yr').textContent=new Date().getFullYear()})();
