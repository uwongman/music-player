const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const title = document.getElementById("song-title");
const playlistElement = document.getElementById("playlist");

const songs = ["song1.mp3", "song2.mp3", "song3.mp3"];

let currentIndex = 0;
let isPlaying = false;

function loadSong(index) {
  audio.src = songs[index];
  title.textContent = songs[index];
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
  isPlaying ? pauseSong() : playSong();
}

function nextSong() {
  currentIndex++;
  if (currentIndex >= songs.length) currentIndex = 0;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex--;
  if (currentIndex < 0) currentIndex = songs.length - 1;
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
  const duration = audio.duration;
  audio.currentTime = (progress.value / 100) * duration;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function createPlaylist() {
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistElement.appendChild(li);
  });
}

function updateActiveSong() {
  const items = playlistElement.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);

progress.addEventListener("input", setProgress);

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      nextSong();
      break;
    case "ArrowLeft":
      prevSong();
      break;
    case "ArrowUp":
      volume.value = Math.min(1, parseFloat(volume.value) + 0.05);
      audio.volume = volume.value;
      break;
    case "ArrowDown":
      volume.value = Math.max(0, parseFloat(volume.value) - 0.05);
      audio.volume = volume.value;
      break;
  }
});

loadSong(currentIndex);
createPlaylist();
audio.volume = volume.value;
