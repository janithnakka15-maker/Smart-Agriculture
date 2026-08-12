const mainScreens = ['home','weather','crops','market','schemes','profile','help'];
let history_stack = ['splash'];

function goto(name){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-'+name).classList.add('active');
  document.getElementById('screen-'+name).scrollTop = 0;
  if(history_stack[history_stack.length-1] !== name) history_stack.push(name);
  if(mainScreens.includes(name)) renderBottomNav(name);
}

function togglePass(inputId, iconEl){
  const inp = document.getElementById(inputId);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  iconEl.textContent = inp.type === 'password' ? '👁️' : '🙈';
}

function doLogin(){
  const mobile = document.getElementById('mobile-input').value.trim();
  const mobileErr = document.getElementById('mobile-err');
  const mobileField = document.getElementById('mobile-input');
  if(!/^\d{10}$/.test(mobile)){
    mobileErr.style.display='block';
    mobileField.classList.add('field-error');
    return;
  }
  mobileErr.style.display='none';
  mobileField.classList.remove('field-error');
  goto('home');
  showToast('Welcome back, '+(currentUser.name || 'Nakka Janith')+'!');
}

/* ---------- Sign up ---------- */
let currentUser = { name:'Nakka Janith', mobile:'7981439813' };

function clearSignupErrors(){
  ['signup-name','signup-mobile','signup-pass','signup-confirm'].forEach(id=>{
    document.getElementById(id).classList.remove('field-error');
    document.getElementById(id+'-err').style.display='none';
  });
}

function doSignup(){
  clearSignupErrors();

  const nameEl = document.getElementById('signup-name');
  const mobileEl = document.getElementById('signup-mobile');
  const passEl = document.getElementById('signup-pass');
  const confirmEl = document.getElementById('signup-confirm');

  const name = nameEl.value.trim();
  const mobile = mobileEl.value.trim();
  const pass = passEl.value;
  const confirm = confirmEl.value;

  let hasError = false;

  if(name.length < 2){
    nameEl.classList.add('field-error');
    document.getElementById('signup-name-err').style.display='block';
    hasError = true;
  }
  if(!/^\d{10}$/.test(mobile)){
    mobileEl.classList.add('field-error');
    document.getElementById('signup-mobile-err').style.display='block';
    hasError = true;
  }
  if(pass.length < 6){
    passEl.classList.add('field-error');
    document.getElementById('signup-pass-err').style.display='block';
    hasError = true;
  }
  if(confirm !== pass || confirm.length === 0){
    confirmEl.classList.add('field-error');
    document.getElementById('signup-confirm-err').style.display='block';
    hasError = true;
  }

  if(hasError) return;

  currentUser = { name, mobile };
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-phone').textContent = '📞 +91 ' + mobile.slice(0,5) + ' ' + mobile.slice(5);
  document.getElementById('home-greeting').textContent = 'Hello, ' + name.split(' ')[0] + '! 👋';

  nameEl.value=''; mobileEl.value=''; passEl.value=''; confirmEl.value='';

  goto('home');
  showToast('Account created! Welcome, '+name+'.');
}

function doLogout(){
  goto('login');
  document.getElementById('mobile-input').value='';
  document.getElementById('pass-input').value='';
  showToast('Logged out successfully');
}

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(()=>t.classList.remove('show'), 1800);
}

/* ---------- Bottom nav ---------- */
const navItems = [
  {key:'home', icon:'🏠', label:'Home'},
  {key:'weather', icon:'⛅', label:'Weather'},
  {key:'crops', icon:'🌾', label:'Crops'},
  {key:'market', icon:'🛒', label:'Market'},
  {key:'more', icon:'⋯', label:'More'}
];
function renderBottomNav(active){
  ['screen-home','screen-weather','screen-crops','screen-market'].forEach(id=>{
    const el = document.getElementById(id);
    let existing = el.querySelector('.bottomnav');
    if(existing) existing.remove();
    const nav = document.createElement('div');
    nav.className='bottomnav';
    navItems.forEach(item=>{
      const div = document.createElement('div');
      div.className = 'navitem' + (item.key===active ? ' active':'');
      div.innerHTML = `<span class="navic">${item.icon}</span><span>${item.label}</span>`;
      div.onclick = ()=>{
        if(item.key==='more'){ goto('profile'); }
        else { goto(item.key); }
      };
      nav.appendChild(div);
    });
    el.appendChild(nav);
  });
}

