const carousel = document.querySelector(".carousel-temoignages");

if (carousel) {
  const cards = carousel.querySelectorAll(".temoignage-card");
  let currentIndex = 0;

  setInterval(() => {
    currentIndex++;
    if (currentIndex >= cards.length) {
      currentIndex = 0;
    }

    const card = cards[currentIndex];
    carousel.scrollTo({
      left: card.offsetLeft,
      behavior: 'smooth'
    });
  }, 4000);
}