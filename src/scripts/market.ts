class MarketCatalog extends HTMLElement {
  connectedCallback() {
    const query = this.querySelector<HTMLInputElement>('[data-market-query]');
    const category = this.querySelector<HTMLSelectElement>('[data-market-category]');
    const count = this.querySelector<HTMLElement>('[data-market-count]');
    const empty = this.querySelector<HTMLElement>('[data-market-empty]');
    const reset = this.querySelector<HTMLButtonElement>('[data-market-reset]');
    if (!query || !category || !count || !empty || !reset) return;

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
  }
}

customElements.define('market-catalog', MarketCatalog);
