document.addEventListener("DOMContentLoaded", function () {
    const playButton = document.getElementById("playAudio");
    const audio = document.getElementById("bgAudio");
    const icon = document.getElementById("audioIcon");

    let isPlaying = false;

    playButton.addEventListener("click", function () {
      if (!isPlaying) {
        audio.play().then(() => {
          isPlaying = true;
          icon.style.fill = "#f9f5c5";
        }).catch(error => {
          console.warn("Lecture audio bloquée :", error);
        });
      } else {
        audio.pause();
        isPlaying = false;
        icon.style.fill = "black";
      }
    });
});