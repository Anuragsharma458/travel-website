/* ================= Data ================= */
const featuredStops = [
  { name:'Santorini', country:'GREECE' },
  { name:'Bali', country:'INDONESIA' },
  { name:'Kyoto', country:'JAPAN' },
  { name:'Swiss Alps', country:'SWITZERLAND' },
  { name:'Machu Picchu', country:'PERU' },
  { name:'Dubai', country:'UAE' },
];

const destinations = [
  { name:'Santorini, Greece', tag:'Island Escape', price:'$899', img:'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', desc:'Whitewashed villages, blue domes and legendary sunsets over the Aegean.' },
  { name:'Bali, Indonesia', tag:'Tropical', price:'$749', img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', desc:'Rice terraces, hidden waterfalls and world-class surf beaches.' },
  { name:'Kyoto, Japan', tag:'Culture', price:'$1,120', img:'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', desc:'Ancient temples, bamboo forests and blooming cherry blossoms.' },
  { name:'Swiss Alps', tag:'Mountains', price:'$1,340', img:'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80', desc:'Ski, hike or simply soak in views of the majestic Matterhorn.' },
  { name:'Machu Picchu, Peru', tag:'Adventure', price:'$980', img:'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80', desc:'Trek the Inca Trail to the lost city in the clouds.' },
  { name:'Dubai, UAE', tag:'Luxury', price:'$1,050', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', desc:'Desert safaris, soaring skylines and futuristic marvels.' },
];

const packages = [
  { name:'Explorer', price:499, tagline:'Perfect for quick getaways & first-timers.', featured:false,
    feats:['3-day / 2-night stay','Airport transfers','Guided city tour','Breakfast included','24/7 chat support'] },
  { name:'Adventurer', price:999, tagline:'Immersive trips for the bold at heart.', featured:true,
    feats:['7-day / 6-night stay','All internal transport','2 adventure activities','All meals included','Local expert guide','Travel insurance'] },
  { name:'Luxury Voyager', price:1899, tagline:'Five-star comfort, zero compromises.', featured:false,
    feats:['10-day bespoke itinerary','5★ resorts & villas','Private chauffeur','Fine-dining experiences','Personal concierge','Premium insurance'] },
];

/* ================= Render cards ================= */
const dGrid = document.getElementById('destinationGrid');
dGrid.innerHTML = destinations.map(d => `
  <article class="d-card tilt reveal" data-img="${d.img}">
    <img src="${d.img}" alt="${d.name}" loading="lazy">
    <span class="d-tag">${d.tag}</span>
    <span class="d-price">from ${d.price}</span>
    <div class="d-body"><h3>${d.name}</h3><p>${d.desc}</p></div>
  </article>`).join('');

const pGrid = document.getElementById('packageGrid');
pGrid.innerHTML = packages.map(p => `
  <article class="p-card ${p.featured ? 'featured reveal' : 'reveal'}">
    ${p.featured ? '<span class="p-badge">⭐ MOST POPULAR</span>' : ''}
    <h3>${p.name}</h3>
    <div class="p-price grad-text">$${p.price}<small> / person</small></div>
    <p>${p.tagline}</p>
    <ul class="p-list">${p.feats.map(f => `<li>${f}</li>`).join('')}</ul>
    <a href="#contact" class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-block">Choose ${p.name}</a>
  </article>`).join('');

/* ================= Three.js hero ================= */
const canvas = document.getElementById('heroCanvas');
if (window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, .1, 1000);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // Earth-like sphere
  const globe = new THREE.Group();
  const geo = new THREE.SphereGeometry(1.9, 48, 48);
  const mat = new THREE.MeshStandardMaterial({
    color:0x2a4dd0, roughness:.7, metalness:.2,
    emissive:0x0a1a55, emissiveIntensity:.6,
    wireframe:false
  });
  globe.add(new THREE.Mesh(geo, mat));

  // Wireframe shell
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.05, 24, 24),
    new THREE.MeshBasicMaterial({ color:0x00d4ff, wireframe:true, transparent:true, opacity:.18 })
  ));

  // Orbiting ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.9, .03, 12, 120),
    new THREE.MeshBasicMaterial({ color:0xff5c8a, transparent:true, opacity:.7 })
  );
  ring.rotation.x = Math.PI/2.4;
  globe.add(ring);

  // Satellites (orbs)
  const orbMat = new THREE.MeshBasicMaterial({ color:0xffffff });
  const orbs = [];
  for (let i=0;i<3;i++){
    const o = new THREE.Mesh(new THREE.SphereGeometry(.09,12,12), orbMat);
    const pivot = new THREE.Object3D();
    pivot.rotation.y = (i/3)*Math.PI*2;
    pivot.rotation.z = .4;
    o.position.set(2.9,0,0);
    pivot.add(o); globe.add(pivot); orbs.push(pivot);
  }
  function placeGlobe(){
    // adaptive: keep the globe clear of the headline at any aspect ratio
    const a = innerWidth / innerHeight;
    if (a > 1.5){                 // wide desktop — right of the text
      globe.userData.bx = 5.4; globe.userData.by = .2;
      globe.position.z = -1;
      globe.scale.setScalar(.9);
    } else if (a > 1.05){         // tablet/short desktop — smaller, top-right corner
      globe.userData.bx = 3.2; globe.userData.by = 1.8;
      globe.position.z = -5;
      globe.scale.setScalar(.5);
    } else {                      // portrait — small, centered above the text
      globe.userData.bx = 0; globe.userData.by = 2.4;
      globe.position.z = -4;
      globe.scale.setScalar(.6);
    }
  }
  placeGlobe();
  scene.add(globe);

  /* ---- Animated airplane flying around the globe ---- */
  const planePivot = new THREE.Object3D();
  planePivot.rotation.z = .5; // slight orbit tilt
  globe.add(planePivot);

  // simple airplane built from cones + wings
  const plane = new THREE.Group();
  const pm = new THREE.MeshBasicMaterial({ color:0xffffff });
  const body = new THREE.Mesh(new THREE.ConeGeometry(.09,.55,8), pm);
  body.rotation.x = Math.PI/2;
  plane.add(body);
  const wingGeo = new THREE.BoxGeometry(.55,.02,.14);
  plane.add(new THREE.Mesh(wingGeo, pm));
  const tail = new THREE.Mesh(new THREE.BoxGeometry(.22,.02,.1), new THREE.MeshBasicMaterial({ color:0xff5c8a }));
  tail.position.set(0,0,-.28);
  plane.add(tail);
  plane.position.set(3.2,0,0);
  planePivot.add(plane);

  // Star field
  const starGeo = new THREE.BufferGeometry();
  const pos = new Float32Array(2000*3);
  for (let i=0;i<pos.length;i++) pos[i] = (Math.random()-.5)*60;
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0x9aa7ff, size:.06, transparent:true, opacity:.8 })));

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff,.5));
  const key = new THREE.DirectionalLight(0xffffff,1.1); key.position.set(5,3,5); scene.add(key);
  const rim = new THREE.PointLight(0xff5c8a,2,20); rim.position.set(-4,-2,4); scene.add(rim);

  // Mouse parallax
  let mx=0,my=0,tx=0,ty=0;
  addEventListener('mousemove', e => {
    tx = (e.clientX/innerWidth-.5); ty = (e.clientY/innerHeight-.5);
  });

  /* ---- Globe "stops" at featured destinations ---- */
  const glLabel = document.getElementById('globeLabel');
  const glPlace = document.getElementById('glPlace');
  const glCountry = document.getElementById('glCountry');
  const spinSpeed = .0002;          // normal spin
  const stopPause = 2800;           // ms spent "resting" at each destination
  let stopIdx = -1, pauseUntil = 0, currentSpeed = spinSpeed;

  setInterval(() => {
    stopIdx = (stopIdx + 1) % featuredStops.length;
    const s = featuredStops[stopIdx];
    glPlace.textContent = s.name;
    glCountry.textContent = s.country;
    glLabel.classList.add('show');
    pauseUntil = performance.now() + stopPause;
    setTimeout(() => glLabel.classList.remove('show'), stopPause - 400);
  }, stopPause + 5200); // travel time between stops + pause

  function animate(t){
    requestAnimationFrame(animate);
    mx += (tx-mx)*.05; my += (ty-my)*.05;
    // ease the spin to a halt at each stop, then ease back up
    const paused = performance.now() < pauseUntil;
    currentSpeed += ((paused ? 0 : spinSpeed) - currentSpeed) * .04;
    globe.rotation.y += currentSpeed + mx*.002;
    globe.rotation.x = my*.4;
    ring.rotation.z = t*.0004;
    orbs.forEach((p,i)=>{ p.rotation.y = t*(.0006+i*.0002); });
    // airplane: orbits independently, banks and bobs
    planePivot.rotation.y = t*.0009;
    plane.rotation.z = Math.sin(t*.001)*.3;
    plane.position.y = Math.sin(t*.002)*.12;
    globe.position.x = globe.userData.bx + mx*.8;
    globe.position.y = globe.userData.by - my*.8;
    camera.position.z = 8 + Math.sin(t*.0004)*.3;
    renderer.render(scene,camera);
  }
  animate(0);

  addEventListener('resize', () => {
    placeGlobe();
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

/* ================= Hero background slideshow ================= */
const slideImgs = [
  'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=80', // Santorini
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=80', // Bali
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1600&q=80', // Kyoto
  'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1600&q=80', // Alps
  'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1600&q=80', // Machu Picchu
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=80', // Dubai
];
const slidesWrap = document.getElementById('heroSlides');
slidesWrap.innerHTML = slideImgs.map((u,i) =>
  `<div class="slide${i===0?' active':''}" style="background-image:url('${u}')"></div>`).join('');
const slideEls = slidesWrap.querySelectorAll('.slide');
let slideIdx = 0;
setInterval(() => {
  slideEls[slideIdx].classList.remove('active');
  slideIdx = (slideIdx + 1) % slideEls.length;
  slideEls[slideIdx].classList.add('active');
}, 5000);

/* ================= Nav ================= */
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const progressBar = document.getElementById('progressBar');

addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 40);
  const h = document.documentElement;
  progressBar.style.width = (scrollY/(h.scrollHeight-h.clientHeight)*100)+'%';
}, { passive:true });

hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', e => { if (e.target.tagName==='A') navLinks.classList.remove('open'); });

/* ================= Reveal on scroll ================= */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
}, { threshold:.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ================= Animated counters ================= */
document.querySelectorAll('.hero-stats strong').forEach(el => {
  const target = +el.dataset.count, suffix = el.textContent.includes('K') ? 'K+' : '+';
  const io2 = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    let n = 0;
    const tick = () => { n += Math.max(1, Math.ceil(target/60));
      if (n >= target){ el.textContent = target + suffix; return; }
      el.textContent = n + suffix; requestAnimationFrame(tick); };
    tick(); io2.disconnect();
  });
  io2.observe(el);
});

/* ================= 3D tilt on destination cards ================= */
document.querySelectorAll('.d-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - .5;
    const y = (e.clientY - r.top)/r.height - .5;
    card.style.transform = `perspective(900px) rotateY(${x*14}deg) rotateX(${-y*14}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

/* ================= Package chips ================= */
let selectedPkg = 'Explorer';
document.getElementById('pkgChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  selectedPkg = chip.dataset.value;
});

/* ================= Booking form ================= */
const form = document.getElementById('bookingForm');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  if (!data.get('name') || !data.get('email') || !data.get('destination') || !data.get('date')){
    msg.textContent = '⚠ Please fill in all required fields.'; msg.className = 'form-msg err'; return;
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.get('email'))){
    msg.textContent = '⚠ Please enter a valid email address.'; msg.className = 'form-msg err'; return;
  }
  msg.textContent = `✈ Thank you, ${data.get('name')}! Your ${selectedPkg} request for ${data.get('destination')} has been sent — we'll reply within 24 hours.`;
  msg.className = 'form-msg ok';
  form.reset();
});

/* ================= Newsletter ================= */
document.getElementById('newsletterForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Joined ✓';
  e.target.querySelector('input').value = '';
  setTimeout(() => btn.textContent = 'Join', 2500);
});
