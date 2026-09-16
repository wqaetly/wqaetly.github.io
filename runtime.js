"use strict";var AIAssistant=(()=>{var C=Object.defineProperty;var A=(a,o,e)=>o in a?C(a,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[o]=e;var s=(a,o,e)=>A(a,typeof o!="symbol"?o+"":o,e);var c={TOKEN:"token",CITATIONS:"citations",USAGE:"usage",DONE:"done",ERROR:"error"},p={TS:"x-ai-ts",NONCE:"x-ai-nonce",SIGN:"x-ai-sign"};var v=new TextEncoder;function x(a){let o="";for(let t=0;t<a.length;t++)o+=String.fromCharCode(a[t]);return(typeof btoa=="function"?btoa(o):Buffer.from(o).toString("base64")).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function w(a,o,e=Math.floor(Date.now()/1e3),t=T()){let r=await crypto.subtle.importKey("raw",v.encode(a),{name:"HMAC",hash:"SHA-256"},!1,["sign"]),i=v.encode(`${e}.${t}.${o}`),n=await crypto.subtle.sign("HMAC",r,i);return{ts:e,nonce:t,sign:x(new Uint8Array(n))}}function T(a=16){let o=new Uint8Array(a);return crypto.getRandomValues(o),x(o)}var m=class extends Error{constructor(e,t){super(t);s(this,"status",e);this.name="ApiClientError"}};function y(){return globalThis.__AI_ASSISTANT_CONFIG__??null}async function I(a,o){let e=y(),t=new Headers(o);if(!e?.hmacSecret)return t;let{ts:r,nonce:i,sign:n}=await w(e.hmacSecret,a);return t.set(p.TS,String(r)),t.set(p.NONCE,i),t.set(p.SIGN,n),t}function b(){return y()?.endpoint?.replace(/\/+$/,"")??null}async function d(a,o){let e=b();if(!e)throw new m(0,"ai-assistant config missing");let t=await I(a,o?.headers);return o?.body&&!t.has("Content-Type")&&t.set("Content-Type","application/json"),await fetch(e+a,{...o,headers:t})}async function E(a,o){let e=await d(a,o);if(!e.ok){let t=await e.text().catch(()=>"");throw new m(e.status,t.slice(0,300))}return await e.json()}var M=`
<style>
  :host {
    display: block;
    margin: 1.2rem 0;
    font: inherit;
    color: var(--font-color, #333);
    /*
     * \u4E3B\u9898\u8272\u8C03\uFF1A\u56DB\u4E2A\u505C\u6B62\u70B9\uFF0C\u6784\u6210\u67D4\u548C\u5F69\u8679\uFF08\u7D2B \u2192 \u84DD \u2192 \u9752 \u2192 \u7C89 \u2192 \u7D2B\u95ED\u73AF\uFF09\u3002
     * alpha 0.6 \u662F\u5927\u91CF\u8BD5\u9A8C\u540E\u7684\u6298\u4E2D\uFF1A\u6697\u8272\u80CC\u666F\u4E0B\u4E0D\u523A\u773C\uFF0C\u4EAE\u8272\u80CC\u666F\u4E0B\u4E0D\u53D1\u7070\u3002
     * \u4E0E\u5DE6\u4E0B\u89D2 <ai-chat-panel> \u7684 FAB \u5171\u7528\u540C\u4E00\u5957\u8C03\u8272\uFF0C\u4FDD\u8BC1"AI \u5165\u53E3/AI \u5185\u5BB9"
     * \u4E00\u773C\u5C31\u662F\u540C\u4E00\u79CD\u89C6\u89C9\u8BED\u8A00\u3002
     */
    --ai-flow-c1: rgba(139,  92, 246, .60); /* violet-500 */
    --ai-flow-c2: rgba( 59, 130, 246, .60); /* blue-500   */
    --ai-flow-c3: rgba( 34, 211, 238, .60); /* cyan-400   */
    --ai-flow-c4: rgba(236,  72, 153, .60); /* pink-500   */
  }

  /*
   * ============================================================
   * \u4E0E\u5DE6\u4E0B\u89D2 FAB \u5B8C\u5168\u5BF9\u9F50\u7684\u89C6\u89C9\u8BED\u8A00\uFF08\u91CD\u6784\u7248\uFF09
   * ------------------------------------------------------------
   * \u8BBE\u8BA1\u8981\u70B9\uFF08\u4ECE chat-panel.ts \u7684 .fab-glow \u76F4\u63A5\u590D\u7528\uFF09\uFF1A
   *   1) \u5BB9\u5668 overflow:hidden \u2014\u2014 \u4E25\u683C\u5173\u4F4F\u63CF\u8FB9\u5C42\u65CB\u8F6C\u65F6\u53EF\u80FD\u6F0F\u51FA\u7684\u5BF9\u89D2\u5F69\u5E26\uFF1B
   *   2) \u63CF\u8FB9\u5C42 ::before\uFF1Ainset:-2px + conic-gradient + mask \u9542\u7A7A\u4E2D\u5FC3\uFF0C
   *      \u7528 transform:rotate \u65CB\u8F6C\u4F2A\u5143\u7D20\u672C\u8EAB\uFF0C\u800C\u4E0D\u662F\u65CB\u8F6C\u89D2\u5EA6\u53D8\u91CF\u3002
   *      transform \u65CB\u8F6C\u8D70 GPU \u5408\u6210\uFF0C\u8001\u6D4F\u89C8\u5668\u517C\u5BB9\u4E5F\u597D\uFF08\u4E0D\u4F9D\u8D56 @property\uFF09\u3002
   *   3) \u5916\u5149\u6655\u7528 box-shadow \u591A\u91CD\u67D4\u5149\u547C\u5438\uFF08c1~c4 \u56DB\u505C\u6B62\u70B9\uFF09\uFF0C
   *      \u4E0D\u53C2\u4E0E overflow \u88C1\u526A\uFF0C\u5B89\u5168\u4E0D\u5916\u6CC4\uFF1B
   *   4) hover \u5FAE\u5FAE\u7F29\u653E + \u5149\u6655\u52A0\u5F3A\uFF0C\u547C\u5E94 FAB \u7684"\u53EF\u4EA4\u4E92"\u6697\u793A\uFF1B
   *   5) \u6807\u9898\u65C1\u52A0\u4E00\u9897 ::before \u547C\u5438\u5F69\u70B9\uFF0C\u547C\u5E94 FAB \u5929\u7EBF\u706F\u3002
   *
   * \u4E09\u5C42\u7ED3\u6784\uFF08\u4E0E .fab-glow \u5BF9\u5E94\uFF09\uFF1A
   *   .glow            \u2014\u2014 \u5361\u7247\u5916\u58F3\uFF1Aoverflow:hidden + box-shadow \u547C\u5438\u5149\u6655
   *   .glow::before    \u2014\u2014 \u63CF\u8FB9\u5C42\uFF1Aconic-gradient + mask \u9542\u7A7A + \u81EA\u8EAB rotate
   *   .card            \u2014\u2014 \u5185\u5BB9\u5C42\uFF1A\u5B9E\u8272\u80CC\u666F\uFF0C\u627F\u8F7D\u6587\u5B57
   * ============================================================
   */
  .glow {
    position: relative;
    border-radius: 16px;
    overflow: hidden;                              /* \u4E0E FAB \u540C\u6B3E\uFF1A\u515C\u4F4F\u63CF\u8FB9\u5C42 */
    transition: transform .2s ease;
    will-change: transform, box-shadow;
    /* box-shadow \u591A\u91CD\u67D4\u5149\u547C\u5438\uFF1A\u4E0E FAB \u7684 ai-fab-glow \u540C\u4E00\u5957\u8272\u5E8F\uFF0C
       \u53EA\u662F blur/spread \u66F4\u5927\uFF0C\u5339\u914D\u5361\u7247\u66F4\u5BBD\u7684\u89C6\u89C9\u4F53\u91CF\u3002 */
    animation: ai-summary-glow 5s ease-in-out infinite;
  }
  .glow:hover {
    transform: translateY(-1px);                   /* \u8F7B\u5FAE\u62AC\u8D77\uFF0C\u6697\u793A\u53EF\u4EA4\u4E92 */
  }

  /*
   * \u63CF\u8FB9\u5C42\uFF1A\u5F69\u8272\u73AF\u5E26\uFF0C\u81EA\u8EAB\u65CB\u8F6C\u3002
   *   - inset:-2px\uFF1A\u6BD4\u5BB9\u5668\u7565\u5927\uFF0C\u907F\u514D\u65CB\u8F6C\u5230 45\xB0 \u65F6\u56DB\u89D2\u9732\u767D\uFF1B
   *   - mask \u5C45\u4E2D\u9542\u7A7A\uFF0C\u4FDD\u7559 1.6px \u7684\u8FB9\u7F18\u73AF\u5E26\uFF08\u5361\u7247\u66F4\u5BBD\uFF0C\u6BD4 FAB \u7684 1.8px \u7565\u7EC6\u66F4\u514B\u5236\uFF09\uFF1B
   *   - transform: rotate \u7531 keyframes \u9A71\u52A8\uFF0C\u51E0\u4F55\u5728 GPU \u5408\u6210\u5C42\u65CB\u8F6C\uFF0C
   *     \u63CF\u8FB9\u6C38\u4E0D\u6296\u52A8\uFF0C\u4E5F\u65E0\u9700 @property \u6CE8\u518C\u89D2\u5EA6\u53D8\u91CF\u3002
   */
  .glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: conic-gradient(
      var(--ai-flow-c1),
      var(--ai-flow-c2),
      var(--ai-flow-c3),
      var(--ai-flow-c4),
      var(--ai-flow-c1)
    );
    animation: ai-flow-spin 6s linear infinite;
    pointer-events: none;
    z-index: 0;
    --ai-border: 1.6px;                            /* \u63CF\u8FB9\u7C97\u7EC6\uFF0C\u5355\u70B9\u7EF4\u62A4 */
    -webkit-mask:
      linear-gradient(#000 0 0) center / calc(100% - var(--ai-border) * 2) calc(100% - var(--ai-border) * 2) no-repeat,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;                   /* Safari \u8001\u8BED\u6CD5 */
            mask:
      linear-gradient(#000 0 0) center / calc(100% - var(--ai-border) * 2) calc(100% - var(--ai-border) * 2) no-repeat,
      linear-gradient(#000 0 0);
            mask-composite: exclude;               /* \u6807\u51C6\u8BED\u6CD5 */
  }

  /*
   * \u65CB\u8F6C\u5173\u952E\u5E27\uFF1A6s \u4E00\u5468\uFF0C\u4E0E FAB \u7684 ai-flow-spin \u540C\u901F\u540C\u65B9\u5411\uFF0C
   * \u89C6\u89C9\u4E0A\u50CF"\u540C\u4E00\u675F\u5149"\u73AF\u7ED5\u5728 AI \u5165\u53E3\u548C AI \u5185\u5BB9\u4E0A\u3002
   */
  @keyframes ai-flow-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /*
   * box-shadow \u591A\u91CD\u67D4\u5149\u547C\u5438\uFF1A\u4E0E FAB \u7684 ai-fab-glow \u5B8C\u5168\u540C\u6784\uFF0C
   * \u53EA\u662F blur/spread \u653E\u5927\u4E00\u6863\uFF08\u5361\u7247\u89C6\u89C9\u4F53\u91CF\u66F4\u5927\uFF0C\u8981\u66F4\u67D4\u66F4\u6269\u6563\uFF09\u3002
   * 0% / 100% \u4E0E 50% \u4E4B\u95F4\u5F80\u590D\uFF0C\u989C\u8272\u987A\u5E8F\u8F6E\u6362 \u2192 \u6574\u5F20\u5361\u50CF\u4E00\u56E2\u547C\u5438\u7684\u6C1B\u56F4\u5149\u3002
   */
  @keyframes ai-summary-glow {
    0%, 100% {
      box-shadow:
         0  0   14px -4px var(--ai-flow-c1),
         0  0   22px -4px var(--ai-flow-c2),
         0  4px 30px -6px var(--ai-flow-c3),
         0  6px 38px -8px var(--ai-flow-c4);
    }
    50% {
      box-shadow:
         0  0   22px -4px var(--ai-flow-c2),
         0  0   32px -4px var(--ai-flow-c3),
         0  4px 42px -6px var(--ai-flow-c4),
         0  6px 52px -8px var(--ai-flow-c1);
    }
  }

  .card {
    position: relative;
    z-index: 1;                                    /* \u5728\u63CF\u8FB9\u5C42\u4E4B\u4E0A\uFF0C\u627F\u8F7D\u6587\u5B57 */
    /*
     * \u5185\u5BB9\u5C42\u80CC\u666F\u4F7F\u7528 Butterfly \u5361\u7247\u8272\uFF0C\u5E76\u53E0\u4E00\u5C42\u4ECE\u5DE6\u4E0A\u5230\u53F3\u4E0B\u7684\u6781\u6DE1\u6E10\u53D8\uFF0C
     * \u8BA9\u5361\u7247\u5728\u4EAE\u8272\u4E3B\u9898\u4E0B\u4E5F\u6709"\u5149\u4ECE\u5DE6\u4E0A\u626B\u8FC7"\u7684\u5FAE\u5999\u5C42\u6B21\uFF08\u4E0E FAB \u5706\u89D2\u65B9\u5757\u7684
     * \u5B9E\u8272\u9762\u76F8\u6BD4\uFF0C\u5361\u7247\u4F53\u91CF\u5927\uFF0C\u9700\u8981\u4E00\u70B9\u7EB5\u6DF1\u611F\u624D\u4E0D\u663E\u5355\u8C03\uFF09\u3002
     */
    background:
      linear-gradient(135deg, rgba(139, 92, 246, .04) 0%, rgba(34, 211, 238, .04) 100%),
      var(--card-bg, rgba(255, 255, 255, .92));
    border-radius: 14px;                           /* \u4E0E .glow \u7684 16px - \u63CF\u8FB9 1.6*2 \u2248 12.8\uFF0C\u53D6 14 \u7565\u5706\u6DA6 */
    padding: 1.1rem 1.3rem;
  }

  /*
   * \u6807\u9898\uFF1A
   *   - \u52A0\u4E00\u9897 .dot \u547C\u5438\u5F69\u70B9\uFF0C\u4E0E FAB \u7684\u5929\u7EBF\u706F\u8282\u594F\u4E00\u81F4\uFF08\u900F\u660E\u5EA6\u547C\u5438\uFF09\uFF1B
   *   - \u6E10\u53D8\u6587\u5B57\uFF08\u80CC\u666F\u88C1\u526A\uFF09\u8BA9"AI \u6458\u8981"\u56DB\u5B57\u672C\u8EAB\u5C31\u662F\u4E00\u62B9\u5F69\u8679\uFF0C
   *     \u4E0E\u5916\u5708\u63CF\u8FB9\u8272\u57DF\u540C\u6E90\uFF0C\u5F3A\u5316"\u8FD9\u662F AI \u5185\u5BB9"\u7684\u8BED\u4E49\u3002
   */
  .card h4 {
    margin: 0 0 .65rem;
    font-size: 1rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: .5rem;
    letter-spacing: .02em;
  }
  .card h4 .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: conic-gradient(
      var(--ai-flow-c1),
      var(--ai-flow-c2),
      var(--ai-flow-c3),
      var(--ai-flow-c4),
      var(--ai-flow-c1)
    );
    animation: ai-summary-dot 1.6s ease-in-out infinite;
    flex-shrink: 0;
  }
  .card h4 .label {
    background: linear-gradient(
      90deg,
      rgb(139,  92, 246),
      rgb( 59, 130, 246),
      rgb( 34, 211, 238),
      rgb(236,  72, 153)
    );
    -webkit-background-clip: text;
            background-clip: text;
    -webkit-text-fill-color: transparent;
            color: transparent;
  }
  @keyframes ai-summary-dot {
    0%, 100% { opacity: .4; transform: scale(1);   }
    50%      { opacity: 1;  transform: scale(1.15); }
  }

  .text {
    line-height: 1.85;
    white-space: pre-wrap;
    min-height: 2em;
    font-size: .95rem;
  }
  .meta {
    margin-top: .75rem;
    padding-top: .5rem;
    border-top: 1px dashed var(--card-border-color, rgba(0, 0, 0, .08));
    font-size: .75rem;
    opacity: .55;
    letter-spacing: .02em;
  }

  /*
   * \u6697\u8272\u6A21\u5F0F\uFF1AButterfly \u7684 --card-bg \u5DF2\u4F1A\u5207\u5230\u6DF1\u8272\uFF1B\u8FD9\u91CC\u518D\u538B\u4E00\u6863\u5361\u7247\u80CC\u666F\u53E0\u52A0\u5C42\uFF0C
   * \u8BA9\u6E10\u53D8\u4E0D\u4F1A\u5728\u6DF1\u8272\u5E95\u4E0A\u663E\u5F97\u8FC7\u4EAE\uFF1B\u540C\u65F6\u5149\u6655\u7565\u5FAE\u63D0\u4EAE\u4EE5\u4FDD\u6301"\u53D1\u5149\u611F"\u3002
   */
  @media (prefers-color-scheme: dark) {
    .card {
      background:
        linear-gradient(135deg, rgba(139, 92, 246, .08) 0%, rgba(34, 211, 238, .08) 100%),
        var(--card-bg, rgba(30, 30, 35, .85));
    }
  }

  /*
   * \u5C0A\u91CD\u65E0\u969C\u788D\uFF1A\u51CF\u5C11\u52A8\u6548\u504F\u597D\u4E0B\uFF0C\u505C\u6389\u65CB\u8F6C / \u547C\u5438 / \u5F69\u70B9\u95EA\u70C1\uFF0C
   * \u4F46\u4FDD\u7559\u9759\u6001\u5F69\u8272\u63CF\u8FB9 + \u4E00\u5C42\u67D4\u5149\uFF0C\u8BA9\u7528\u6237\u4ECD\u80FD\u770B\u5230"\u8FD9\u5F20\u5361\u548C\u5DE6\u4E0B\u89D2\u5165\u53E3\u662F\u4E00\u5957"\u3002
   */
  @media (prefers-reduced-motion: reduce) {
    .glow {
      animation: none;
      box-shadow:
         0 0 18px -4px var(--ai-flow-c2),
         0 0 28px -4px var(--ai-flow-c4);
    }
    .glow::before    { animation: none; }
    .card h4 .dot    { animation: none; opacity: .8; }
  }

  :host([hidden]) { display: none; }
</style>
<div class="glow">
  <div class="card">
    <h4><span class="dot"></span><span class="label">AI \u6458\u8981</span></h4>
    <div class="text" id="text"></div>
    <div class="meta" id="meta"></div>
  </div>
</div>
`,f=class extends HTMLElement{constructor(){super(...arguments);s(this,"textEl");s(this,"metaEl")}connectedCallback(){let e=this.attachShadow({mode:"open"});e.innerHTML=M,this.textEl=e.getElementById("text"),this.metaEl=e.getElementById("meta"),this.load()}async load(){let e=this.getAttribute("post-id");if(!e){this.hidden=!0;return}try{let t=await E(`/api/summary/${encodeURIComponent(e)}`);this.typewrite(t.text),this.metaEl.textContent=`model: ${t.model}`}catch{this.hidden=!0}}typewrite(e){let t=0,r=()=>{if(t>=e.length)return;let i=Math.min(3,e.length-t);this.textEl.textContent=e.slice(0,t+i),t+=i,requestAnimationFrame(r)};r()}};customElements.define("ai-summary-card",f);var L=`
<style>
  :host { display:block; margin:1rem 0; }
  .wrap {
    background: var(--card-bg, rgba(255,255,255,.6));
    border: 1px solid var(--card-border-color, rgba(0,0,0,.08));
    border-radius: 12px; padding: .9rem 1rem;
  }
  .tabs { display:flex; gap:.5rem; margin-bottom:.6rem; }
  button { cursor:pointer; border:none; background:transparent;
           color: var(--font-color,#333); padding:.3rem .8rem; border-radius:8px;
           font-size:.9rem; }
  button.active { background: var(--theme-color, #4c91f7); color:#fff; }
  audio { width: 100%; }
  :host([hidden]) { display:none; }
</style>
<div class="wrap">
  <div class="tabs">
    <button data-mode="narration" class="active">\u{1F50A} \u6717\u8BFB</button>
    <button data-mode="podcast">\u{1F399} \u64AD\u5BA2</button>
  </div>
  <audio id="player" controls preload="none"></audio>
</div>
`,u=class extends HTMLElement{constructor(){super(...arguments);s(this,"audioEl");s(this,"tabs");s(this,"available",{narration:!1,podcast:!1});s(this,"currentMode","narration")}connectedCallback(){let e=this.attachShadow({mode:"open"});e.innerHTML=L,this.audioEl=e.getElementById("player"),this.tabs=e.querySelectorAll("button"),this.tabs.forEach(t=>t.addEventListener("click",()=>this.switchTo(t.dataset.mode))),this.probeAndInit(),this.setupMediaSession()}async probeAndInit(){let e=this.getAttribute("post-id");if(!e){this.hidden=!0;return}if(await Promise.all([this.probe(e,"narration"),this.probe(e,"podcast")]),!this.available.narration&&!this.available.podcast){this.hidden=!0;return}this.tabs.forEach(r=>{let i=r.dataset.mode;this.available[i]||(r.style.display="none")});let t=this.available.narration?"narration":"podcast";this.switchTo(t)}async probe(e,t){try{let r=await d(`/api/audio/${encodeURIComponent(e)}?type=${t}`,{method:"GET",headers:{Range:"bytes=0-0"}});this.available[t]=r.ok||r.status===206}catch{this.available[t]=!1}}switchTo(e){if(!this.available[e])return;this.currentMode=e,this.tabs.forEach(i=>i.classList.toggle("active",i.dataset.mode===e));let t=this.getAttribute("post-id"),r=b();!t||!r||this.fetchAsBlob(t,e)}async fetchAsBlob(e,t){try{let r=await d(`/api/audio/${encodeURIComponent(e)}?type=${t}`);if(!r.ok){this.available[t]=!1;return}let i=await r.blob(),n=URL.createObjectURL(i);this.audioEl.src=n}catch{}}setupMediaSession(){"mediaSession"in navigator&&this.audioEl.addEventListener("play",()=>{navigator.mediaSession.metadata=new MediaMetadata({title:document.title,artist:this.currentMode==="narration"?"\u6717\u8BFB":"\u64AD\u5BA2"})})}};customElements.define("ai-audio-player",u);async function*H(a){let o=new TextDecoder("utf-8"),e="";for(;;){let{value:t,done:r}=await a.read();if(r)break;e+=o.decode(t,{stream:!0});let i;for(;(i=e.indexOf(`

`))>=0;){let n=e.slice(0,i);e=e.slice(i+2);let l=R(n);l&&(yield l)}}}function R(a){let o="message",e="";for(let t of a.split(`
`))t.startsWith("event:")?o=t.slice(6).trim():t.startsWith("data:")&&(e+=(e?`
`:"")+t.slice(5).trimStart());return!e&&o==="message"?null:{event:o,data:e}}async function*k(a,o,e){let t=await d(a,{method:"POST",body:JSON.stringify(o),headers:{Accept:"text/event-stream"},signal:e});if(!t.ok||!t.body){let i=t.body?await t.text().catch(()=>""):"";throw new Error(`SSE HTTP ${t.status}: ${i.slice(0,200)}`)}let r=t.body.getReader();try{for await(let i of H(r))yield i}finally{try{await r.cancel()}catch{}}}var B=`
<style>
  :host {
    position: fixed; left: 20px; bottom: 20px; z-index: 9999;
    font: 14px/1.55 inherit;
    --ai-accent: var(--theme-color, #4c91f7);
    --ai-bg: var(--card-bg, #fff);
    --ai-fg: var(--font-color, #333);
    --ai-border: var(--card-border-color, rgba(0, 0, 0, .1));
    --ai-muted: rgba(0, 0, 0, .04);

    /*
     * \u4E0E <ai-summary-card> \u540C\u6B3E\u4E3B\u9898\u8272\uFF1A\u56DB\u505C\u6B62\u70B9\u7684\u67D4\u548C\u5F69\u8679\u73AF\uFF0C
     * alpha 0.6 \u5728\u4EAE/\u6697\u80CC\u666F\u4E0B\u90FD\u4E0D\u523A\u773C\u3002FAB \u7684\u63CF\u8FB9\u5149\u6655\u76F4\u63A5\u590D\u7528\u8FD9\u5957\u8C03\u8272\u3002
     */
    --ai-flow-c1: rgba(139,  92, 246, .60); /* violet-500 */
    --ai-flow-c2: rgba( 59, 130, 246, .60); /* blue-500   */
    --ai-flow-c3: rgba( 34, 211, 238, .60); /* cyan-400   */
    --ai-flow-c4: rgba(236,  72, 153, .60); /* pink-500   */
  }

  /*
   * ============================================================
   * FAB\uFF08\u673A\u5668\u4EBA\u5934\uFF09
   * ------------------------------------------------------------
   * \u8BBE\u8BA1\u76EE\u6807\uFF1A\u7B2C\u4E00\u773C"\u53EF\u7231"\uFF0C\u8BA9\u7528\u6237\u4E3B\u52A8\u70B9\u3002\u4E09\u4EF6\u4E8B\uFF1A
   *   1) \u5706\u89D2\u65B9\u8138 + \u5929\u7EBF + \u53CC\u773C + \u5634 \u2014\u2014 \u9AD8\u8FA8\u8BC6\u5EA6\u7684\u5409\u7965\u7269\u5F62\u8C61\u3002
   *   2) \u5FAE\u52A8\u753B\uFF1A\u8EAB\u4F53\u4E0A\u4E0B\u6F02\u6D6E\u3001\u773C\u775B\u5468\u671F\u6027\u7728\u3001\u5929\u7EBF\u706F\u547C\u5438\u95EA\u70C1\uFF0C
   *      \u6697\u793A"\u5B83\u662F\u6D3B\u7684"\uFF0C\u800C\u4E0D\u662F\u4E00\u4E2A\u9759\u6001\u56FE\u6807\u3002
   *   3) \u5F69\u8272\u73AF\u5E26\u5149\u6655\uFF1A\u4E0E\u6B63\u6587\u91CC\u7684 <ai-summary-card> \u540C\u6B3E conic-gradient\uFF0C
   *      \u7528 mask \u9542\u7A7A\u4E2D\u5FC3\u53EA\u7559 1.5px \u8FB9\u7F18\u73AF\u5E26\uFF1B\u5916\u5C42\u518D\u53E0 blur \u5149\u6655\u547C\u5438\u3002
   *      \u2014\u2014 \u89C6\u89C9\u98CE\u683C\u7EDF\u4E00\uFF1A\u6458\u8981\u6846\u548C\u5165\u53E3\u6309\u94AE\u4E00\u773C\u662F"\u540C\u4E00\u5957 AI \u4F53\u9A8C"\u3002
   *
   * \u53CC\u5C42\u7ED3\u6784\uFF08\u5916\u6EA2\u5149\u6655\u6362\u6210 box-shadow \u5B9E\u73B0\uFF09\uFF1A
   *   .fab-glow         \u2014\u2014  \u5916\u58F3\uFF1A\u5B9A\u5C3A\u5BF8 + overflow:hidden\uFF0C\u5173\u4F4F\u63CF\u8FB9\u5C42\uFF1B\u81EA\u8EAB\u7528 box-shadow \u591A\u91CD\u67D4\u5149\u627F\u8F7D"\u5149\u6655"
   *   .fab-glow::before \u2014\u2014  \u63CF\u8FB9\u5C42\uFF1Afull conic-gradient + mask \u9542\u7A7A\u4E2D\u5FC3
   *   .fab              \u2014\u2014  \u673A\u5668\u4EBA\u672C\u4F53\uFF1A\u900F\u660E\u80CC\u666F\uFF0C\u627F\u8F7D SVG
   * ============================================================
   */
  /*
   * .fab-glow \u5BB9\u5668\uFF1A
   *  - \u5173\u952E\uFF1Aoverflow: hidden \u2014\u2014 \u4E25\u683C\u5173\u4F4F ::before \u7684 conic-gradient\uFF0C
   *    \u9632\u6B62\u65CB\u8F6C/\u653E\u5927\u65F6\u6F0F\u51FA"\u5BF9\u89D2\u7EBF\u5F69\u8272\u5149\u5E26"\u626B\u904D\u5168\u9875\uFF08\u4E0A\u4E00\u7248\u8E29\u8FC7\u7684\u5751\uFF09\u3002
   *  - \u5916\u5149\u6655\u4E0D\u518D\u7528 ::after \u6EA2\u51FA\u5B9E\u73B0\uFF08\u90A3\u6837\u8981\u4E48\u88AB overflow: hidden \u88C1\u6389\uFF0C
   *    \u8981\u4E48\u4E0D\u88C1\u5C31\u91CD\u8E48\u8986\u8F99\uFF09\uFF0C\u6539\u7528\u672C\u5143\u7D20 box-shadow \u7684\u591A\u91CD\u67D4\u5149\u5C42\u53E0 + \u547C\u5438\uFF1A
   *    box-shadow \u4E0D\u53C2\u4E0E overflow \u88C1\u526A\uFF0C\u5929\u7136\u5B89\u5168\uFF1B\u591A\u91CD\u5F69\u8272 shadow \u53E0\u51FA
   *    \u4E0E conic-gradient \u540C\u8272\u8C03\u7684\u6C1B\u56F4\u5149\uFF0C\u89C6\u89C9\u4E0A\u548C summary-card \u4ECD\u7EDF\u4E00\u3002
   */
  .fab-glow {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    /* \u6F02\u6D6E + \u591A\u8272\u5149\u6655\u547C\u5438\uFF1A\u4E24\u4E2A\u52A8\u753B\u5E76\u884C */
    animation:
      ai-fab-float 3.6s ease-in-out infinite,
      ai-fab-glow  4s   ease-in-out infinite;
    transition: transform .15s ease;
    will-change: transform, box-shadow;
  }
  .fab-glow:hover { transform: scale(1.06); }
  .fab-glow:active { transform: scale(.94); }

  /*
   * \u63CF\u8FB9\u5C42\uFF08\u5F69\u8272\u73AF\u5E26\uFF09\uFF1A
   *  - inset:0 + \u6BD4\u5BB9\u5668\u7565\u5927\u7684 -2px \u8FB9\u7F18\uFF0C\u907F\u514D\u65CB\u8F6C\u65F6\u56DB\u89D2\u9732\u767D\uFF1B
   *  - mask \u9542\u7A7A\u4E2D\u5FC3\u53EA\u7559 1.8px \u63CF\u8FB9\uFF1B
   *  - \u7528 ai-flow-spin \u65CB\u8F6C\u4F2A\u5143\u7D20\u672C\u8EAB\uFF0C\u800C\u975E\u65CB\u8F6C conic-gradient \u7684\u89D2\u5EA6\uFF0C
   *    transform \u65CB\u8F6C\u7684\u5408\u6210\u66F4\u7A33\uFF0C\u4E5F\u4E0D\u4F1A\u89E6\u53D1 layout\u3002
   *  - \u7236\u7EA7 overflow:hidden \u515C\u5E95\uFF0C\u5373\u4F7F mask \u5728\u67D0\u6D4F\u89C8\u5668\u8868\u73B0\u5F02\u5E38\u4E5F\u4E0D\u4F1A\u6F0F\u5230\u9875\u9762\u3002
   */
  .fab-glow::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: conic-gradient(
      var(--ai-flow-c1),
      var(--ai-flow-c2),
      var(--ai-flow-c3),
      var(--ai-flow-c4),
      var(--ai-flow-c1)
    );
    animation: ai-flow-spin 6s linear infinite;
    pointer-events: none;
    z-index: 0;
    --ai-fab-border: 1.8px;
    -webkit-mask:
      linear-gradient(#000 0 0) center / calc(100% - var(--ai-fab-border) * 2) calc(100% - var(--ai-fab-border) * 2) no-repeat,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
            mask:
      linear-gradient(#000 0 0) center / calc(100% - var(--ai-fab-border) * 2) calc(100% - var(--ai-fab-border) * 2) no-repeat,
      linear-gradient(#000 0 0);
            mask-composite: exclude;
  }

  .fab {
    position: relative;
    z-index: 1;
    width: 100%; height: 100%;
    border-radius: 16px;
    background: var(--ai-bg);
    display: flex; align-items: center; justify-content: center;
  }

  /*
   * \u673A\u5668\u4EBA SVG \u5185\u90E8\u5404\u96F6\u4EF6\u7528 class \u6807\u8BB0\uFF0CCSS \u5355\u72EC\u9A71\u52A8\u52A8\u753B\uFF1A
   *   .robot-eye   \u2014\u2014 \u773C\u775B\uFF1AscaleY \u5468\u671F\u6027\u538B\u6241\u6A21\u62DF\u7728\u773C
   *   .robot-antenna-dot \u2014\u2014 \u5929\u7EBF\u706F\uFF1Aopacity \u547C\u5438\u95EA\u70C1
   * \u7528 transform-origin: center \u8BA9 scaleY \u4ECE\u773C\u775B\u4E2D\u5FC3\u6536\u7F29\uFF0C\u66F4\u50CF\u7728\u773C\u3002
   */
  .robot { width: 36px; height: 36px; display: block; }
  .robot-eye {
    transform-origin: center;
    animation: ai-robot-blink 4.2s ease-in-out infinite;
  }
  .robot-antenna-dot {
    transform-origin: center;
    animation: ai-robot-antenna 1.6s ease-in-out infinite;
  }

  @keyframes ai-fab-float {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }
  /*
   * \u7728\u773C\uFF1A99% \u65F6\u95F4\u7741\u773C\uFF08scaleY 1\uFF09\uFF0C\u6700\u540E 1% \u77AC\u95F4\u95ED\u5408\uFF08scaleY .1\uFF09\u3002
   * \u8FD9\u6837\u7684"\u957F\u7741\u77ED\u95ED"\u5206\u5E03\u6700\u50CF\u771F\u5B9E\u7728\u773C\uFF0C\u907F\u514D\u89C2\u611F"\u673A\u5668\u626B\u63CF"\u3002
   */
  @keyframes ai-robot-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    95%, 97%      { transform: scaleY(.1); }
  }
  @keyframes ai-robot-antenna {
    0%, 100% { opacity: .35; }
    50%      { opacity: 1; }
  }
  @keyframes ai-flow-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  /*
   * box-shadow \u591A\u91CD\u67D4\u5149\u547C\u5438\uFF1A\u7528 4 \u4E2A\u505C\u6B62\u70B9\u5BF9\u5E94 c1~c4\uFF0C\u8DDF\u63CF\u8FB9\u73AF\u989C\u8272\u540C\u6E90\u3002
   * \u6BCF\u4E2A shadow \u7528 0 0 <blur> <spread> color\uFF1A
   *  - blur \u51B3\u5B9A\u5149\u6655\u6269\u6563\u8303\u56F4
   *  - spread \u51B3\u5B9A\u5149\u6655"\u5B9E\u82AF"\u534A\u5F84\uFF0C\u7ED9 -4 \u8BA9\u5B83\u5411\u5185\u6536\u4E00\u70B9\uFF0C\u66F4\u805A\u7126
   * \u5173\u952E\u503C\u5728 0% / 100% \u95F4\u5F80\u590D\uFF0C\u914D\u5408 box-shadow \u7684\u989C\u8272\u987A\u5E8F\u8F6E\u6362\uFF0C
   * \u770B\u8D77\u6765\u50CF\u4E00\u56E2\u547C\u5438\u7684\u5F69\u8272\u6C1B\u56F4\u5149\uFF0C\u53C8\u5B8C\u5168\u4E0D\u4F1A\u6EA2\u51FA\u5230\u9875\u9762\u5176\u5B83\u5730\u65B9\u3002
   */
  @keyframes ai-fab-glow {
    0%, 100% {
      box-shadow:
         0 0  8px -2px var(--ai-flow-c1),
         0 0 14px -2px var(--ai-flow-c2),
         0 0 18px -2px var(--ai-flow-c3),
         0 0 22px -2px var(--ai-flow-c4);
    }
    50% {
      box-shadow:
         0 0 14px -2px var(--ai-flow-c2),
         0 0 20px -2px var(--ai-flow-c3),
         0 0 26px -2px var(--ai-flow-c4),
         0 0 32px -2px var(--ai-flow-c1);
    }
  }

  /* \u6253\u5F00\u72B6\u6001\u65F6\u6309\u94AE\u6DE1\u5316\uFF0C\u628A\u89C6\u89C9\u7126\u70B9\u8BA9\u7ED9\u9762\u677F */
  :host([open]) .fab-glow { opacity: .82; }

  /*
   * ============================================================
   * \u5BF9\u8BDD\u9762\u677F
   * ------------------------------------------------------------
   * \u9700\u6C42\uFF1A
   *   1) \u5BBD\u5EA6\u66F4\u5BBD\uFF0C\u4F46\u4E0D\u8986\u76D6\u6587\u7AE0\u6B63\u6587\uFF1A\u56FA\u5B9A min(440px, calc(100vw - 40px))\u3002
   *      Butterfly \u6B63\u6587\u5BB9\u5668\u5728\u684C\u9762\u7AEF\u901A\u5E38\u5C45\u4E2D\u5BBD\u5EA6 ~1000px\uFF0C\u5DE6\u4FA7\u6709\u5927\u91CF\u7559\u767D\uFF0C
   *      440px \u7684\u5DE6\u4E0B\u62BD\u5C49\u521A\u597D\u843D\u5728\u6B63\u6587\u4E4B\u5916\uFF1B\u7A84\u5C4F (<480px) \u81EA\u52A8\u56DE\u843D\u5230 100vw-40\u3002
   *   2) \u9AD8\u5EA6\u94FA\u6EE1\uFF1Atop:20px / bottom:80px\uFF08\u7ED9 FAB \u7559\u51FA 56+24 \u7684\u4F4D\u7F6E\uFF09\uFF0C
   *      \u8FD9\u6837\u9762\u677F\u4ECE\u9876\u5230\u5E95\u8D2F\u7A7F\uFF0C\u7528\u6237\u89C6\u7EBF\u626B\u8FC7\u6574\u5217\u5BF9\u8BDD\u4E0D\u9700\u8981\u5185\u90E8\u6EDA\u592A\u591A\u3002
   *
   * \u6CE8\u610F\uFF1A\u4E4B\u524D\u7528 absolute + bottom:56px \u662F\u76F8\u5BF9 :host \u7684\uFF0C\u65B0\u65B9\u6848\u6539\u6210 fixed\uFF0C
   * \u56E0\u4E3A :host \u81EA\u8EAB\u53EA\u5360 56\xD756 \u533A\u57DF\uFF0Cabsolute \u6491\u4E0D\u51FA\u5168\u5C4F\u9AD8\u5EA6\u3002
   * ============================================================
   */
  .panel {
    position: fixed;
    left: 20px;
    top: 20px;
    bottom: 96px;                                  /* \u7ED9 56px FAB + \u95F4\u8DDD\u7559\u4F4D */
    width: min(440px, calc(100vw - 40px));
    background: var(--ai-bg); color: var(--ai-fg);
    border: 1px solid var(--ai-border); border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, .12);
    display: none; flex-direction: column; overflow: hidden;
  }
  :host([open]) .panel { display: flex; }
  header {
    padding: .65rem .85rem; border-bottom: 1px solid var(--ai-border);
    display: flex; align-items: center; gap: .5rem; font-weight: 500;
  }
  header .title { display: flex; align-items: center; gap: .35rem; }
  header .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--ai-accent);
  }
  header select {
    margin-left: auto; background: transparent; border: 1px solid var(--ai-border);
    border-radius: 4px; padding: .15rem .35rem; color: inherit;
    font-size: .82rem; outline: none;
  }
  .msgs { flex: 1; overflow-y: auto; padding: .9rem 1rem; }
  .msgs::-webkit-scrollbar { width: 6px; }
  .msgs::-webkit-scrollbar-thumb { background: var(--ai-border); border-radius: 3px; }
  .msg { margin: .4rem 0; white-space: pre-wrap; word-break: break-word; }
  .msg.u { text-align: right; }
  .msg .bubble {
    display: inline-block; padding: .45rem .7rem; border-radius: 8px;
    max-width: 92%; line-height: 1.6;
  }
  .msg.u .bubble { background: var(--ai-accent); color: #fff; }
  .msg.a .bubble { background: var(--ai-muted); }
  .cites { display: flex; flex-wrap: wrap; gap: .3rem; margin: .25rem 0 .6rem; font-size: .78rem; }
  .cites a {
    background: transparent; border: 1px solid var(--ai-border);
    padding: .1rem .45rem; border-radius: 4px;
    text-decoration: none; color: inherit; transition: background .15s ease;
  }
  .cites a:hover { background: var(--ai-muted); }
  form {
    display: flex; gap: .4rem; padding: .65rem .75rem;
    border-top: 1px solid var(--ai-border);
  }
  input {
    flex: 1; padding: .5rem .65rem; border-radius: 8px;
    border: 1px solid var(--ai-border); background: transparent;
    color: inherit; outline: none; font: inherit;
    transition: border-color .15s ease;
  }
  input:focus { border-color: var(--ai-accent); }
  button[type=submit] {
    padding: 0 .95rem; border: none; border-radius: 8px;
    background: var(--ai-accent); color: #fff; cursor: pointer;
    font: inherit; transition: opacity .15s ease;
  }
  button[type=submit]:hover { opacity: .88; }

  /*
   * \u51CF\u5C11\u52A8\u6548\uFF1A\u7728\u773C\u3001\u6F02\u6D6E\u3001\u65CB\u8F6C\u3001\u547C\u5438\u5168\u90E8\u505C\u6389\uFF0C\u4F46\u4FDD\u7559\u9759\u6001\u5F69\u8FB9\uFF0C
   * \u8FD9\u6837\u89C6\u89C9\u7279\u5F81\u4E0D\u4E22\uFF0C\u7729\u6655\u654F\u611F\u7528\u6237\u4E5F\u4E0D\u88AB\u6253\u6270\u3002
   */
  @media (prefers-reduced-motion: reduce) {
    /* \u505C\u6389\u6240\u6709\u52A8\u6548\uFF0C\u4F46\u4FDD\u7559\u9759\u6001\u5F69\u8272\u63CF\u8FB9 + \u4E00\u5C42\u67D4\u548C\u9634\u5F71\uFF0C\u8BA9\u7528\u6237\u4ECD\u80FD\u770B\u5230
       "\u8FD9\u4E2A\u6309\u94AE\u8DDF\u6458\u8981\u6846\u662F\u4E00\u5957"\uFF0C\u4E0D\u4F1A\u4E22\u5931\u89C6\u89C9\u98CE\u683C\u3002 */
    .fab-glow {
      animation: none;
      box-shadow:
         0 0 12px -2px var(--ai-flow-c2),
         0 0 20px -2px var(--ai-flow-c4);
    }
    .fab-glow::before  { animation: none; }
    .robot-eye         { animation: none; }
    .robot-antenna-dot { animation: none; opacity: .8; }
  }

  :host([hidden]) { display: none; }
</style>
<div class="fab-glow" id="fab" title="AI \u5BF9\u8BDD" aria-label="AI \u5BF9\u8BDD">
  <div class="fab">
    <!--
      \u673A\u5668\u4EBA\u5934\uFF1A
        - \u9876\u90E8\u4E00\u6839\u5929\u7EBF\uFF0C\u672B\u7AEF\u4E00\u9897\u706F\uFF08.robot-antenna-dot \u547C\u5438\uFF09
        - \u5706\u89D2\u65B9\u8138
        - \u4E24\u53EA\u5706\u773C\uFF08.robot-eye \u7728\uFF09
        - \u4E00\u9053\u5F27\u5F62\u5FAE\u7B11
      \u6240\u6709\u7EBF\u6761\u7528 currentColor\uFF0C\u989C\u8272\u7531\u7236\u7EA7 .fab \u7684 color \u51B3\u5B9A\uFF08\u9ED8\u8BA4\u4E3B\u9898\u8272\uFF09\u3002
    -->
    <svg class="robot" viewBox="0 0 48 48" fill="none" stroke="currentColor"
         stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"
         style="color: var(--ai-accent);">
      <!-- \u5929\u7EBF -->
      <line x1="24" y1="6" x2="24" y2="11" />
      <circle class="robot-antenna-dot" cx="24" cy="5" r="2" fill="currentColor" stroke="none" />
      <!-- \u5934\u90E8\u5916\u6846 -->
      <rect x="9" y="12" width="30" height="26" rx="7" ry="7" fill="none" />
      <!-- \u4E24\u4FA7\u8033\u6735 -->
      <line x1="9" y1="22" x2="6" y2="22" />
      <line x1="9" y1="28" x2="6" y2="28" />
      <line x1="39" y1="22" x2="42" y2="22" />
      <line x1="39" y1="28" x2="42" y2="28" />
      <!-- \u773C\u775B\uFF08\u5B9E\u5FC3\u5706\uFF0C\u7EDF\u4E00\u7728\u773C\uFF09 -->
      <circle class="robot-eye" cx="18" cy="23" r="2.2" fill="currentColor" stroke="none" />
      <circle class="robot-eye" cx="30" cy="23" r="2.2" fill="currentColor" stroke="none" />
      <!-- \u5FAE\u7B11 -->
      <path d="M18 30 Q24 34 30 30" />
    </svg>
  </div>
</div>
<div class="panel">
  <header>
    <span class="title"><span class="dot"></span>AI \u52A9\u7406</span>
    <select id="mode">
      <option value="site">\u5168\u7AD9</option>
      <option value="post" id="modePost">\u672C\u6587</option>
    </select>
  </header>
  <div class="msgs" id="msgs"></div>
  <form id="form">
    <input id="input" placeholder="\u95EE\u70B9\u4EC0\u4E48\u2026" autocomplete="off" />
    <button type="submit">\u53D1\u9001</button>
  </form>
</div>
`,h=class extends HTMLElement{constructor(){super(...arguments);s(this,"msgsEl");s(this,"inputEl");s(this,"modeEl");s(this,"history",[]);s(this,"abortCtrl",null)}connectedCallback(){let e=this.attachShadow({mode:"open"});e.innerHTML=B,this.msgsEl=e.getElementById("msgs"),this.inputEl=e.getElementById("input"),this.modeEl=e.getElementById("mode"),this.getAttribute("post-id")?this.modeEl.value="post":e.getElementById("modePost").disabled=!0,e.getElementById("fab").addEventListener("click",()=>this.toggleAttribute("open")),e.getElementById("form").addEventListener("submit",r=>{r.preventDefault(),this.send()})}appendMsg(e,t=""){let r=document.createElement("div");r.className=`msg ${e}`;let i=document.createElement("span");return i.className="bubble",i.textContent=t,r.appendChild(i),this.msgsEl.appendChild(r),this.msgsEl.scrollTop=this.msgsEl.scrollHeight,i}appendCitations(e){if(!e.length)return;let t=document.createElement("div");t.className="cites",e.forEach((r,i)=>{let n=document.createElement("a");n.href=r.url,n.target="_blank",n.rel="noopener",n.textContent=`[${i+1}] ${r.title}`,n.title=r.snippet,t.appendChild(n)}),this.msgsEl.appendChild(t)}async send(){let e=this.inputEl.value.trim();if(!e)return;this.inputEl.value="",this.appendMsg("u",e),this.history.push({role:"user",content:e});let t=this.appendMsg("a",""),r=this.getAttribute("post-id")||void 0,i=this.modeEl.value==="post"&&r?"post":"site";this.abortCtrl?.abort(),this.abortCtrl=new AbortController;try{let n="";for await(let l of k("/api/chat",{mode:i,postId:i==="post"?r:void 0,messages:this.history},this.abortCtrl.signal))if(l.event===c.CITATIONS)try{this.appendCitations(JSON.parse(l.data))}catch{}else if(l.event===c.TOKEN)try{n+=JSON.parse(l.data),t.textContent=n,this.msgsEl.scrollTop=this.msgsEl.scrollHeight}catch{}else if(l.event===c.ERROR){t.textContent=n+`
[\u9519\u8BEF] `+l.data;return}else if(l.event===c.DONE)break;this.history.push({role:"assistant",content:n})}catch(n){t.textContent=`[\u9519\u8BEF] ${n.message}`}}};customElements.define("ai-chat-panel",h);var N=10,_=500,g=class extends HTMLElement{constructor(){super(...arguments);s(this,"bubble");s(this,"audio",null)}connectedCallback(){this.bubble=document.createElement("div"),Object.assign(this.bubble.style,{position:"absolute",display:"none",padding:".3rem .6rem",borderRadius:"6px",background:"rgba(0,0,0,.75)",color:"#fff",fontSize:"12px",cursor:"pointer",zIndex:"9998",userSelect:"none"}),this.bubble.textContent="\u{1F50A} \u6717\u8BFB\u9009\u4E2D",document.body.appendChild(this.bubble),this.bubble.addEventListener("mousedown",e=>{e.preventDefault(),this.playSelection()}),document.addEventListener("selectionchange",()=>this.update()),document.addEventListener("scroll",()=>this.hide(),!0),window.addEventListener("resize",()=>this.hide())}disconnectedCallback(){this.bubble.remove()}update(){let e=document.getSelection(),t=e?.toString()??"";if(!e||e.rangeCount===0||t.length<N||t.length>_){this.hide();return}let i=e.getRangeAt(0).getBoundingClientRect();if(i.width===0){this.hide();return}let n=window.scrollY+i.top-34,l=window.scrollX+i.left+i.width/2-50;Object.assign(this.bubble.style,{display:"block",top:`${Math.max(n,0)}px`,left:`${Math.max(l,0)}px`})}hide(){this.bubble.style.display="none"}async playSelection(){let e=document.getSelection()?.toString().trim()??"";if(e){this.hide();try{let t=await d("/api/tts",{method:"POST",body:JSON.stringify({text:e})});if(!t.ok)return;let r=await t.blob(),i=URL.createObjectURL(r);this.audio?.pause(),this.audio=new Audio(i),this.audio.play()}catch{}}}};customElements.define("ai-selection-tts",g);function O(){return window.__AI_ASSISTANT_CONFIG__??null}function F(){return document.querySelector("#article-container")||document.querySelector("article")}function P(a){let o=a.postId;if(!o)return;let e=F(),t=e??document.getElementById("ai-assistant-root")??document.body;if(a.features.summary){let r=document.createElement("ai-summary-card");r.setAttribute("post-id",o),e&&e.firstChild?e.insertBefore(r,e.firstChild):t.appendChild(r)}if(a.features.narration||a.features.podcast){let r=document.createElement("ai-audio-player");r.setAttribute("post-id",o),t.appendChild(r)}}function $(a){let o=document.getElementById("ai-assistant-root")??document.body;if(a.features.chat){let e=document.createElement("ai-chat-panel");a.postId&&e.setAttribute("post-id",a.postId),o.appendChild(e)}a.features.selectionTts&&o.appendChild(document.createElement("ai-selection-tts"))}function S(){let a=O();if(!a||!a.endpoint){console.warn("[ai-assistant] config missing, runtime disabled");return}try{P(a),$(a)}catch(o){console.warn("[ai-assistant] mount failed:",o)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",S,{once:!0}):S();})();
//# sourceMappingURL=runtime.js.map