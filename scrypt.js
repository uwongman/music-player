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

let songs = [];
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

function loadSong(index) {
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

  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }

  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  if (!songs.length) return;

  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }

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
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
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

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
}

function handleSongEnd() {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
}

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    songs.push({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  });

  if (songs.length === files.length) {
    loadSong(0);
  }

  createPlaylist();
});

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", handleSongEnd);

progress.addEventListener("input", setProgress);
volume.addEventListener("input", () => (audio.volume = volume.value));

audio.volume = volume.value;
