const song = document.querySelector("#song");
const title = document.querySelector("#title");
const tit = document.querySelector("title");

const artist = document.querySelector("#artist");
const thumb = document.querySelector("#thumb");

const playBtn = document.querySelector(".playBtn");
const pauseBtn = document.querySelector(".pauseBtn");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const progress = document.querySelector("#progress");
const start = document.querySelector("#start");
const end = document.querySelector("#end");

let songs = [];
let index = 0;
let interval;// valeur par defaut d'interval

// 🎧 Charger les chansons
async function loadSongs() {
  const res = await fetch("songs.json");
  songs = await res.json();
  //console.log(songs)
  setSong(index);
}

loadSongs();


// 🎵 Mettre une musique
function setSong(i) {
  song.src = songs[i].link;
  title.innerText = songs[i].name;
  tit.innerText = songs[i].artists;

  artist.innerText = songs[i].artists;
  thumb.src = songs[i].image;

  clearInterval(interval);

  song.onloadedmetadata = () => {
    progress.max = song.duration;
    end.innerText = formatTime(song.duration);
    start.innerText = "00:00";

    startProgress();
  };
}

// ▶️ Play / Pause
playBtn.addEventListener("click", () => {
  song.play();

  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");

  thumb.classList.add("play");
});

pauseBtn.addEventListener("click", () => {
  song.pause();

  pauseBtn.classList.add("hidden");
  playBtn.classList.remove("hidden");

  thumb.classList.remove("play");
});

// ⏭ next / ⏮ prev
nextBtn.addEventListener("click", () => changeSong(1));
prevBtn.addEventListener("click", () => changeSong(-1));

function changeSong(step) {
  index = (index + step + songs.length) % songs.length;
  setSong(index);
  song.play();

  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
}

// ⏱️ progression automatique
function startProgress() {
  interval = setInterval(() => {
    progress.value = song.currentTime;
    start.innerText = formatTime(song.currentTime);

    if (song.currentTime >= song.duration) {
      changeSong(1);
    }
  }, 1000);
}

// 🎚️ changer position musique
progress.addEventListener("input", () => {
  song.currentTime = progress.value;
});

// ⏱️ format temps
function formatTime(time) {
  let min = Math.floor(time / 60);
  let sec = Math.floor(time % 60);

  if (sec < 10) sec = "0" + sec;
  if (min < 10) min = "0" + min;

  return `${min}:${sec}`;
}