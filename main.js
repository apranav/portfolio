(()=>{const N=109,cv=document.getElementById('seq'),cx=cv.getContext('2d'),imgs=new Array(N);let cur=-1,loaded=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const src=i=>`sequence/frame_${String(i).padStart(3,'0')}.webp`,bar=document.querySelector('#loader span');
function load(i){const im=new Image();im.decoding='async';im.src=src(i);im.onload=()=>{loaded++;if(bar)bar.style.transform=`scaleX(${loaded/N})`;if(loaded===N&&bar)bar.parentNode.style.opacity=0;if(i===cur||cur<0)draw(Math.max(cur,0))};imgs[i]=im}
load(0);if(!reduce){const order=[];for(let s=16;s>=1;s>>=1)for(let i=0;i<N;i+=s)if(!imgs[i]&&!order.includes(i))order.push(i);order.forEach(load)}
const mobile=()=>innerWidth<=820;
function size(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cur=-1;onScroll()}
function nearest(i){for(let k=0;k<N;k++){for(const j of[i-k,i+k]){const im=imgs[(j+N)%N];if(im&&im.complete&&im.naturalWidth)return im}}}
let fx=0,fy=0;
function draw(i){const im=nearest(i);if(!im)return;const W=cv.width,H=cv.height,d=W/innerWidth;cx.clearRect(0,0,W,H);
 const top=(mobile()?64:72)*d,avail=mobile()?H-top-40*d:H-top-24*d,h=Math.min(avail,1000*d),w=im.naturalWidth*h/im.naturalHeight;
 const cxp=mobile()?W-w*0.30:W*0.72;const x=cxp-w/2,y=top+(mobile()?0:(avail-h)/2);cx.drawImage(im,x,y,w,h);
 const f=innerWidth-cxp/d,fb=(H-(y+h*0.975))/d-20;if(Math.abs(f-fx)>1||Math.abs(fb-fy)>1){fx=f;fy=fb;const st=document.documentElement.style;st.setProperty('--fx',f+'px');st.setProperty('--fy',fb+'px')}}
const sec=document.querySelector('.scrolly'),ov=[...document.querySelectorAll('.ov')],pbar=document.getElementById('bar'),deg=document.getElementById('deg'),pipe=document.querySelector('.pipe'),nodes=[...pipe.querySelectorAll('.node')];
let counted=false,words=[];
function onScroll(){const r=sec.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(sec.offsetHeight-innerHeight)));
 const i=reduce?0:Math.round(p*(N-1));if(i!==cur){cur=i;requestAnimationFrame(()=>draw(i))}
 if(pbar)pbar.style.transform=`scaleX(${p})`;if(!reduce)document.documentElement.style.setProperty('--rot',(p*540).toFixed(1)+'deg');deg.textContent=reduce?0:Math.round(Math.sin(p*2*Math.PI)*90);
 ov.forEach(o=>{const a=+o.dataset.from,b=+o.dataset.to,on=p>=a&&p<b;o.classList.toggle('on',on);if(on&&!reduce){const lp=(p-a)/(b-a);o.style.setProperty('--py',(10-20*lp).toFixed(1)+'px');o.style.setProperty('--ry',(6-12*lp).toFixed(2)+'deg');o.style.setProperty('--rx',(2-4*lp).toFixed(2)+'deg');
  if(o.contains(pipe)){pipe.classList.add('go');nodes.forEach(n=>n.classList.toggle('lit',lp*5.5>=+n.dataset.k))}}});
 if(reduce)nodes.forEach(n=>n.classList.add('lit'));
 if(!counted&&p>=.86){counted=true;document.querySelectorAll('[data-count]').forEach(el=>{const t=+el.dataset.count;if(reduce){el.textContent=t;return}let s=null;const st=ts=>{s??=ts;const k=Math.min(1,(ts-s)/800);el.textContent=Math.round(t*k);if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st)})}
 revealWords()}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',size);size();

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

if(!reduce&&matchMedia('(hover:hover)').matches)document.querySelectorAll('.card,.prin>div,.timeline li').forEach(el=>{el.classList.add('tilt');const g=document.createElement('i');g.className='glare';el.appendChild(g);el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;el.style.setProperty('--ty',((x-.5)*10).toFixed(2)+'deg');el.style.setProperty('--tx',((.5-y)*10).toFixed(2)+'deg');el.style.setProperty('--gx',x*100+'%');el.style.setProperty('--gy',y*100+'%')});el.addEventListener('pointerleave',()=>{el.style.setProperty('--tx','0deg');el.style.setProperty('--ty','0deg')})});

const year=document.getElementById('yr');if(year)year.textContent=new Date().getFullYear();

/* Current section in nav */
const navLinks=[...document.querySelectorAll('.nav-desk a')];
const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
const secIo=new IntersectionObserver(es=>{
  const vis=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!vis)return;
  navLinks.forEach(a=>a.setAttribute('aria-current', a.getAttribute('href')==='#'+vis.target.id ? 'true' : 'false'));
},{rootMargin:'-30% 0px -50% 0px',threshold:[0,.25,.5,1]});
sections.forEach(s=>secIo.observe(s));

/* Mobile menu */
const menuBtn=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
function setMenu(open){
  if(!menuBtn||!menu)return;
  menuBtn.setAttribute('aria-expanded',open?'true':'false');
  menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu');
  document.body.classList.toggle('menu-open',open);
  if(open){menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('is-open'))}
  else{menu.classList.remove('is-open');setTimeout(()=>{if(!menu.classList.contains('is-open'))menu.hidden=true},400)}
}
menuBtn.addEventListener('click',()=>setMenu(menuBtn.getAttribute('aria-expanded')!=='true'));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&menuBtn.getAttribute('aria-expanded')==='true')setMenu(false)});

/* Tagline word reveal */
const tag=document.getElementById('tagline');
if(tag){
  const text=tag.textContent.trim();
  tag.textContent='';
  text.split(/\s+/).forEach((w,i,arr)=>{
    const s=document.createElement('span');
    s.className='word';
    s.textContent=w+(i<arr.length-1?' ':'');
    tag.appendChild(s);
  });
  words=[...tag.querySelectorAll('.word')];
  if(reduce)words.forEach(w=>w.classList.add('on'));
}
function revealWords(){
  if(reduce||!words.length)return;
  const mid=innerHeight*0.62;
  words.forEach(w=>{if(w.classList.contains('on'))return;const r=w.getBoundingClientRect();if(r.top<mid&&r.bottom>0)w.classList.add('on')});
}
})();
