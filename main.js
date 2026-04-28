// Year stamp
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal-on-scroll for projects + section heads
const targets = document.querySelectorAll(".project, .section-head, .about-grid, .contact-inner");
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
  { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
);
targets.forEach((el) => io.observe(el));

// Subtle tilt on project media (desktop, pointer:fine only)
const fine = window.matchMedia("(pointer: fine)").matches;
if (fine) {
  document.querySelectorAll("[data-tilt] .project-media").forEach((media) => {
    let raf = 0;
    media.addEventListener("mousemove", (e) => {
      const r = media.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        media.style.transform = `translateY(-4px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
    });
    media.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      media.style.transform = "";
    });
  });
}
