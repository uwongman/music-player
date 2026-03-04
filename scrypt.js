const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const songTitle = document.getElementById("song-title");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const coverImg = document.getElementById("cover");

const songs = [
  { title: "song1.mp3", src: "music/song1.mp3", cover: "images/cover1.jpg" },
  { title: "song2.mp3", src: "music/song2.mp3", cover: "images/cover2.jpg" },
  { title: "song3.mp3", src: "music/song3.mp3", cover: "images/cover3.jpg" },
];

let currentIndex = 0;
let isShuffle = false;

function loadSong(index) {
  audio.src = songs[index].src;
  songTitle.textContent = songs[index].title;
  coverImg.src = songs[index].cover;
  updateActiveSong();
  localStorage.setItem("lastIndex", index);
}

function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  coverImg.classList.add("playing");
}

function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  coverImg.classList.remove("playing");
}

function togglePlay() {
  audio.paused ? playSong() : pauseSong();
}

function prevSong() {
  if (isShuffle) {
    randomSong();
    return;
  }
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function nextSong() {
  if (isShuffle) {
    randomSong();
    return;
  }
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
  playSong();
}

function randomSong() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === currentIndex);

  currentIndex = randomIndex;
  loadSong(currentIndex);
  playSong();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  localStorage.setItem("shuffle", isShuffle);
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
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
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
  const savedShuffle = localStorage.getItem("shuffle");

  if (savedIndex !== null) currentIndex = parseInt(savedIndex);
  if (savedShuffle === "true") {
    isShuffle = true;
    shuffleBtn.classList.add("active");
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
shuffleBtn.addEventListener("click", toggleShuffle);

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
