const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const songTitle = document.getElementById("song-title");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

const songs = [
  { title: "song1.mp3", src: "music/song1.mp3" },
  { title: "song2.mp3", src: "music/song2.mp3" },
  { title: "song3.mp3", src: "music/song3.mp3" },
];

let currentIndex = 0;

function loadSong(index) {
  audio.src = songs[index].src;
  songTitle.textContent = songs[index].title;
  updateActiveSong();
  localStorage.setItem("lastIndex", index);
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
}

function togglePlay() {
  audio.paused ? playSong() : pauseSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function updateProgress() {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.value = percent || 0;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);

  localStorage.setItem("lastTime", audio.currentTime);
}

function setProgress() {
  audio.currentTime = (progress.value / 100) * audio.duration;
}

function setVolume() {
  audio.volume = volume.value;
  localStorage.setItem("volume", volume.value);
}

function formatTime(time) {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updateActiveSong() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

function restorePlayer() {
  const savedIndex = localStorage.getItem("lastIndex");
  const savedTime = localStorage.getItem("lastTime");
  const savedVolume = localStorage.getItem("volume");

  if (savedIndex !== null) {
    currentIndex = parseInt(savedIndex);
  }

  loadSong(currentIndex);

  audio.addEventListener("loadedmetadata", () => {
    if (savedTime !== null) {
      audio.currentTime = parseFloat(savedTime);
    }
  });

  if (savedVolume !== null) {
    volume.value = savedVolume;
    audio.volume = savedVolume;
  }
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
progress.addEventListener("input", setProgress);
volume.addEventListener("input", setVolume);
audio.addEventListener("ended", nextSong);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
  if (e.code === "ArrowRight") nextSong();
  if (e.code === "ArrowLeft") prevSong();
});

createPlaylist();
restorePlayer();