/* ---------- Crop data ---------- */
const cropData = {
  cereals: [
    {name:'Rice', season:'Best Season: Kharif', desc:'Rice is a staple food crop. Ensure proper irrigation and use quality seeds.', emoji:'🌾'},
    {name:'Wheat', season:'Best Season: Rabi', desc:'Wheat grows best in cool climate with good soil moisture.', emoji:'🌾'},
    {name:'Maize', season:'Best Season: Kharif/Rabi', desc:'Maize needs well-drained loamy soil and moderate rainfall.', emoji:'🌽'}
  ],
  pulses: [
    {name:'Toor Dal', season:'Best Season: Kharif', desc:'A hardy pulse crop that improves soil nitrogen content.', emoji:'🫘'},
    {name:'Chickpea', season:'Best Season: Rabi', desc:'Grows well in dry conditions with minimal irrigation.', emoji:'🫘'}
  ],
  veg: [
    {name:'Tomato', season:'Best Season: Year-round', desc:'Needs regular watering and staking support for best yield.', emoji:'🍅'},
    {name:'Cotton', season:'Best Season: Kharif', desc:'Requires warm climate and well-drained black soil.', emoji:'🌱'}
  ],
  fruits: [
    {name:'Mango', season:'Best Season: Summer', desc:'Thrives in tropical climate; prune after harvest for better yield.', emoji:'🥭'},
    {name:'Banana', season:'Best Season: Year-round', desc:'Needs consistent watering and rich, well-drained soil.', emoji:'🍌'}
  ]
};
const tips = {
  cereals:'Use organic fertilizers for better soil health.',
  pulses:'Rotate pulses with cereals to naturally enrich nitrogen levels.',
  veg:'Mulch around vegetable beds to retain soil moisture.',
  fruits:'Prune fruit trees regularly to improve air circulation and yield.'
};
function renderCrops(cat){
  const list = document.getElementById('crop-list');
  list.innerHTML='';
  cropData[cat].forEach(c=>{
    const div = document.createElement('div');
    div.className='crop-card';
    div.innerHTML = `<h4>${c.emoji} ${c.name}</h4><div class="season">${c.season}</div><p>${c.desc}</p>`;
    list.appendChild(div);
  });
  document.getElementById('tip-text').textContent = tips[cat];
}
document.getElementById('crop-chips').addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip');
  if(!chip) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  renderCrops(chip.dataset.cat);
});
renderCrops('cereals');

/* ---------- Market data ---------- */
const marketData = [
  {name:'Rice (Sona Masuri)', price:'₹2,150', unit:'/ Quintal', change:'+50', up:true, emoji:'🌾'},
  {name:'Wheat', price:'₹2,020', unit:'/ Quintal', change:'+30', up:true, emoji:'🌾'},
  {name:'Toor Dal', price:'₹6,500', unit:'/ Quintal', change:'+120', up:true, emoji:'🫘'},
  {name:'Maize', price:'₹1,850', unit:'/ Quintal', change:'-20', up:false, emoji:'🌽'},
  {name:'Cotton', price:'₹5,800', unit:'/ Quintal', change:'+80', up:true, emoji:'🌱'}
];
function renderMarket(){
  const list = document.getElementById('market-list');
  list.innerHTML='';
  marketData.forEach(m=>{
    const div = document.createElement('div');
    div.className='price-row';
    div.innerHTML = `
      <div class="price-ic">${m.emoji}</div>
      <div class="price-info">
        <b>${m.name}</b>
        <span class="price-val">${m.price}</span> <span style="font-size:11.5px; color:var(--ink-soft);">${m.unit}</span>
      </div>
      <div class="price-change ${m.up?'up':'down'}">${m.up?'▲':'▼'} ${m.change}</div>
    `;
    list.appendChild(div);
  });
}
renderMarket();

