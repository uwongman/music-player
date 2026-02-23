const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const songTitle = document.getElementById("song-title");
const playlistEl = document.getElementById("playlist");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

const playlist = ["music/song1.mp3", "music/song2.mp3"];

let currentIndex = 0;

function loadSong(index) {
  audio.src = playlist[index];
  songTitle.textContent = playlist[index].split("/").pop();
  renderPlaylist();
}

function renderPlaylist() {
  playlistEl.innerHTML = "";

  playlist.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.split("/").pop();

    if (index === currentIndex) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      audio.play();
    });

    playlistEl.appendChild(li);
  });
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶";
  }
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  audio.play();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  audio.play();
});

audio.addEventListener("timeupdate", () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.addEventListener("ended", () => {
  nextBtn.click();
});

loadSong(currentIndex);
renderPlaylist();
