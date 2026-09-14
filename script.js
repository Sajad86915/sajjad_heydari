document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".link-card").forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    setTimeout(() => {
      card.style.transition =
        "opacity .45s ease, transform .45s ease, border-color .22s ease, background .22s ease, box-shadow .22s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 80 + i * 45);
  });
});
