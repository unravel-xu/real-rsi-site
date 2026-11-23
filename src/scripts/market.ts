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

    const cards = [...results.querySelectorAll<HTMLElement>('[data-market-card]')].map((card) => ({
      card,
      keywords: (card.dataset.keywords ?? '').normalize('NFKC').toLowerCase(),
      category: card.dataset.category,
      tags: new Set<string>(JSON.parse(card.dataset.tags ?? '[]')),
    }));

    const tags = this.querySelector<HTMLElement>('[data-market-tags]');
    const tagChoices = [...this.querySelectorAll<HTMLButtonElement>('[data-market-tag]')];
    const selectedTags = new Set<string>();

    const filter = () => {
      const terms = query.value.normalize('NFKC').toLowerCase().trim().split(/\s+/).filter(Boolean);
      const activeTags = [...selectedTags];
      let visible = 0;
      for (const entry of cards) {
        const matchesCategory = !category.value || entry.category === category.value;
        const matchesQuery = terms.every((term) => entry.keywords.includes(term));
        const matchesTags = activeTags.every((tag) => entry.tags.has(tag));
        entry.card.hidden = !(matchesCategory && matchesQuery && matchesTags);
        if (!entry.card.hidden) visible++;
      }
      count.textContent = `${visible} 个配置`;
      results.hidden = visible === 0;
      empty.hidden = visible !== 0;
    };

    query.addEventListener('input', filter);
    category.addEventListener('change', filter);
    for (const choice of tagChoices) {
      const tag = choice.dataset.marketTag!;
      choice.addEventListener('click', () => {
        const selected = selectedTags.has(tag);
        if (selected) selectedTags.delete(tag);
        else selectedTags.add(tag);
        choice.setAttribute('aria-pressed', String(!selected));
        filter();
      });
    }
    if (tags) tags.hidden = false;

    reset.addEventListener('click', () => {
      query.value = '';
      category.value = '';
      selectedTags.clear();
      for (const choice of tagChoices) choice.setAttribute('aria-pressed', 'false');
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