/* ---------- Schemes data ---------- */
const schemeData = [
  {name:'PM Kisan Samman Nidhi', desc:'Financial assistance of ₹6,000 per year to small and marginal farmers.', emoji:'👨‍🌾'},
  {name:'Pradhan Mantri Fasal Bima Yojana', desc:'Crop insurance scheme to protect farmers from crop loss.', emoji:'🛡️'},
  {name:'Soil Health Card Scheme', desc:'Provides soil health cards to farmers for better crop productivity.', emoji:'🌱'},
  {name:'Kisan Credit Card Scheme', desc:'Easy credit facilities for farmers at low interest rates.', emoji:'💳'}
];
function renderSchemes(){
  const list = document.getElementById('scheme-list');
  list.innerHTML='';
  schemeData.forEach(s=>{
    const div = document.createElement('div');
    div.className='scheme-card';
    div.onclick=()=>showToast(s.name+' — details coming soon');
    div.innerHTML = `<div class="scheme-ic">${s.emoji}</div><div class="scheme-info"><b>${s.name}</b><p>${s.desc}</p></div>`;
    list.appendChild(div);
  });
}
renderSchemes();

/* ---------- FAQ data ---------- */
const faqData = [
  {q:'How to check crop information?', a:'Go to Home and tap "Crop Information", then choose a category to see crop details and farming tips.'},
  {q:'How to get weather updates?', a:'Tap "Weather" from the Home screen or bottom navigation to see current conditions and a 5-day forecast.'},
  {q:'How to see market prices?', a:'Open "Market Prices" from Home to view current rates for major crops in your local market.'},
  {q:'How to apply for schemes?', a:'Visit "Government Schemes" from Home, tap a scheme to view details, and follow the application link.'}
];
function renderFaqs(){
  const list = document.getElementById('faq-list');
  list.innerHTML='';
  faqData.forEach((f,i)=>{
    const div = document.createElement('div');
    div.className='faq-item';
    div.innerHTML = `<div class="faq-q">${f.q}<span class="chevron">›</span></div><div class="faq-a">${f.a}</div>`;
    div.onclick=()=>div.classList.toggle('open');
    list.appendChild(div);
  });
}
renderFaqs();

