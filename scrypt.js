const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const title = document.getElementById("song-title");
const playlistElement = document.getElementById("playlist");
const fileInput = document.getElementById("file-input");
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

let songs = [];
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function loadSong(index) {
  if (!songs.length) return;
  audio.src = songs[index].url;
  title.textContent = songs[index].name;
  updateActiveSong();
}

function playSong() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
}

function togglePlay() {
  if (!songs.length) return;
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  if (!songs.length) return;
  currentIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  if (!songs.length) return;
  currentIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function updateProgress() {
  const { duration, currentTime } = audio;
  if (duration) {
    progress.value = (currentTime / duration) * 100;
    document.getElementById("current-time").textContent =
      formatTime(currentTime);
    document.getElementById("total-time").textContent = formatTime(duration);
  }
}

function setProgress() {
  audio.currentTime = (progress.value / 100) * audio.duration;
}

function formatTime(time) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function createPlaylist() {
  playlistElement.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistElement.appendChild(li);
  });
  updateActiveSong();
}

function updateActiveSong() {
  const items = playlistElement.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

audio.addEventListener("ended", () => {
  isRepeat ? playSong() : nextSong();
});

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    songs.push({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  });
  if (songs.length === files.length) loadSong(0);
  createPlaylist();
});

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", setProgress);
volume.addEventListener("input", () => (audio.volume = volume.value));

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
  if (e.code === "ArrowRight") nextSong();
  if (e.code === "ArrowLeft") prevSong();
});

function applyTheme(theme) {
  body.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "🌙" : "☀";
  localStorage.setItem("theme", theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

themeToggle.addEventListener("click", () => {
  const current = body.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

applyTheme(getPreferredTheme());
audio.volume = volume.value;
