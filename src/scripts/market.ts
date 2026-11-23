const VIEW_STORAGE_KEY = 'real-rsi:market-view';

class MarketCatalog extends HTMLElement {
  connectedCallback() {
    const query = this.querySelector<HTMLInputElement>('[data-market-query]');
    const category = this.querySelector<HTMLSelectElement>('[data-market-category]');
    const count = this.querySelector<HTMLElement>('[data-market-count]');
    const results = this.querySelector<HTMLElement>('[data-market-results]');
    const empty = this.querySelector<HTMLElement>('[data-market-empty]');
    const reset = this.querySelector<HTMLButtonElement>('[data-market-reset]');
    if (!query || !category || !count || !results || !empty || !reset) return;

    const cards = [...this.querySelectorAll<HTMLElement>('[data-market-card]')].map((card) => ({
      card,
      keywords: (card.dataset.keywords ?? '').normalize('NFKC').toLowerCase(),
      category: card.dataset.category,
    }));
    const filter = () => {
      const terms = query.value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
      let visible = 0;
      for (const entry of cards) {
        const matchesCategory = !category.value || entry.category === category.value;
        const matchesQuery = terms.every((term) => entry.keywords.includes(term));
        entry.card.hidden = !(matchesCategory && matchesQuery);
        if (!entry.card.hidden) visible++;
      }
      count.textContent = `${visible} 个配置`;
      results.hidden = visible === 0;
      empty.hidden = visible !== 0;
    };
    query.addEventListener('input', filter);
    category.addEventListener('change', filter);
    reset.addEventListener('click', () => {
      query.value = '';
      category.value = '';
      filter();
      query.focus();
    });
    filter();

    const views = this.querySelector<HTMLFieldSetElement>('[data-market-views]');
    if (!views) return;

    let view = 'cards';
    try {
      if (localStorage.getItem(VIEW_STORAGE_KEY) === 'list') view = 'list';
    } catch {
      // The layout switch also works when browser storage is unavailable.
    }

    const choices = [...views.querySelectorAll<HTMLInputElement>('input')];
    results.dataset.view = view;
    for (const choice of choices) {
      choice.checked = choice.value === view;
      choice.addEventListener('change', () => {
        results.dataset.view = choice.value;
        try {
          localStorage.setItem(VIEW_STORAGE_KEY, choice.value);
        } catch {
          // Keep the selected layout for the current page.
        }
      });
    }
    views.hidden = false;
  }
}

customElements.define('market-catalog', MarketCatalog);
