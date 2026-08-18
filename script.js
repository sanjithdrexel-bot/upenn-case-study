const root = document.documentElement;
const quickTheme = document.querySelector('.quick-theme');
const themeIcon = document.querySelector('.theme-icon');
const revealElements = document.querySelectorAll('.reveal');
const websiteScrollViewports = document.querySelectorAll('.website-scroll-viewport');
const portfolioBack = document.querySelector('.portfolio-back');

function resetWebsiteScrollViewports() {
  websiteScrollViewports.forEach((viewport) => {
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
  });
}

resetWebsiteScrollViewports();
window.addEventListener('pageshow', resetWebsiteScrollViewports);

function systemTheme() {
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(choice, remember = true) {
  const resolved = choice === 'system' ? systemTheme() : choice;
  root.dataset.theme = resolved;
  root.dataset.themeChoice = choice;
  root.style.backgroundColor = resolved === 'dark' ? '#151515' : '#fff';
  root.style.colorScheme = resolved;
  themeIcon.textContent = resolved === 'dark' ? '☀' : '☾';
  if (remember) localStorage.setItem('penn-case-theme', choice);
}

setTheme(localStorage.getItem('penn-case-theme') || 'system', false);

quickTheme.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

if (portfolioBack) {
  portfolioBack.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (typeof event.button === 'number' && event.button !== 0)) return;
    event.preventDefault();

    const target = portfolioBack.href;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.classList.add('is-page-exiting');

    setTimeout(() => {
      window.location.href = target;
    }, reduceMotion ? 0 : 180);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08 });

revealElements.forEach((element) => observer.observe(element));

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (root.dataset.themeChoice === 'system') setTheme('system', false);
});
