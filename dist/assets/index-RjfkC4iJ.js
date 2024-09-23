var K=Object.defineProperty;var Z=(e,t,n)=>t in e?K(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var p=(e,t,n)=>Z(e,typeof t!="symbol"?t+"":t,n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(o){if(o.ep)return;o.ep=!0;const c=n(o);fetch(o.href,c)}})();const $={I:{shape:[[1,1,1,1]],color:"#00f0f0"},L:{shape:[[1,0],[1,0],[1,1]],color:"#c54155"},J:{shape:[[0,1],[0,1],[1,1]],color:"#c54155"},T:{shape:[[1,1,1],[0,1,0]],color:"#a000f0"},O:{shape:[[1,1],[1,1]],color:"#ae59b3"},S:{shape:[[0,1,1],[1,1,0]],color:"#00f000"},Z:{shape:[[1,1,0],[0,1,1]],color:"#f00000"},Single:{shape:[[1]],color:"#f0a0f0"},Plus:{shape:[[0,1,0],[1,1,1],[0,1,0]],color:"#a0a0a0"},U:{shape:[[1,0,1],[1,1,1]],color:"#7bac3c"},BigSquare:{shape:[[1,1,1],[1,1,1],[1,1,1]],color:"#9e4b1e"},Two:{shape:[[1,1]],color:"#3c77b9"}};function A(){const e=Object.keys($),t=e[Math.floor(Math.random()*e.length)];return{key:t,piece:$[t]}}function N(e){const t=document.getElementById("tetris-bank"),n=A();return e.remove(),Y(n.key,n.piece,t),E(),n}const a=8,W=3,w=139,G=100;function j(e){return e.length,e[0].map((n,r)=>e.map(o=>o[r]).reverse())}function k(e){const t=z(e),n=Q(t.r,t.g,t.b);return Math.round(n[0]*360)}function z(e){e=e.replace(/^#/,"");const t=parseInt(e,16),n=t>>16&255,r=t>>8&255,o=t&255;return{r:n,g:r,b:o}}function Q(e,t,n){e/=255,t/=255,n/=255;const r=Math.max(e,t,n),o=Math.min(e,t,n);let c,l,s=(r+o)/2;if(r===o)c=l=0;else{const i=r-o;switch(l=s>.5?i/(2-r-o):i/(r+o),r){case e:c=(t-n)/i+(t<n?6:0);break;case t:c=(n-e)/i+2;break;case n:c=(e-t)/i+4;break}c/=6}return[c,l,s]}function V(e,t,n,r){const o=Math.floor(n/r),c=Math.floor(t/r);if(e[o]&&e[o][c])return[o,c];const l=e.length,s=e[0].length;let i=1/0,f=[0,0];for(let d=0;d<l;d++)for(let g=0;g<s;g++)if(e[d][g]){const m=Math.sqrt(Math.pow(d-o,2)+Math.pow(g-c,2));m<i&&(i=m,f=[d,g])}return f}function _(e){return document.querySelector(`.grid-cell[data-index="${e}"]`)}function ee(e,t,n){const r=_(e);if(r)if(r.style.backgroundImage=t?`url("${t}")`:"",r.style.backgroundSize="cover",n){const o=k(n);r.style.filter=`hue-rotate(${o}deg)`}else r.style.filter=""}function J(e,t,n,r,o){const c=n.width/a,l=Math.floor((e-n.left)/c)-o,s=Math.floor((t-n.top)/c)-r,i=s*a+l;return{targetCol:l,targetRow:s,targetIndex:i}}function te(e,t,n){const r=new Date;r.setTime(r.getTime()+n*24*60*60*1e3),document.cookie=`${e}=${t};expires=${r.toUTCString()};path=/`}function ne(e){const t=e+"=",n=document.cookie.split(";");for(let r=0;r<n.length;r++){let o=n[r];for(;o.charAt(0)===" ";)o=o.substring(1,o.length);if(o.indexOf(t)===0)return o.substring(t.length,o.length)}return null}class B{constructor(t,n,r,o){p(this,"x");p(this,"y");p(this,"w");p(this,"h");p(this,"_sprite");p(this,"_body");console.log("Creating block",t,n,r,o),this.x=t,this.y=n,this.w=r,this.h=o,this.createSprite()}createSprite(){const t=["#848484","#c1c1c1","#aaaaaa"];this._sprite=document.createElement("canvas"),this._sprite.width=this.w,this._sprite.height=this.h;const n=this._sprite.getContext("2d");let r=2+Math.floor(Math.random()*4);for(let o=0;o<r;o++){let c=t[o%3],l=30+Math.random()*10,s=this.w-o*l,i=this.h-o*l;if(s<10||i<10)return;let f=(this.w-s)/2,d=(this.h-i)/2;n.fillStyle=c,n.beginPath(),n.roundRect(f,d,s,i,30),n.fill()}}get sprite(){return this._sprite.toDataURL()}}function S(e,t){const n=Math.floor(t/a),r=t%a;for(let o=0;o<e.length;o++)for(let c=0;c<e[o].length;c++)if(e[o][c]){const l=n+o,s=r+c;if(l>=a||s>=a||l<0||s<0)return!1;const i=l*a+s,f=_(i);if(!f||f.style.backgroundImage!=="")return!1}return!0}function O(e,t,n){const r=Math.floor(t/a),o=t%a;for(let c=0;c<e.length;c++)for(let l=0;l<e[c].length;l++)if(e[c][l]){const s=(r+c)*a+(o+l),i=new B(0,0,w,w).sprite;ee(s,i,n)}oe()}function oe(){let e=[],t=[];for(let n=0;n<a;n++)ce(n,a)&&e.push(n),re(n,a)&&t.push(n);e.forEach(n=>le(n,a)),t.forEach(n=>se(n,a)),ge(e.length,t.length)}function ce(e,t){for(let n=0;n<t;n++){const r=e*t+n;if(document.querySelector(`.grid-cell[data-index="${r}"]`).style.backgroundImage==="")return!1}return!0}function re(e,t){for(let n=0;n<t;n++){const r=n*t+e;if(document.querySelector(`.grid-cell[data-index="${r}"]`).style.backgroundImage==="")return!1}return!0}function le(e,t){for(let n=0;n<t;n++){const r=e*t+n,o=document.querySelector(`.grid-cell[data-index="${r}"]`);o.style.backgroundImage="",o.style.filter=""}}function se(e,t){for(let n=0;n<t;n++){const r=n*t+e,o=document.querySelector(`.grid-cell[data-index="${r}"]`);o.style.backgroundImage="",o.style.filter=""}}function ie(){document.querySelectorAll(".grid-cell").forEach(t=>{t.style.backgroundImage="",t.style.filter="",t.classList.remove("preview")}),me(),X(),E()}function ae(e){e.preventDefault(),ie(),e.dataTransfer&&(e.dataTransfer.dropEffect="none",e.dataTransfer.effectAllowed="none")}let v=0,P=parseInt(ne("highScore"))||0;function de(){const e=document.getElementById("game-grid");for(let t=0;t<a*a;t++){const n=document.createElement("div");n.className="grid-cell",n.dataset.index=t,e.appendChild(n)}}function X(){const e=document.getElementById("tetris-bank");e.innerHTML="";for(let t=0;t<W;t++){const n=A();Y(n.key,n.piece,e)}E()}function Y(e,t,n){const r=document.createElement("div");r.className="tetris-piece",r.id=`piece-${e}-${Date.now()}`;const o=document.createElement("div");o.className="piece-grid";let c=JSON.parse(JSON.stringify(t.shape));const l=Math.floor(Math.random()*4);for(let s=0;s<l;s++)c=j(c);r.dataset.shape=JSON.stringify(c),r.dataset.color=t.color,fe(o,c,t.color),r.appendChild(o),n.appendChild(r),r.setAttribute("draggable",!0)}function E(){document.querySelectorAll(".tetris-piece").forEach(t=>{const n=JSON.parse(t.dataset.shape),r=ue(n);t.classList.toggle("unplaceable",!r),t.draggable=r})}function ue(e){for(let t=0;t<a;t++)for(let n=0;n<a;n++){const r=t*a+n;if(S(e,r))return!0}return!1}function fe(e,t,n){e.innerHTML="",e.style.display="grid",e.style.gridTemplateRows=`repeat(${t.length}, 10px)`,e.style.gridTemplateColumns=`repeat(${t[0].length}, 10px)`,t.forEach(r=>{r.forEach(o=>{const c=document.createElement("div");if(c.className="piece-cell",o){const l=new B(0,0,w,w).sprite;c.style.backgroundImage=`url("${l}")`,c.style.backgroundSize="cover";const s=k(n);c.style.filter=`hue-rotate(${s}deg)`}e.appendChild(c)})})}function ge(e,t){const n=e+t,r=n*(n>1?10:1);v+=r,v>P&&(P=v,te("highScore",P,365)),M()}function M(){const e=document.getElementById("score"),t=document.getElementById("high-score");e.textContent=`Score: ${v}`,t.textContent=`High Score: ${P}`}function he(){v=0,M()}function me(){v=0,M()}function pe(){de(),X()}let u=null,x=0,L=0;function ye(){document.removeEventListener("mousedown",C),document.removeEventListener("touchstart",C),document.removeEventListener("mousemove",I),document.removeEventListener("touchmove",I),document.removeEventListener("mouseup",b),document.removeEventListener("touchend",b),document.addEventListener("mousedown",C),document.addEventListener("touchstart",C),document.addEventListener("mousemove",I),document.addEventListener("touchmove",I),document.addEventListener("mouseup",b),document.addEventListener("touchend",b)}function C(e){const t=e.target.closest(".tetris-piece");if(!t||t.classList.contains("unplaceable"))return;e.preventDefault();const n=JSON.parse(t.dataset.shape),r=t.getBoundingClientRect();let o=e.clientX||e.touches[0].clientX,c=e.clientY||e.touches[0].clientY;c-=G;const l=r.width/2,s=r.height/2,i=r.width/n[0].length,[f,d]=V(n,l,s,i);u=ve(n,t.dataset.color,f,d,t.id),document.body.appendChild(u),U(o,c,f,d,i)}function I(e){if(!u)return;e.preventDefault();let t=e.clientX||e.touches[0].clientX,n=e.clientY||e.touches[0].clientY;n-=G,x=t,L=n;const r=document.querySelector(".grid-cell").offsetWidth,o=parseInt(u.dataset.activeRow||0),c=parseInt(u.dataset.activeCol||0);U(t,n,o,c,r),Ee(t,n)}function b(e){if(!u||e.target.nodeName==="BUTTON")return;e.preventDefault();let t=x||e.clientX||e.changedTouches[0].clientX,n=L||e.clientY||e.changedTouches[0].clientY;const o=document.getElementById("game-grid-container").getBoundingClientRect(),c=u.dataset.originalId,l=JSON.parse(u.dataset.shape),s=parseInt(u.dataset.activeRow),i=parseInt(u.dataset.activeCol);if(x=null,L=null,t<o.left||t>o.right||n<o.top||n>o.bottom){q(c),D(),R();return}const{targetIndex:f}=J(t,n,o,s,i);if(S(l,f)){const d=u.dataset.color;O(l,f,d),N(document.getElementById(c)),E()}else{const d=H(l,Math.floor(f/a),f%a);if(d){const{row:g,col:m}=d,h=g*a+m,y=u.dataset.color;O(l,h,y),N(document.getElementById(c)),E()}else q(c)}D(),R()}function ve(e,t,n,r,o){const c=document.createElement("div");c.className="dragged-piece",c.style.position="fixed",c.style.pointerEvents="none",c.style.zIndex="1000",c.style.opacity="0.8";const l=document.querySelector(".grid-cell").offsetWidth;c.style.width=`${e[0].length*l}px`,c.style.height=`${e.length*l}px`;const s=we(e,t);return c.appendChild(s),c.dataset.shape=JSON.stringify(e),c.dataset.activeRow=n,c.dataset.activeCol=r,c.dataset.originalId=o,c.dataset.color=t,c}function we(e,t){const n=document.createElement("div");return n.style.display="grid",n.style.width="100%",n.style.height="100%",n.style.gridTemplateColumns=`repeat(${e[0].length}, 1fr)`,n.style.gridTemplateRows=`repeat(${e.length}, 1fr)`,e.forEach(r=>{r.forEach(o=>{const c=document.createElement("div"),l=new B(0,0,w,w).sprite;c.style.backgroundImage=o?`url("${l}")`:"none",c.style.backgroundSize="cover";const s=k(t);c.style.filter=`hue-rotate(${s}deg)`,n.appendChild(c)})}),n}function U(e,t,n,r,o){if(u){const c=JSON.parse(u.dataset.shape);c[0].length*o,c.length*o;const l=(r+.5)*o,s=(n+.5)*o;u.style.left=`${e-l}px`,u.style.top=`${t-s}px`}}function Ee(e,t){if(!u)return;const n=JSON.parse(u.dataset.shape),o=document.getElementById("game-grid-container").getBoundingClientRect();if(e<o.left||e>o.right||t<o.top||t>o.bottom){R();return}const c=parseInt(u.dataset.activeRow),l=parseInt(u.dataset.activeCol),{targetCol:s,targetRow:i,targetIndex:f}=J(e,t,o,c,l);if(R(),S(n,f)){for(let d=0;d<n.length;d++)for(let g=0;g<n[d].length;g++)if(n[d][g]){const m=(i+d)*a+(s+g),h=document.querySelector(`.grid-cell[data-index="${m}"]`);h&&h.classList.add("preview")}}else{const d=H(n,i,s);if(d){const{row:g,col:m}=d;for(let h=0;h<n.length;h++)for(let y=0;y<n[h].length;y++)if(n[h][y]){const F=(g+h)*a+(m+y),T=document.querySelector(`.grid-cell[data-index="${F}"]`);T&&T.classList.add("preview")}}}}function H(e,t,n){const r=Math.max(a-e.length,a-e[0].length);for(let o=1;o<=r;o++)for(let c=-o;c<=o;c++)for(let l=-o;l<=o;l++)if(Math.abs(c)===o||Math.abs(l)===o){const s=t+c,i=n+l,f=s*a+i;if(S(e,f))return{row:s,col:i}}return null}function R(){document.querySelectorAll(".grid-cell.preview").forEach(e=>{e.classList.remove("preview")})}function D(){u&&(u.remove(),u=null)}function q(e){const t=document.getElementById(e);t&&t.classList.remove("dragging")}function Ce(){pe(),he(),ye(),document.getElementById("reset-button").addEventListener("click",ae)}document.addEventListener("DOMContentLoaded",Ce);
