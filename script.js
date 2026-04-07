async function songs(){
    try{
        const response = await fetch("songs.json");
        const data = await response.json();
        console.log(data[0].link);
        return data;
    } catch (error) {
        console.error("Erreur:", error);
    }
} 
songs();




const playBtn = document.querySelector(".icon-play");
console.log(playBtn);
const pauseBtn = document.querySelector(".icon-pause");
const song = document.querySelector("#song");
console.log(song);
const title =  document.querySelector("#title");
console.log(title);
const artist = document.querySelector("#artist");
const thumb = document.querySelector("#thumb");
const progress = document.querySelector("#progress");
const start = document.querySelector("#start");
const end = document.querySelector("#end");

const playButton = document.querySelector(".play");
const prevPlayButton = document.querySelector(".prev-play");
const nextPlayButton = document.querySelector(".next-play");


playButton.addEventListener("click", playPause);
prevPlayButton.addEventListener("click", ()=> changeSong(-1));
nextPlayButton.addEventListener("click", ()=> changeSong(1));
progress.addEventListener("change", updateSongProgress);

let index = 0;
let interval;

setSongDetails(index);

function setSongDetails(songIndex){
    song.src = songs[songIndex].link;
    title.innerHTML = songs[songIndex].name;
    artist.innerHTML = songs[songIndex].artists;
    thumb.src = songs[songIndex].image;
    start.innerHTML = "00:00";
    end.innerHTML = "00:00";
    clearInterval(interval);
    song.onloadedmetadata = loadMetadata;
}

function loadMetadata() {
    progress.max = song.duration;
    progress.value = song.currentTime;
    updateSongTimeDisplay();
    interval = setInterval(updateSongTimeDisplay, 1000);
}

function updateSongTimeDisplay() {
    let min = Math.floor(song.duration / 60); //secondes →  min
    let sec = Math.floor(song.duration % 60); //donne les secondes restantes

    let curMin = Math.floor(song.currentTime / 60);
    let curSec = Math.floor(song.currentTime % 60);

    if(sec < 10) {
        sec = "0" + sec //sec => chaine de caractère('05')
    }
    if(curSec < 10){
        curSec  = "0" + curSec;
    }
    if(min < 10){
        min = "0" + min;
    }
    if(curMin < 10){
        curMin = "0" + curMin;
    }
    end.innerHTML = min + ":" + sec;
    start.innerHTML = curMin + ":" + curSec;
}

///------------------------------------------------------

function changeSong(increment){
    index  = (index + increment + songs.length) % songs.length;
    setSongDetails(index);
    song.play();
}

function playPause(){
    if(!pauseBtn.classList.contains("hidden")){ //lorsque il ya pas de classe hidden, "Il est présent, visible"
        song.pause(); //on met pause sur la musik
        // a ne pa s comfondre ce qu'on fait sur la "musique" et ce qu'on fait sur les 'bouttonss')
        pauseBtn.classList.add("hidden"); //on cache le button pause
        playBtn.classList.remove("hidden");
        thumb.classList.remove("play");
        return
    }
    song.play();
  startSongProgressTracker();
  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
  thumb.classList.add("play");
}

function updateSongProgress() {
  clearInterval(songProgressTrackerInterval);
  song.currentTime = progress.value;
  startSongProgressTracker();
};
function startSongProgressTracker() {
  clearInterval(songProgressTrackerInterval);
  songProgressTrackerInterval = setInterval(() => {
    progress.value = song.currentTime;
    if (song.currentTime == song.duration) {
      changeSong(1);
    }
  }, 1000);
}