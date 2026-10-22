'use strict';
const benchmarks = {
  domino: { kicker: '35 DYNAMIC MANIPULATION TASKS', heading: 'Responding to a world <br>in motion.', description: 'PREM improves 31 of 35 DOMINO tasks over π₀.₅, spanning dynamic interception and tracking.', gain: '+11.11', source: 'Source: Table 2 · Average across all 35 tasks', scale: 25, rows: [['π₀',8.17,'8.17'],['OpenVLA-OFT',10.86,'10.86'],['π₀.₅',9.63,'9.63'],['PUMA',17.20,'17.20'],['PREM',20.74,'20.74']] },
  rmbench: { kicker: 'FIVE MEMORY-DEPENDENT TASKS', heading: 'Remembering what <br>is no longer visible.', description: 'PREM reaches 100%, 100%, 98%, and 99% on Rearrange Blocks, Put Back Block, Swap Blocks, and Swap-T; the fifth task, Observe, reaches 22%.', gain: '+69.4', source: 'Source: Table 3 · RMBench M(1), five-task average', scale: 100, rows: [['π₀.₅',14.4,'14.4'],['Mem-0',52.8,'52.8'],['ChainVLA',62.8,'62.8'],['MaP-WAM',75.6,'75.6'],['PREM',83.8,'83.8']] },
  libero: { kicker: 'FOUR GENERAL MANIPULATION SUITES', heading: 'Gains across all <br>four task suites.', description: 'PREM improves over π₀.₅ on Spatial, Object, Goal, and LIBERO-10. The largest gain is on LIBERO-10: 92.4% to 97.2%.', gain: '+1.8', source: 'Source: Table 1 · Average across four LIBERO suites', scale: 100, rows: [['π₀.₅',96.9,'96.9'],['MemoryVLA++',98.5,'98.5'],['X-VLA',98.1,'98.1'],['ChainVLA',98.8,'98.8'],['PREM',98.7,'98.7']] },
  liberopro: { kicker: 'ROBUSTNESS TO POSITION PERTURBATIONS', heading: 'Adapting to <br>unfamiliar layouts.', description: 'PREM improves every suite under position perturbations. The largest gain is on Object: 16.2% to 67.4%, an increase of 51.2 percentage points.', gain: '+17.4', source: 'Source: Figure 3 · LIBERO-Pro position perturbations', scale: 100, rows: [['π₀.₅',25.7,'25.7'],['PREM',43.1,'43.1']] }
};
const tabs = [...document.querySelectorAll('[data-benchmark]')];
function showBenchmark(key, focus = false) {
  const data = benchmarks[key];
  for (const tab of tabs) { const selected = tab.dataset.benchmark === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; if (selected && focus) tab.focus(); }
  document.getElementById('benchmark-panel').setAttribute('aria-labelledby', `tab-${key}`);
  document.getElementById('benchmark-kicker').textContent = data.kicker;
  document.getElementById('benchmark-heading').innerHTML = data.heading;
  document.getElementById('benchmark-description').textContent = data.description;
  document.getElementById('benchmark-gain').textContent = data.gain;
  document.getElementById('benchmark-source').textContent = data.source;
  const chart = document.getElementById('benchmark-chart');
  chart.setAttribute('aria-label', `${key === 'rmbench' ? 'RMBench M(1)' : key === 'liberopro' ? 'LIBERO-Pro' : key.toUpperCase()} average success rates: ${data.rows.map(([name,,display]) => `${name}, ${display}%`).join('; ')}. Bar scale: 0 to ${data.scale}%.`);
  chart.replaceChildren(...data.rows.map(([name, value, display]) => {
    const row = document.createElement('div'); row.className = `bar-row${name === 'PREM' ? ' is-prem' : name === 'π₀.₅' ? ' is-baseline' : ''}`;
    const label = document.createElement('span'); label.className = 'bar-label'; label.textContent = name;
    const track = document.createElement('div'); track.className = 'bar-track';
    const bar = document.createElement('div'); bar.className = 'bar-fill'; bar.style.setProperty('--bar-width', `${value/data.scale*100}%`); track.append(bar);
    const number = document.createElement('span'); number.className = 'bar-value'; number.textContent = `${display}%`;
    row.append(label, track, number); return row;
  }));
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener('click', () => showBenchmark(tab.dataset.benchmark));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
    if (event.key === 'ArrowLeft') next = (index+tabs.length-1)%tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length-1;
    if (next !== undefined) { event.preventDefault(); showBenchmark(tabs[next].dataset.benchmark, true); }
  });
}
showBenchmark('domino');
const dialog = document.querySelector('.figure-dialog');
const dialogImage = document.getElementById('dialog-image');
for (const button of document.querySelectorAll('[data-zoom]')) {
  button.addEventListener('click', () => { dialogImage.src = button.dataset.zoom; dialogImage.alt = button.querySelector('img').alt; document.getElementById('dialog-caption').textContent = button.dataset.caption; dialog.showModal(); });
}
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });

// Film selector: switch between the available benchmark video collections.
const filmTabs = [...document.querySelectorAll('[data-film]')];
function selectFilm(key, focus = false) {
  for (const button of filmTabs) {
    const selected = button.dataset.film === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(`film-${button.dataset.film}`);
    panel.hidden = !selected;
    if (!selected) panel.querySelectorAll('video').forEach(video => video.pause());
    if (selected && focus) button.focus();
  }
}
function bindTabKeys(buttons, callback, keyAttribute) {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => callback(button.dataset[keyAttribute]));
    button.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % buttons.length : event.key === 'ArrowLeft' ? (index - 1 + buttons.length) % buttons.length : event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : undefined;
      if (next !== undefined) { event.preventDefault(); callback(buttons[next].dataset[keyAttribute], true); }
    });
  });
}
bindTabKeys(filmTabs, selectFilm, 'film');


const pageSections=[...document.querySelectorAll('.article-body > section[id]')];
const sectionLinks=[...document.querySelectorAll('[data-section]')];
const progress=document.querySelector('.reading-progress');
let scrollQueued=false;
function updateReadingState(){
  let active='overview';for(const section of pageSections)if(section.getBoundingClientRect().top<180)active=section.id;
  for(const link of sectionLinks){const selected=link.dataset.section===active;link.classList.toggle('is-current',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  const total=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${total>0?Math.min(100,scrollY/total*100):0}%`;scrollQueued=false;
}
function queueReadingUpdate(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateReadingState);}}
addEventListener('scroll',queueReadingUpdate,{passive:true});addEventListener('resize',queueReadingUpdate);updateReadingState();
addEventListener('load',()=>{const anchor=document.getElementById(location.hash.slice(1));if(anchor)requestAnimationFrame(()=>anchor.scrollIntoView({behavior:'instant',block:'start'}));});

// Show the desktop reading rail only after the title has left the viewport.
const hero=document.querySelector('.hero');
if('IntersectionObserver' in window)new IntersectionObserver(entries=>{document.body.classList.toggle('is-reading',!entries[0].isIntersecting);},{rootMargin:'-80px 0px 0px 0px',threshold:0}).observe(hero);
