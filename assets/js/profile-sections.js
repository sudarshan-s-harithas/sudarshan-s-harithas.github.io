// Enhance ordinary section links into an accessible, single-panel tab view.
(() => {
  const nav = document.querySelector('.profile-section-nav');
  if (!nav) return;
  const tabs = Array.from(nav.querySelectorAll('a'));
  const panels = tabs.map(tab => document.querySelector(tab.hash));
  if (panels.some(panel => !panel)) return;

  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Profile sections');
  tabs.forEach((tab, index) => {
    tab.id = `profile-tab-${panels[index].id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });

  function select(index) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
  }

  function selectFromHash() {
    const index = tabs.findIndex(tab => tab.hash === location.hash);
    select(index < 0 ? 0 : index);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      event.preventDefault();
      select(index);
      history.replaceState(null, '', tab.hash);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    });
  });
  selectFromHash();
  window.addEventListener('hashchange', selectFromHash);
})();