/* ---------- Equipment data ---------- */
const equipmentData = [
  { id:'jd5050', name:'John Deere 5050 D', type:'Tractor', emoji:'🚜', location:'Guntur, Andhra Pradesh', power:'50 HP', fuel:'Diesel', drive:'4WD', price:'₹1,200/hour', available:true, owner:'Ramesh Reddy' },
  { id:'nh3600', name:'New Holland 3600', type:'Tractor', emoji:'🚜', location:'Tenali, Andhra Pradesh', power:'45 HP', fuel:'Diesel', drive:'2WD', price:'₹1,000/hour', available:true, owner:'Suresh Babu' },
  { id:'combine1', name:'Combine Harvester X9', type:'Harvester', emoji:'🌾', location:'Narasaraopet, Andhra Pradesh', power:'210 HP', fuel:'Diesel', drive:'4WD', price:'₹3,500/hour', available:false, owner:'Venkata Rao' },
  { id:'rotavator1', name:'Rotavator Pro 6ft', type:'Tillage Equipment', emoji:'⚙️', location:'Guntur, Andhra Pradesh', power:'—', fuel:'PTO Driven', drive:'—', price:'₹450/hour', available:true, owner:'Krishna Murthy' },
  { id:'sprayer1', name:'Boom Sprayer 400L', type:'Sprayer', emoji:'💦', location:'Ponnur, Andhra Pradesh', power:'—', fuel:'Battery', drive:'—', price:'₹600/hour', available:true, owner:'Lakshmi Devi' },
];
function renderEquipment(){
  const list = document.getElementById('equipment-list');
  list.innerHTML='';
  equipmentData.forEach(e=>{
    const div = document.createElement('div');
    div.className='equip-card';
    div.onclick=()=>openEquipmentDetail(e.id);
    div.innerHTML = `
      <div class="equip-thumb">${e.emoji}</div>
      <div class="equip-info">
        <b>${e.name}</b>
        <div class="sub">📍 ${e.location}</div>
        <div class="equip-tags"><span class="equip-tag">${e.type}</span><span class="equip-tag">${e.power}</span></div>
        <div class="equip-price-row">
          <span class="equip-price">${e.price}</span>
          <span class="equip-avail" style="${e.available?'':'color:var(--red);'}">${e.available?'Available Today':'Booked Today'}</span>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}
renderEquipment();

function openEquipmentDetail(id){
  const e = equipmentData.find(x=>x.id===id);
  if(!e) return;
  document.getElementById('detail-emoji').textContent = e.emoji;
  document.getElementById('detail-name').textContent = e.name;
  document.getElementById('detail-sub').textContent = `${e.type} · ${e.location}`;
  document.getElementById('detail-power').textContent = e.power;
  document.getElementById('detail-fuel').textContent = e.fuel;
  document.getElementById('detail-drive').textContent = e.drive;
  document.getElementById('owner-name').textContent = e.owner;

  const availRow = document.getElementById('avail-row');
  availRow.innerHTML='';
  const days = ['Today','Mon','Tue','Wed','Thu'];
  days.forEach((d,i)=>{
    const booked = !e.available && i===0;
    const div = document.createElement('div');
    div.className = 'avail-day ' + (booked ? 'booked' : 'open');
    div.innerHTML = `${d}<div>${booked?'Booked':'Open'}</div>`;
    availRow.appendChild(div);
  });

  goto('equipment-detail');
}

/* ---------- Disease detection (mock) ---------- */
const detectionResults = [
  { crop:'🍅', name:'Tomato Late Blight', latin:'Phytophthora infestans', severity:'High Severity', confidence:92,
    steps:['Remove and destroy infected leaves (do not compost).','Apply recommended fungicide (Mancozeb 75% WP @ 2 g/L or a metalaxyl-based fungicide).','Improve air circulation and avoid excessive watering.','Follow crop rotation for next season.'] },
  { crop:'🌽', name:'Maize Fall Armyworm', latin:'Spodoptera frugiperda', severity:'Medium Severity', confidence:87,
    steps:['Inspect whorls regularly for larvae and eggs.','Apply Chlorantraniliprole 18.5% SC @ 0.3 ml/litre of water.','Remove and destroy crop residues and affected leaves.','Encourage natural predators like birds and parasitic wasps.'] },
  { crop:'🌾', name:'Rice Leaf Blast', latin:'Magnaporthe oryzae', severity:'Low Severity', confidence:78,
    steps:['Avoid excess nitrogen fertilizer application.','Apply Tricyclazole 75% WP as a preventive spray.','Maintain proper field drainage.','Use resistant rice varieties next season.'] }
];
function runDetection(){
  const r = detectionResults[Math.floor(Math.random()*detectionResults.length)];
  document.querySelector('.result-emoji').textContent = r.crop;
  document.querySelector('.result-info b').textContent = r.name;
  document.querySelector('.result-info i').textContent = r.latin;
  document.querySelector('.severity-pill').textContent = '⚠️ ' + r.severity;
  document.querySelector('.confidence-ring').style.background = `conic-gradient(var(--green) 0% ${r.confidence}%, var(--line) ${r.confidence}% 100%)`;
  document.querySelector('.confidence-ring span').textContent = r.confidence + '%';
  const stepsEl = document.querySelector('.solution-card');
  stepsEl.innerHTML='';
  r.steps.forEach((s,i)=>{
    const div = document.createElement('div');
    div.className='solution-step';
    div.innerHTML = `<span class="step-num">${i+1}</span>${s}`;
    stepsEl.appendChild(div);
  });
  showToast('Scan complete — result updated');
}

/* ---------- Clock ---------- */
function updateClock(){
  const now = new Date();
  let h = now.getHours(); const m = now.getMinutes();
  const ampm = h>=12?'PM':'AM'; h = h%12; if(h===0) h=12;
  document.getElementById('clock').textContent = h+':'+String(m).padStart(2,'0');
}
updateClock(); setInterval(updateClock, 30000);

/* Auto-advance splash after a moment, still tappable */
setTimeout(()=>{ if(history_stack[history_stack.length-1]==='splash') goto('login'); }, 3200);