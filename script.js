// 🎵 Select DOM elements for playlist, time display, audio, and controls
const playListConatinerTag = document.getElementsByClassName("playListContainer")[0];
const currentAndTotalTimeTag = document.getElementsByClassName("currentAndTotalTime")[0];
const currentProgressTag = document.getElementById("currentProgress");
const audioTag = document.getElementsByClassName("audioTag")[0];
const playButtonTag = document.getElementsByClassName("playButton")[0];
const pauseButtonTag = document.getElementsByClassName("pauseButton")[0];
const nextButtonTag = document.getElementsByClassName("nextButton")[0];
const previousButtonTag = document.getElementsByClassName("previousButton")[0];
const volumeButtonTag = document.getElementsByClassName("volumeButton")[0];
const shuffleButtonTag = document.getElementsByClassName("shuffleButton")[0];
const volumeSlider = document.querySelector('.volumeSlider');

// 🎶 Define track list
const tracks = [
    {trackId: "musicfile/track1.mp3", title: "Track 1"},
    {trackId: "musicfile/track2.mp3", title: "Track 2"},
    {trackId: "musicfile/track3.mp3", title: "Track 3"},
    {trackId: "musicfile/track4.mp3", title: "Track 4"},
];

// 📜 Render playlist items and attach click listeners
for (let i = 0; i < tracks.length; i++) {
    const trackTag = document.createElement("div");
    trackTag.addEventListener("click", () => {
        currentPlayingIndex = i;
        playSong(); // Play selected track
    });
    trackTag.classList.add("trackItem");
    const title = (i + 1).toString() + ". " + tracks[i].title;
    trackTag.textContent = title;
    playListConatinerTag.append(trackTag);
}

// ⏱️ Track duration and update display when audio loads
let duration = 0;
let durationText = "00:00";
audioTag.addEventListener("loadeddata", () => {
    duration = Math.floor(audioTag.duration);
    durationText = createMinuteAndSecondText(duration);
});

// ⏳ Update current time and progress bar as audio plays
audioTag.addEventListener("timeupdate", () => {
    const currentTime = Math.floor(audioTag.currentTime);
    const currentTimeText = createMinuteAndSecondText(currentTime);
    const currentTimeTextAndDurationText = currentTimeText + "/" + durationText;
    currentAndTotalTimeTag.textContent = currentTimeTextAndDurationText;

    updateCurrentProgress(currentTime); // Update progress bar
});

// 📊 Update progress bar width based on current time
const updateCurrentProgress = (currentTime) => {
    const currentProgressWidth = (500 / duration) * currentTime;
    currentProgressTag.style.width = currentProgressWidth.toString() + "px";
};

// 🕒 Convert seconds to MM:SS format
const createMinuteAndSecondText = (totalSecond) => {
    const minutes = Math.floor(totalSecond / 60);
    const seconds = totalSecond % 60;

    const minuteText = minutes < 10 ? "0" + minutes.toString() : minutes;
    const secondText = seconds < 10 ? "0" + seconds.toString() : seconds;
    return minuteText + ":" + secondText;
};

// ▶️ Play button logic
let currentPlayingIndex = 0;
let isPlaying = false;
playButtonTag.addEventListener("click", () => {
    const currentTime = Math.floor(audioTag.currentTime);
    isPlaying = true;
    if (currentTime === 0) {
        playSong(); // Start new track
    } else {
        audioTag.play(); // Resume playback
        updatePalyAndPauseButton();
    }
});

// ⏸️ Pause button logic
pauseButtonTag.addEventListener("click", () => {
    isPlaying = false;
    audioTag.pause();
    updatePalyAndPauseButton();
});

// ⏭️ Next track logic
nextButtonTag.addEventListener("click", () => {
    if (currentPlayingIndex === tracks.length - 1) {
        return; // Already at last track
    }
    currentPlayingIndex += 1;
    playSong();
});

// ⏮️ Previous track logic
previousButtonTag.addEventListener("click", () => {
    if (currentPlayingIndex === 0) {
        return; // Already at first track
    }
    currentPlayingIndex -= 1;
    playSong();
});

// 🔊 Volume slider logic
volumeSlider.addEventListener('input', () => {
    audioTag.volume = volumeSlider.value; // Set volume (0.0 to 1.0)
});

// 🔇 Mute/unmute logic
let isMuted = false;
volumeButtonTag.addEventListener('click', () => {
    isMuted = !isMuted;
    audioTag.muted = isMuted;
    volumeButtonTag.classList.toggle('fa-volume-up', !isMuted);
    volumeButtonTag.classList.toggle('fa-volume-mute', isMuted);
});

// 🔀 Shuffle toggle logic
let isShuffle = false;
shuffleButtonTag.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleButtonTag.style.color = isShuffle ? "green" : "brown"; // Visual cue
});

// 🔁 Auto-play next track when current ends
audioTag.addEventListener("ended", () => {
    if (isShuffle) {
        // Shuffle mode: pick a random track
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * tracks.length);
        } while (nextIndex === currentPlayingIndex && tracks.length > 1);
        currentPlayingIndex = nextIndex;
        playSong();
    } else {
        // Normal mode: play next track or stop
        currentPlayingIndex += 1;
        if (currentPlayingIndex >= tracks.length) {
            currentPlayingIndex = 0; // Loop back to first track
        }
        playSong();
    }
});

// 🎶 Play selected track
const playSong = () => {
    const songIdToPlay = tracks[currentPlayingIndex].trackId;
    audioTag.src = songIdToPlay;
    audioTag.play();
    isPlaying = true;
    updatePalyAndPauseButton();
};

// 🔄 Update play/pause button visibility
const updatePalyAndPauseButton = () => {
    if (isPlaying) {
        playButtonTag.style.display = "none";
        pauseButtonTag.style.display = "inline";
    } else {
        playButtonTag.style.display = "inline";
        pauseButtonTag.style.display = "none";
    }
};