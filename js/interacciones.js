function plano(id,x0,x1,y0,y1,paso){
  const c=document.getElementById(id);if(!c)return null;
  const g=c.getContext('2d'),W=c.width,H=c.height,L=60,R=20,T=20,B=40;
  const X=t=>L+(t-x0)/(x1-x0)*(W-L-R),Y=v=>H-B-(v-y0)/(y1-y0)*(H-T-B);
  g.setLineDash([]);g.fillStyle='#0e1629';g.fillRect(0,0,W,H);
  g.strokeStyle='#26344f';g.lineWidth=1;g.fillStyle='#94a3b8';g.font='18px Inter,Arial';g.textAlign='center';
  for(let t=Math.ceil(x0);t<=x1;t+=paso){g.beginPath();g.moveTo(X(t),T);g.lineTo(X(t),H-B);g.stroke();g.fillText(t,X(t),H-14);}
  g.strokeStyle='#cbd5e1';g.lineWidth=2;g.beginPath();g.moveTo(L,Y(0));g.lineTo(W-R,Y(0));g.moveTo(X(Math.max(0,x0)),T);g.lineTo(X(Math.max(0,x0)),H-B);g.stroke();
  return {g,X,Y,W,H};
}
function curva(p,f,color,w,x0,x1){
  const {g,X,Y}=p;g.beginPath();g.strokeStyle=color;g.lineWidth=w;
  for(let i=0;i<=600;i++){const t=x0+(x1-x0)*i/600;i?g.lineTo(X(t),Y(f(t))):g.moveTo(X(t),Y(f(t)));}
  g.stroke();
}
function punto(p,t,v,color){p.g.beginPath();p.g.fillStyle=color;p.g.arc(p.X(t),p.Y(v),10,0,7);p.g.fill();}
function veredicto(id,html,ok){const e=document.getElementById(id);e.innerHTML=html;e.className='veredicto '+(ok?'ok':'mal');}
 
const xs=t=>Math.exp(-2*(t-1.5)**2),T0=3;
function labCausal(){
  const tau=+document.getElementById('tau').value;
  document.getElementById('vTau').textContent=tau.toFixed(2);
  const p=plano('gCausal',-3,7,-0.2,1.2,1);if(!p)return;
  const {g,X,Y,H}=p,v=xs(T0-tau),col=tau<0?'#fb7185':'#4ade80';
  curva(p,xs,'#38bdf8',5,-3,7);curva(p,t=>xs(t-tau),'#fb923c',5,-3,7);
  g.setLineDash([10,8]);g.strokeStyle='#94a3b8';g.lineWidth=2;
  g.beginPath();g.moveTo(X(T0),20);g.lineTo(X(T0),H-40);g.stroke();
  g.strokeStyle=col;g.beginPath();g.moveTo(X(T0-tau),Y(v));g.lineTo(X(T0),Y(v));g.stroke();g.setLineDash([]);
  g.fillStyle='#94a3b8';g.font='20px Inter,Arial';g.textAlign='left';g.fillText('ahora: t = 3',X(T0)+10,36);
  punto(p,T0-tau,v,col);punto(p,T0,v,'#fb923c');
  veredicto('vCausal',tau>=0?'✓ CAUSAL: y(3) usa x en t = '+(T0-tau).toFixed(2)+' (presente o pasado)':'✗ NO CAUSAL: y(3) necesita x en t = '+(T0-tau).toFixed(2)+' (futuro)',tau>=0);
}
function labBibo(){
  const a=+document.getElementById('polo').value,N=24,YM=10;
  document.getElementById('vPolo').textContent=a.toFixed(2);
  const p=plano('gBibo',0,N,0,YM,2);if(!p)return;
  const {g,X,Y}=p;
  g.setLineDash([10,8]);g.strokeStyle='#38bdf8';g.lineWidth=3;g.beginPath();g.moveTo(X(0),Y(1));g.lineTo(X(N),Y(1));g.stroke();g.setLineDash([]);
  let y=0;
  for(let n=0;n<=N;n++){
    y=a*y+1;const v=Math.min(y,YM);
    g.strokeStyle='#fb923c';g.lineWidth=3;g.beginPath();g.moveTo(X(n),Y(0));g.lineTo(X(n),Y(v));g.stroke();punto(p,n,v,'#fb923c');
  }
  veredicto('vBibo',a<1?'✓ ESTABLE: la salida se acota y tiende a '+(1/(1-a)).toFixed(2):'✗ INESTABLE: con entrada acotada (x = 1) la salida crece sin límite',a<1);
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('tau').addEventListener('input',labCausal);
  document.getElementById('polo').addEventListener('input',labBibo);
  labCausal();labBibo();
  if(typeof Reveal!=='undefined')Reveal.on('slidechanged',()=>{labCausal();labBibo();});
});
