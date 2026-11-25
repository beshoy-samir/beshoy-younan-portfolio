'use strict';
const themeButton = document.querySelector('.theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('by-theme'); } catch { /* Theme remains usable without storage. */ }
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const light = theme === 'light';
  themeButton.textContent = light ? 'Dark mode' : 'Light mode';
  themeButton.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeButton.setAttribute('aria-pressed', String(light));
}
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('by-theme', next); } catch { /* Optional preference persistence. */ }
});
const filters = [...document.querySelectorAll('[data-filter]')];
const projects = [...document.querySelectorAll('.project')];
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  projects.forEach(project => { project.hidden = selected !== 'all' && project.dataset.category !== selected; });
  const count = projects.filter(project => !project.hidden).length;
  document.querySelector('#project-status').textContent = `${count} project areas shown.`;
}));
document.querySelector('#print-profile').addEventListener('click', () => window.print());
const printState = new Map();
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details').forEach(detail => { printState.set(detail, detail.open); detail.open = true; });
  projects.forEach(project => { printState.set(project, project.hidden); project.hidden = false; });
});
window.addEventListener('afterprint', () => {
  printState.forEach((state, element) => { if (element.tagName === 'DETAILS') element.open = state; else element.hidden = state; });
  printState.clear();
});
