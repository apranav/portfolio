(()=>{const N=48,cv=document.getElementById('seq'),cx=cv.getContext('2d'),imgs=[];let cur=-1;
const src=i=>`sequence/frame_${String(i).padStart(3,'0')}.webp`;
for(let i=0;i<N;i++){const im=new Image();im.src=src(i);im.onload=()=>{if(i===0)draw(0)};imgs.push(im)}
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cur=-1;onScroll()}
function draw(i){const im=imgs[i];if(!im||!im.complete||!im.naturalWidth)return;const W=cv.width,H=cv.height,s=Math.max(W/im.naturalWidth,H/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
const x=innerWidth>900?W-w*0.85:(W-w)/2;cx.fillStyle='#0a0e28';cx.fillRect(0,0,W,H);cx.drawImage(im,Math.min(0,Math.max(W-w,x)),(H-h)*0.25,w,h)}
const nav=document.querySelector('.nav'),sec=document.querySelector('.scrolly'),ov=[...document.querySelectorAll('.ov')];
function onScroll(){const r=sec.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(sec.offsetHeight-innerHeight)));
const i=Math.round(p*(N-1));if(i!==cur){cur=i;requestAnimationFrame(()=>draw(i))}
ov[0].classList.toggle('on',p<.25);ov[1].classList.toggle('on',p>=.3&&p<.58);ov[2].classList.toggle('on',p>=.6);nav.classList.toggle('over',r.bottom>60)}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',size);size();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const b=document.getElementById('themeBtn'),root=document.documentElement;
b.onclick=()=>{const t=root.dataset.theme==='light'?'dark':'light';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
document.getElementById('yr').textContent=new Date().getFullYear()})();
