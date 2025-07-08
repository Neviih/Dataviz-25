window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const nuage = document.querySelector('.nuage');
  
    if (nuage) {
      nuage.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const lines = document.querySelectorAll(".transition-content .line");
  
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // facultatif : ne l’observe qu’une fois
          }
        });
      },
      {
        threshold: 0.3, // déclenche à 30% visible
      }
    );
  
    lines.forEach(line => {
      observer.observe(line);
    });
  });
  