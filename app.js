(() => {
  "use strict";

  const CONFIG = window.GREEN_CITY_CONFIG || {};
  const OTHER_BRANCH = "อื่น ๆ";
  const TOTAL_ROUNDS = 10;
  const START = { budget: 100, happiness: 42, waste: 74, pollution: 78, green: 18, energy: 10 };
  const EVENT_ROUNDS = [3, 6, 9];

  const PROJECTS = [
    { id:"roadTrees", title:"ปลูกต้นไม้ริมถนน", icon:"🌳", cost:14, build:"trees", description:"เพิ่มร่มเงา ดูดซับคาร์บอน และช่วยลดอุณหภูมิในเมือง", effects:{ happiness:4, pollution:-7, green:10 } },
    { id:"publicPark", title:"สร้างสวนสาธารณะ", icon:"🏞️", cost:24, build:"park", description:"เพิ่มพื้นที่พักผ่อนและคุณภาพชีวิตให้คนทุกวัย", effects:{ happiness:11, waste:-1, pollution:-5, green:17 } },
    { id:"sortingPoint", title:"สร้างจุดแยกขยะ", icon:"♻️", cost:16, build:"recycle", description:"ช่วยให้ขยะรีไซเคิลไม่ปนเปื้อนและกลับมาใช้ประโยชน์ได้", effects:{ happiness:4, waste:-16, pollution:-2, green:1, energy:2 } },
    { id:"solarPanels", title:"ติดตั้งแผงโซลาร์เซลล์", icon:"☀️", cost:25, build:"solar", description:"เพิ่มการใช้พลังงานสะอาดและลดการปล่อยก๊าซเรือนกระจก", effects:{ happiness:3, pollution:-9, green:1, energy:18 } },
    { id:"bikeLane", title:"เพิ่มทางจักรยาน", icon:"🚲", cost:20, build:"bike", description:"สนับสนุนการเดินทางที่สะอาดและส่งเสริมสุขภาพ", effects:{ happiness:8, pollution:-11, green:3, energy:1 } },
    { id:"publicTransit", title:"เพิ่มรถโดยสารสาธารณะ", icon:"🚌", cost:28, build:"bus", description:"ลดจำนวนรถยนต์ส่วนตัวและลดมลพิษระยะยาว", effects:{ happiness:9, pollution:-16, energy:2 } },
    { id:"rainwater", title:"ระบบเก็บน้ำฝน", icon:"🌧️", cost:17, build:"rain", description:"เก็บน้ำไว้รดต้นไม้และช่วยลดน้ำท่วมขัง", effects:{ happiness:5, waste:-1, pollution:-2, green:8, energy:2 } },
    { id:"packagingReturn", title:"ศูนย์รับคืนบรรจุภัณฑ์", icon:"📦", cost:18, build:"reuse", description:"รับคืนบรรจุภัณฑ์เพื่อนำกลับมาใช้ใหม่และรีไซเคิล", effects:{ happiness:5, waste:-13, pollution:-2, energy:3 } },
    { id:"greenRoof", title:"สร้างหลังคาสีเขียว", icon:"🏢", cost:22, build:"greenroof", description:"ช่วยลดความร้อนในอาคารและเพิ่มพื้นที่ธรรมชาติในเมือง", effects:{ happiness:6, pollution:-6, green:11, energy:3 } },
    { id:"reducePlastic", title:"รณรงค์ลดพลาสติกใช้ครั้งเดียว", icon:"🥤", cost:10, description:"ลดการใช้ถุง แก้ว หลอด และภาชนะที่ใช้เพียงครั้งเดียว", effects:{ happiness:3, waste:-9, pollution:-1 } },
    { id:"repairReuse", title:"ศูนย์ซ่อมและใช้ซ้ำ", icon:"🛠️", cost:15, build:"reuse", description:"ยืดอายุสิ่งของ ลดการซื้อใหม่ และลดขยะที่ต้องกำจัด", effects:{ happiness:6, waste:-10, pollution:-2, green:1, energy:2 } },
    { id:"smartLED", title:"เปลี่ยนเป็นไฟ LED อัจฉริยะ", icon:"💡", cost:16, build:"led", description:"ลดการใช้พลังงานและเปิดไฟเท่าที่จำเป็น", effects:{ happiness:3, pollution:-4, energy:8 } },
    { id:"urbanFarm", title:"สร้างฟาร์มเมือง", icon:"🥬", cost:20, build:"farm", description:"เพิ่มอาหารท้องถิ่น พื้นที่สีเขียว และกิจกรรมชุมชน", effects:{ happiness:8, waste:-3, pollution:-3, green:12, energy:1 } },
    { id:"communityClean", title:"กิจกรรมอาสาทำความสะอาดเมือง", icon:"🧹", cost:0, description:"ชวนคนในเมืองช่วยกันเก็บขยะและดูแลพื้นที่สาธารณะ", effects:{ happiness:3, waste:-5, pollution:-1 } },
    { id:"moreParking", title:"ขยายพื้นที่จอดรถ", icon:"🅿️", cost:12, trap:true, description:"เพิ่มความสะดวกระยะสั้น แต่ส่งเสริมการใช้รถยนต์ส่วนตัว", effects:{ happiness:4, pollution:11, green:-6 } },
    { id:"singleUseFestival", title:"ใช้ภาชนะใช้ครั้งเดียวในกิจกรรม", icon:"🍽️", cost:6, trap:true, description:"จัดงานได้รวดเร็วขึ้น แต่สร้างขยะจำนวนมาก", effects:{ happiness:3, waste:12, pollution:3 } },
    { id:"commercialExpansion", title:"ตัดพื้นที่สีเขียวเพื่อเพิ่มรายได้", icon:"🏗️", cost:-18, trap:true, description:"ได้รับงบเพิ่มทันที แต่ส่งผลเสียต่อสิ่งแวดล้อมระยะยาว", effects:{ happiness:2, waste:5, pollution:8, green:-10 } }
  ];

  const EVENTS = [
    { id:"heatwave", emoji:"🌡️", visualClass:"heat", title:"คลื่นความร้อนปกคลุมเมือง", description:"อุณหภูมิสูงขึ้นอย่างรวดเร็ว คนในเมืองต้องการทางออกที่ช่วยได้ทั้งวันนี้และในอนาคต", choices:[
      { title:"ปลูกแนวต้นไม้ฉุกเฉิน", cost:12, build:"trees", text:"เพิ่มร่มเงาและลดความร้อนในระยะยาว", effects:{ happiness:4, pollution:-4, green:7 } },
      { title:"เปิดศูนย์พักร้อนชั่วคราว", cost:8, text:"ช่วยประชาชนได้ทันที แต่ใช้พลังงานเพิ่ม", effects:{ happiness:7, energy:-3 } },
      { title:"ยังไม่ดำเนินการ", cost:0, text:"ประหยัดงบ แต่ประชาชนได้รับผลกระทบ", effects:{ happiness:-8, pollution:2 } }
    ]},
    { id:"heavyRain", emoji:"🌧️", visualClass:"rain", title:"ฝนตกหนักและมีน้ำท่วมขัง", description:"ฝนตกต่อเนื่อง ถนนบางส่วนเริ่มมีน้ำขัง คุณต้องตัดสินใจแก้ปัญหาอย่างเหมาะสม", choices:[
      { title:"ติดตั้งระบบเก็บน้ำฝน", cost:14, build:"rain", text:"เก็บน้ำไว้ใช้และช่วยลดน้ำท่วม", effects:{ happiness:5, waste:-2, green:6, energy:1 } },
      { title:"เร่งระบายน้ำฉุกเฉิน", cost:10, text:"แก้ปัญหาได้เร็ว แต่ไม่ได้สร้างประโยชน์ระยะยาว", effects:{ happiness:5, pollution:-1 } },
      { title:"ปล่อยให้สถานการณ์คลี่คลายเอง", cost:0, text:"เมืองเสียหายและเกิดขยะเพิ่ม", effects:{ happiness:-7, waste:5, pollution:2 } }
    ]},
    { id:"festival", emoji:"🎉", visualClass:"festival", title:"เทศกาลใหญ่กำลังจะเริ่ม", description:"ผู้คนจำนวนมากจะมาร่วมงาน เมืองต้องเลือกวิธีจัดงานที่สนุกและลดขยะไปพร้อมกัน", choices:[
      { title:"ใช้ภาชนะหมุนเวียน", cost:8, text:"ล้างและนำกลับมาใช้ซ้ำได้", effects:{ happiness:5, waste:-8, pollution:-1 } },
      { title:"ตั้งจุดแยกขยะทั่วงาน", cost:10, build:"recycle", text:"ช่วยให้ผู้ร่วมงานแยกขยะได้ถูกต้อง", effects:{ happiness:4, waste:-10, green:1 } },
      { title:"ใช้ภาชนะใช้ครั้งเดียว", cost:0, text:"สะดวกแต่สร้างขยะจำนวนมาก", effects:{ happiness:3, waste:10, pollution:2 } }
    ]},
    { id:"pollutionAlert", emoji:"🌫️", visualClass:"pollution", title:"ประกาศเตือนมลพิษทางอากาศ", description:"ค่าฝุ่นในเมืองสูงขึ้น การตัดสินใจครั้งนี้จะส่งผลต่อสุขภาพของประชาชน", choices:[
      { title:"วันเดินทางด้วยขนส่งสาธารณะ", cost:12, build:"bus", text:"ลดรถยนต์บนถนนและลดมลพิษ", effects:{ happiness:4, pollution:-10, energy:1 } },
      { title:"เพิ่มต้นไม้กรองฝุ่น", cost:10, build:"trees", text:"ช่วยระยะยาวและเพิ่มพื้นที่สีเขียว", effects:{ happiness:3, pollution:-6, green:6 } },
      { title:"แจกหน้ากากชั่วคราว", cost:4, text:"บรรเทาผลกระทบเฉพาะหน้า", effects:{ happiness:2, pollution:-1 } }
    ]}
  ];

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const screens = ["splashScreen","registrationScreen","storyScreen","tutorialScreen","gameScreen","resultScreen"];
  const metricKeys = ["happiness","waste","pollution","green","energy"];
  const metricMeta = {
    happiness:{ label:"ความสุข", icon:"😊" }, waste:{ label:"ปริมาณขยะ", icon:"🗑️" }, pollution:{ label:"มลพิษ", icon:"🌫️" }, green:{ label:"พื้นที่สีเขียว", icon:"🌳" }, energy:{ label:"พลังงานสะอาด", icon:"☀️" }
  };

  let audioContext = null;
  const state = {
    player:null, round:1, budget:START.budget, metrics:{...START}, usedProjects:[], selectedProjects:[], built:new Set(), currentChoices:[], projectLocked:false,
    eventIndex:0, usedEvents:new Set(), pendingEvent:false, muted:false, finished:false
  };

  function showScreen(id) {
    screens.forEach(name => $("#"+name).classList.toggle("active", name === id));
    window.scrollTo({top:0, behavior:"smooth"});
  }
  function clamp(n,min=0,max=100){ return Math.max(min,Math.min(max,n)); }
  function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function createId(prefix){ return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,9).toUpperCase()}`; }
  function sanitizePhone(v){ return String(v||"").replace(/\D/g,"").slice(0,10); }
  function showToast(text){ const el=$("#toast"); el.textContent=text; el.classList.add("show"); clearTimeout(showToast.t); showToast.t=setTimeout(()=>el.classList.remove("show"),2400); }
  function playTone(freq=520,duration=.08,type="sine",volume=.06){ if(state.muted)return; try{ audioContext ||= new (window.AudioContext||window.webkitAudioContext)(); const o=audioContext.createOscillator(),g=audioContext.createGain(); o.type=type;o.frequency.value=freq;g.gain.value=volume;o.connect(g);g.connect(audioContext.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.stop(audioContext.currentTime+duration);}catch{} }
  function playSuccess(){ playTone(520,.08); setTimeout(()=>playTone(740,.11),70); }
  function playWarning(){ playTone(220,.14,"triangle",.05); }

  function setupBranches(){
    const select=$("#branch"); (CONFIG.BRANCHES||[]).forEach(branch=>{ const o=document.createElement("option");o.value=branch;o.textContent=branch;select.appendChild(o); });
    if(![...select.options].some(o=>o.value===OTHER_BRANCH)){const o=document.createElement("option");o.value=OTHER_BRANCH;o.textContent=OTHER_BRANCH;select.appendChild(o);}
  }
  function updateOtherBranch(){ const other=$("#branch").value===OTHER_BRANCH; $("#otherBranchField").classList.toggle("hidden",!other); $("#otherBranch").required=other; if(!other)$("#otherBranch").value=""; }

  function isApiConfigured(){ return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/.test(String(CONFIG.API_URL||"").trim()); }
  function setConnectionStatus(){ const el=$("#connectionStatus"); if(isApiConfigured()){el.textContent="เชื่อมระบบ Google Sheets พร้อมใช้งาน";el.className="connection-status online";}else{el.textContent="เล่นได้ทันทีในโหมดออฟไลน์ — ตั้งค่า Apps Script ภายหลังได้";el.className="connection-status offline";} }
  async function postReport(action,data){
    const payload={action,eventId:createId("GCM"),game:"Green City Mission",sentAt:new Date().toISOString(),...data};
    if(!isApiConfigured())return {ok:true,offline:true};
    try{
      const r=await fetch(CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload),redirect:"follow"});
      const text=await r.text(); let json; try{json=JSON.parse(text)}catch{throw new Error("ระบบตอบกลับไม่ถูกต้อง")}
      if(!json.ok)throw new Error(json.message||"บันทึกไม่สำเร็จ"); return json;
    }catch(err){ queueReport(payload); throw err; }
  }
  function queueReport(payload){ try{ const q=JSON.parse(localStorage.getItem("gcm_report_queue")||"[]");q.push(payload);localStorage.setItem("gcm_report_queue",JSON.stringify(q.slice(-80)));}catch{} }
  async function flushQueue(){ if(!isApiConfigured())return; let q=[];try{q=JSON.parse(localStorage.getItem("gcm_report_queue")||"[]")}catch{} if(!q.length)return;const remain=[];for(const p of q){try{const r=await fetch(CONFIG.API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(p)});if(!r.ok)throw new Error();}catch{remain.push(p)}}localStorage.setItem("gcm_report_queue",JSON.stringify(remain)); }

  function cityScore(){ const m=state.metrics; return clamp(Math.round((m.happiness+(100-m.waste)+(100-m.pollution)+m.green+m.energy)/5)); }
  function cityStatus(score){ if(score>=85)return "เมืองสีเขียวต้นแบบ"; if(score>=70)return "เมืองกำลังเติบโตอย่างยั่งยืน"; if(score>=50)return "เมืองเริ่มเปลี่ยนแปลง"; return "เมืองยังต้องการการฟื้นฟู"; }
  function effectIsGood(key,delta){ return ["waste","pollution"].includes(key)?delta<0:delta>0; }
  function formatEffect(key,delta){ const sign=delta>0?"+":"";return `${metricMeta[key].icon} ${metricMeta[key].label} ${sign}${delta}`; }
  function effectsHTML(effects){ return Object.entries(effects).map(([k,v])=>`<span class="effect-chip ${effectIsGood(k,v)?"":"bad"}">${formatEffect(k,v)}</span>`).join(""); }

  function applyEffects(effects){
    const before={...state.metrics};
    Object.entries(effects||{}).forEach(([k,v])=>{state.metrics[k]=clamp(state.metrics[k]+v);});
    return Object.fromEntries(metricKeys.map(k=>[k,state.metrics[k]-before[k]]).filter(([,v])=>v!==0));
  }
  function addBuild(build){ if(build)state.built.add(build); }

  function updateCity(){
    const m=state.metrics, scene=$("#cityScene");
    document.documentElement.style.setProperty("--haze-opacity",(m.pollution/100*.82).toFixed(2));
    document.documentElement.style.setProperty("--litter-opacity",(m.waste/100*.9).toFixed(2));
    document.documentElement.style.setProperty("--smoke-opacity",(m.pollution/100*.9).toFixed(2));
    document.documentElement.style.setProperty("--sky-saturation",(.72+(100-m.pollution)/100*.55).toFixed(2));
    ["trees","park","recycle","solar","bike","bus","rain","reuse","greenroof","farm","led"].forEach(c=>scene.classList.toggle("has-"+c,state.built.has(c)));
    metricKeys.forEach(k=>{ $("#"+k+"Value").textContent=m[k]; $("#"+k+"Bar").style.width=m[k]+"%"; });
    const score=cityScore(); $("#cityScoreBadge").textContent=`คะแนนเมือง ${score}`; $("#cityStatusTitle").textContent=cityStatus(score);
    $("#budgetValue").textContent=state.budget; $("#roundNumber").textContent=Math.min(state.round,TOTAL_ROUNDS);
  }
  function showCityToast(text){ const el=$("#cityChangeToast");el.textContent=text;el.classList.add("show");clearTimeout(showCityToast.t);showCityToast.t=setTimeout(()=>el.classList.remove("show"),2500); }

  function projectCostText(p){ return p.cost<0?`รับงบเพิ่ม ${Math.abs(p.cost)} Coins`:`ใช้ ${p.cost} Coins`; }
  function chooseProjects(){
    let pool=PROJECTS.filter(p=>!state.usedProjects.includes(p.id));
    if(pool.length<3){state.usedProjects=[];pool=[...PROJECTS];}
    let choices=shuffle(pool).slice(0,3);
    if(!choices.some(p=>p.cost<=state.budget)){ const fallback=PROJECTS.find(p=>p.id==="communityClean"); choices[2]=fallback; }
    state.currentChoices=choices; state.projectLocked=false;
    renderProjects();
  }
  function renderProjects(){
    const box=$("#projectCards"); box.innerHTML=""; $("#roundFeedback").classList.add("hidden");box.classList.remove("hidden");$("#choiceHint").textContent="เลือกได้ 1 โครงการ";
    state.currentChoices.forEach(p=>{
      const disabled=p.cost>state.budget;
      const card=document.createElement("button");card.type="button";card.className=`project-card${disabled?" unaffordable":""}`;card.disabled=disabled;card.dataset.id=p.id;
      card.innerHTML=`${p.trap?'<span class="trap-tag">คิดให้รอบคอบ</span>':''}<span class="project-art">${p.icon}</span><span class="project-info"><h4>${p.title}</h4><p>${p.description}</p><span class="project-meta"><b class="project-cost">${projectCostText(p)}</b><span class="effect-chips">${effectsHTML(p.effects)}</span></span></span>`;
      card.addEventListener("click",()=>selectProject(p));box.appendChild(card);
    });
  }
  async function selectProject(p){
    if(state.projectLocked||p.cost>state.budget)return;state.projectLocked=true;state.budget-=p.cost;const actual=applyEffects(p.effects);addBuild(p.build);state.usedProjects.push(p.id);state.selectedProjects.push({round:state.round,id:p.id,title:p.title,icon:p.icon,cost:p.cost,effects:actual});updateCity();playSuccess();
    $("#projectCards").classList.add("hidden");const feedback=$("#roundFeedback");feedback.classList.remove("hidden");$("#feedbackIcon").textContent=p.trap?"!":"✓";$("#feedbackIcon").style.background=p.trap?"#df8b3e":"";$("#feedbackTitle").textContent=p.title;$("#feedbackText").textContent=p.trap?"โครงการนี้มีข้อดีระยะสั้น แต่สร้างผลกระทบที่ต้องนำไปแก้ในรอบต่อไป":p.description;$("#feedbackEffects").innerHTML=Object.entries(actual).map(([k,v])=>`<span class="effect-pill ${effectIsGood(k,v)?"good":"bad"}">${formatEffect(k,v)}</span>`).join("") + `<span class="effect-pill">💰 งบ ${state.budget}</span>`;
    showCityToast(`เมืองเปลี่ยนแปลงจาก “${p.title}”`);saveGame();
    postReport("choice",{sessionId:state.player.sessionId,round:state.round,choiceType:"project",choiceId:p.id,choiceTitle:p.title,cost:p.cost,budgetAfter:state.budget,effects:actual,metrics:{...state.metrics}}).catch(()=>showToast("บันทึกออนไลน์ไม่สำเร็จ ระบบเก็บข้อมูลไว้ส่งใหม่แล้ว"));
  }

  function nextRound(){
    if(EVENT_ROUNDS.includes(state.round)&&!state.pendingEvent){state.pendingEvent=true;openEvent();return;}
    state.pendingEvent=false;
    if(state.round>=TOTAL_ROUNDS){finishGame();return;}
    state.round+=1;updateCity();chooseProjects();saveGame();
  }

  function openEvent(){
    const available=EVENTS.filter(e=>!state.usedEvents.has(e.id)); const event=shuffle(available.length?available:EVENTS)[0];state.usedEvents.add(event.id);state.currentEvent=event;
    $("#eventEmoji").textContent=event.emoji;$("#eventVisual").className=`event-visual ${event.visualClass||""}`;$("#eventTitle").textContent=event.title;$("#eventDescription").textContent=event.description;$("#eventFeedback").classList.add("hidden");const box=$("#eventChoices");box.classList.remove("hidden");box.innerHTML="";
    event.choices.forEach(choice=>{const disabled=choice.cost>state.budget;const b=document.createElement("button");b.type="button";b.className="event-choice";b.disabled=disabled;b.innerHTML=`<h4>${choice.title}</h4><p>${choice.text}</p><span class="project-meta"><b class="project-cost">${choice.cost?`ใช้ ${choice.cost} Coins`:"ไม่ใช้งบ"}</b><span class="effect-chips">${effectsHTML(choice.effects)}</span></span>`;b.addEventListener("click",()=>chooseEventOption(event,choice));box.appendChild(b);});
    $("#eventModal").classList.remove("hidden");playWarning();
  }
  function chooseEventOption(event,choice){
    state.budget-=choice.cost;const actual=applyEffects(choice.effects);addBuild(choice.build);updateCity();$("#eventChoices").classList.add("hidden");$("#eventFeedback").classList.remove("hidden");$("#eventFeedbackTitle").textContent=choice.title;$("#eventFeedbackText").textContent=`ผลต่อเมือง: ${Object.entries(actual).map(([k,v])=>formatEffect(k,v)).join(" • ")} • งบคงเหลือ ${state.budget} Coins`;playSuccess();saveGame();
    state.selectedProjects.push({round:state.round,id:`event-${event.id}`,title:`เหตุการณ์: ${choice.title}`,icon:event.emoji,cost:choice.cost,effects:actual});
    postReport("choice",{sessionId:state.player.sessionId,round:state.round,choiceType:"event",choiceId:event.id,choiceTitle:choice.title,cost:choice.cost,budgetAfter:state.budget,effects:actual,metrics:{...state.metrics}}).catch(()=>{});
  }
  function continueAfterEvent(){ $("#eventModal").classList.add("hidden");state.pendingEvent=false;if(state.round>=TOTAL_ROUNDS)finishGame();else{state.round+=1;updateCity();chooseProjects();saveGame();} }

  function rankFor(score){
    if(score>=85)return{rank:"Central Green City Champion",badge:"🏆",message:"คุณสร้างเมืองต้นแบบที่สะอาด น่าอยู่ และยั่งยืนได้สำเร็จ ทุกการตัดสินใจสร้างผลลัพธ์ที่สมดุล"};
    if(score>=70)return{rank:"นักวางแผนเมืองสีเขียว",badge:"🌿",message:"เมืองของคุณกำลังเติบโตในทิศทางที่ดี มีความสมดุลระหว่างคน เมือง และสิ่งแวดล้อม"};
    if(score>=50)return{rank:"เมืองกำลังเปลี่ยนแปลง",badge:"🌱",message:"คุณวางรากฐานสำคัญแล้ว แต่เมืองยังต้องลดขยะและมลพิษ พร้อมเพิ่มโครงการระยะยาว"};
    return{rank:"เมืองต้องการการฟื้นฟู",badge:"🏙️",message:"ลองวางแผนใหม่โดยให้ความสำคัญกับผลกระทบระยะยาวและรักษางบให้สมดุล"};
  }
  async function finishGame(){
    state.finished=true;const score=cityScore(),rank=rankFor(score);showScreen("resultScreen");$("#resultPlayerLine").textContent=`ผลงานของ ${state.player.firstName} ${state.player.surname}`;$("#resultBadge").textContent=rank.badge;$("#resultRank").textContent=rank.rank;$("#resultScore").textContent=score;$("#resultMessage").textContent=rank.message;$("#afterSummary").textContent=cityStatus(score);
    $("#resultMetrics").innerHTML=metricKeys.map(k=>`<div class="result-metric"><span>${metricMeta[k].icon} ${metricMeta[k].label}</span><b>${state.metrics[k]}/100</b></div>`).join("");
    $("#selectedProjects").innerHTML=state.selectedProjects.map(p=>`<span class="selected-project-chip">${p.icon} ${p.title}</span>`).join("");makeConfetti(score);clearSavedGame();
    const status=$("#resultSaveStatus");status.textContent=isApiConfigured()?"กำลังบันทึกผลลง Google Sheets…":"ผลถูกบันทึกในเครื่อง (โหมดออฟไลน์)";
    try{await postReport("result",{sessionId:state.player.sessionId,score,rank:rank.rank,budgetRemaining:state.budget,roundsCompleted:TOTAL_ROUNDS,metrics:{...state.metrics},projects:state.selectedProjects.map(p=>p.title)});status.textContent=isApiConfigured()?"บันทึกผลลง Google Sheets เรียบร้อยแล้ว":"ผลถูกบันทึกในเครื่อง (โหมดออฟไลน์)";}catch{status.textContent="ยังส่งผลออนไลน์ไม่ได้ ระบบเก็บข้อมูลไว้ส่งใหม่แล้ว";}
  }
  function makeConfetti(score){ if(score<70)return;const layer=$("#confettiLayer");layer.innerHTML="";const colors=["#ffe066","#6dd17d","#5dc5e7","#ffffff","#ef8354"];for(let i=0;i<55;i++){const c=document.createElement("i");c.className="confetti";c.style.left=Math.random()*100+"%";c.style.background=colors[i%colors.length];c.style.animationDuration=(2.5+Math.random()*3)+"s";c.style.animationDelay=(Math.random()*1.7)+"s";layer.appendChild(c);}setTimeout(()=>layer.innerHTML="",6500); }

  function resetState(){ state.round=1;state.budget=START.budget;state.metrics={...START};state.usedProjects=[];state.selectedProjects=[];state.built=new Set();state.currentChoices=[];state.projectLocked=false;state.usedEvents=new Set();state.pendingEvent=false;state.finished=false;updateCity(); }
  function startMission(){ resetState();$("#playerName").textContent=`${state.player.firstName} ${state.player.surname}`;showScreen("gameScreen");chooseProjects();saveGame(); }
  function saveGame(){ try{localStorage.setItem("gcm_active_game",JSON.stringify({player:state.player,round:state.round,budget:state.budget,metrics:state.metrics,usedProjects:state.usedProjects,selectedProjects:state.selectedProjects,built:[...state.built],usedEvents:[...state.usedEvents],finished:state.finished}));}catch{} }
  function clearSavedGame(){try{localStorage.removeItem("gcm_active_game")}catch{} }

  async function handleRegistration(e){
    e.preventDefault();const err=$("#registrationError");err.textContent="";const firstName=$("#firstName").value.trim(),surname=$("#surname").value.trim(),employeeId=$("#employeeId").value.trim(),selectedBranch=$("#branch").value,other=$("#otherBranch").value.trim(),phone=sanitizePhone($("#phone").value);const branch=selectedBranch===OTHER_BRANCH?other:selectedBranch;
    if(!firstName){err.textContent="กรุณากรอกชื่อ";$("#firstName").focus();return}if(!surname){err.textContent="กรุณากรอกนามสกุล";$("#surname").focus();return}if(!employeeId){err.textContent="กรุณากรอกรหัสพนักงาน";$("#employeeId").focus();return}if(!selectedBranch){err.textContent="กรุณาเลือกรหัสสาขา";$("#branch").focus();return}if(selectedBranch===OTHER_BRANCH&&!other){err.textContent="กรุณาระบุรหัสสาขาหรือชื่อสาขาอื่น ๆ";$("#otherBranch").focus();return}if(phone.length<9){err.textContent="กรุณากรอกเบอร์โทร 9–10 หลัก";$("#phone").focus();return}if(!$("#consent").checked){err.textContent="กรุณายอมรับการบันทึกข้อมูลก่อนเริ่มเกม";return}
    const button=$("#registerButton");button.disabled=true;button.textContent="กำลังลงทะเบียน…";state.player={sessionId:createId("PLAYER"),firstName,surname,employeeId,branch,phone,registeredAt:new Date().toISOString()};try{sessionStorage.setItem("gcm_player",JSON.stringify(state.player))}catch{}
    try{await postReport("register",state.player);showToast(isApiConfigured()?"ลงทะเบียนและเชื่อม Google Sheets สำเร็จ":"ลงทะเบียนสำเร็จ — เล่นในโหมดออฟไลน์");}catch{showToast("ลงทะเบียนสำเร็จ ระบบจะส่งข้อมูลออนไลน์ใหม่ภายหลัง");}
    button.disabled=false;button.textContent="ลงทะเบียนและเริ่มภารกิจ";showScreen("storyScreen");
  }

  function changePlayer(){ clearSavedGame();try{sessionStorage.removeItem("gcm_player")}catch{}state.player=null;$("#registrationForm").reset();updateOtherBranch();showScreen("registrationScreen"); }
  function quickHow(){ $("#helpModal").classList.remove("hidden"); }

  function bind(){
    $("#startButton").addEventListener("click",()=>showScreen("registrationScreen"));$("#quickHowButton").addEventListener("click",quickHow);$$('.back-to-splash').forEach(b=>b.addEventListener("click",()=>showScreen("splashScreen")));
    $("#registrationForm").addEventListener("submit",handleRegistration);$("#branch").addEventListener("change",updateOtherBranch);$("#phone").addEventListener("input",e=>e.target.value=sanitizePhone(e.target.value));
    $("#storyNextButton").addEventListener("click",()=>showScreen("tutorialScreen"));$(".tutorial-back").addEventListener("click",()=>showScreen("storyScreen"));$("#beginMissionButton").addEventListener("click",startMission);
    $("#nextRoundButton").addEventListener("click",nextRound);$("#eventContinueButton").addEventListener("click",continueAfterEvent);
    $("#soundButton").addEventListener("click",()=>{state.muted=!state.muted;$("#soundButton").textContent=state.muted?"🔇":"🔊";showToast(state.muted?"ปิดเสียงแล้ว":"เปิดเสียงแล้ว")});
    $("#restartButton").addEventListener("click",()=>$("#confirmModal").classList.remove("hidden"));$("#cancelRestartButton").addEventListener("click",()=>$("#confirmModal").classList.add("hidden"));$("#confirmRestartButton").addEventListener("click",()=>{$("#confirmModal").classList.add("hidden");startMission()});
    $("#playAgainButton").addEventListener("click",startMission);$("#changePlayerButton").addEventListener("click",changePlayer);
    $("#closeHelpButton").addEventListener("click",()=>$("#helpModal").classList.add("hidden"));$("#helpStartButton").addEventListener("click",()=>$("#helpModal").classList.add("hidden"));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){$("#helpModal").classList.add("hidden");$("#confirmModal").classList.add("hidden")}});
  }

  function init(){ setupBranches();updateOtherBranch();setConnectionStatus();bind();updateCity();flushQueue(); }
  init();
})();
