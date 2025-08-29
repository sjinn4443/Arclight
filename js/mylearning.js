export function initializeMyLearning() {}


// ==== AUTO-MIGRATED FROM legacy script.js (2025-07-15) ====
// The following functions were ported automatically. Review selectors and
// ensure they are invoked from main.js on `page:loaded` where relevant.
// Functions: showLikedPage

function showLikedPage() {
  const mason = document.getElementById('likedMasonry');
  if (!mason) { showPage('likedPage'); return; }

  const likes = getLikes(); // uses LIKES_KEY = 'eyesLikes'  :contentReference[oaicite:3]{index=3}

  // Pull all Eyes items from your catalog (core/disease/pec/extended/tools)
  // getAllEyesItems() already exists and flattens EYES_SECTIONS for you. :contentReference[oaicite:4]{index=4}
  const allEyes = getAllEyesItems();

  // Keep only liked items
  let likedItems = allEyes.filter(i => likes.has(i.label));

  // Shuffle for a fresh look each time
  likedItems = likedItems.sort(() => Math.random() - 0.5);

  // Assign random size buckets for the masonry feel
  const pickSize = () => {
    const r = Math.random();
    if (r < 0.45) return 'size-s';   // ~45%
    if (r < 0.80) return 'size-m';   // ~35%
    return 'size-l';                 // ~20%
  };

  const renderCard = (item) => {
  const badges = (item.tags || []).slice(0,3).map(t => `<span class="ml-badge">${t}</span>`).join('');
  const size = pickSize();
  return `<button class="ml-card ${size}" data-target="${item.target || 'comingSoon'}">
    <div class="ml-card-header">
      <h4>${item.label}</h4>
      <span class="ml-heart">❤</span>
    </div>
    <div class="ml-badges">${badges}</div>
  </button>`;
};

  mason.innerHTML = likedItems.length
    ? likedItems.map(renderCard).join('')
    : `<p class="note">No liked items yet. Tap the heart on any Eyes card to add it here.</p>`;

  // Navigation
  mason.onclick = (e) => {
    const card = e.target.closest('.ml-card');
    if (!card) return;
    const target = card.getAttribute('data-target') || 'comingSoon';
    if (target === 'comingSoon') {
      const h = document.getElementById('comingSoonTitle');
      if (h) h.textContent = 'Coming soon';
    }
    showPage(target);
  };

  // Search filter (works across all cards now)
  const search = document.getElementById('mlSearch');
  if (search) {
    const filter = () => {
      const q = search.value.toLowerCase();
      mason.querySelectorAll('.ml-card').forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        card.style.display = title.includes(q) ? '' : 'none';
      });
    };
    search.oninput = filter;
  }

  // Chips – still cosmetic toggles for now
  document.querySelectorAll('.ml-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.ml-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  showPage('likedPage');
}