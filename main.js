// Year stamp
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal-on-scroll for section heads, rail, and content blocks
const targets = document.querySelectorAll(
  ".section-head, .work-rail, .rail-controls, .about-grid, .contact-inner"
);
targets.forEach((el) => el.classList.add("reveal"));

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }
  },
  { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
);
targets.forEach((el) => io.observe(el));

// Horizontal rail navigation
const rail = document.getElementById("rail");
const prevBtn = document.getElementById("railPrev");
const nextBtn = document.getElementById("railNext");
const counter = document.getElementById("railCounter");

if (rail && prevBtn && nextBtn && counter) {
  const cards = Array.from(rail.querySelectorAll(".card"));
  const total = cards.length;
  const pad = (n) => String(n).padStart(2, "0");

  const cardWidth = () => {
    const first = cards[0];
    if (!first) return rail.clientWidth;
    const next = cards[1];
    if (next) {
      return next.getBoundingClientRect().left - first.getBoundingClientRect().left;
    }
    return first.getBoundingClientRect().width;
  };

  const activeIndex = () => {
    const railLeft = rail.getBoundingClientRect().left;
    let bestIdx = 0;
    let bestDist = Infinity;
    cards.forEach((c, i) => {
      const dist = Math.abs(c.getBoundingClientRect().left - railLeft);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    return bestIdx;
  };

  const updateState = () => {
    const i = activeIndex();
    counter.textContent = `${pad(i + 1)} / ${pad(total)}`;
    prevBtn.disabled = rail.scrollLeft <= 4;
    nextBtn.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
  };

  prevBtn.addEventListener("click", () => {
    rail.scrollBy({ left: -cardWidth(), behavior: "smooth" });
  });
  nextBtn.addEventListener("click", () => {
    rail.scrollBy({ left: cardWidth(), behavior: "smooth" });
  });

  let raf = 0;
  rail.addEventListener("scroll", () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateState);
  });
  window.addEventListener("resize", updateState);

  updateState();

  // Keyboard support when rail is focused/hovered
  rail.tabIndex = 0;
  rail.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); nextBtn.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prevBtn.click(); }
  });
}
