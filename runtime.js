/* VENGLIC RUNTIME */
(function(){
"use strict";
const K={"kty":"EC","x":"Y4yjThkwSTOusrXVYGIBZlt2zuAwmLheh_xE6WJ9Qh0","y":"eP-l3Q34ez69ESif4FqWRu7vouGFQnT0wmH_J8SAhiw","crv":"P-256"};
const F="/data.json";
let ok=false,r=null;

function n(v){
  return String(v||"").trim().toLowerCase()
    .replace(/^https?:\/\//,"")
    .replace(/^www\./,"")
    .split("/")[0].split(":")[0];
}
function b(v){
  const x=atob(v),a=new Uint8Array(x.length);
  for(let i=0;i<x.length;i++)a[i]=x.charCodeAt(i);
  return a;
}
async function run(){
  try{
    const q=await fetch(F+"?v="+Date.now(),{cache:"no-store"});
    if(!q.ok)throw 0;
    r=await q.json();
    if(n(location.hostname)!==n(r.d))throw 0;
    if(!/^\d{4}-\d{2}-\d{2}$/.test(r.e))throw 0;
    const t=new Date(r.e+"T23:59:59.999Z");
    if(Number.isNaN(t.getTime())||Date.now()>t.getTime())throw 0;

    const k=await crypto.subtle.importKey(
      "jwk",K,{name:"ECDSA",namedCurve:"P-256"},false,["verify"]
    );
    const p={v:r.v,d:r.d,e:r.e,i:r.i};
    ok=await crypto.subtle.verify(
      {name:"ECDSA",hash:"SHA-256"},
      k,b(r.signature),
      new TextEncoder().encode(JSON.stringify(p))
    );
    if(!ok)throw 0;
    document.documentElement.classList.add("x-ready");
  }catch(_){ok=false}

  if(!ok){
    document.documentElement.classList.add("x-failed");
  }

  if(!ok){
    return;
  }

}
window.VenglicRuntime={ok:()=>ok,get:()=>r};
if(document.readyState==="loading")
  document.addEventListener("DOMContentLoaded",run);
else run();
})();