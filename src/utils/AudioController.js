import gsap from "gsap";
import detect from "bpm-detective";

class AudioController {
  constructor() {
    this.isPlaying = false;
    this.listeners = {}; // Pour stocker les fonctions d'écoute
  }

  setup() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.bpm = null;
    this.audio.volume = 0.1;

    this.audioSource = this.ctx.createMediaElementSource(this.audio);

    this.analyserNode = new AnalyserNode(this.ctx, {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
    });

    this.fdata = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.audioSource.connect(this.analyserNode);
    this.audioSource.connect(this.ctx.destination);

    gsap.ticker.add(this.tick);

    this.audio.addEventListener("loadeddata", async () => {
      await this.detectBPM();
    });

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.emit('ended'); // Émettre l'événement 'ended'
    });

    this.audio.addEventListener("timeupdate", () => {
      this.emit('timeupdate'); // Émettre l'événement 'timeupdate'
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.emit('play');
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.emit('pause');
    });
  }

  detectBPM = async () => {
    const offlineCtx = new OfflineAudioContext(
      1,
      this.audio.duration * this.ctx.sampleRate,
      this.ctx.sampleRate
    );
    const response = await fetch(this.audio.src);
    const buffer = await response.arrayBuffer();
    const audioBuffer = await offlineCtx.decodeAudioData(buffer);
    this.bpm = detect(audioBuffer);
  };

  play = (src) => {
    this.audio.src = src;
    this.audio.play();
    this.isPlaying = true;
  };

  pause = () => {
    if (this.audio && this.isPlaying) {
      console.log("AudioController - pause - currentTime:", this.audio.currentTime);
      this.audio.pause();
      this.isPlaying = false;
    }
  };

  resume = () => {
    if (this.audio && !this.isPlaying) {
      console.log("AudioController - resume - currentTime:", this.audio.currentTime);
      this.audio.play();
      this.isPlaying = true;
    }
  };

  togglePlayPause = () => {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
    return this.isPlaying;
  };

  getCurrentTime() {
    return this.audio ? this.audio.currentTime : 0;
  }

  setCurrentTime(time) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  addEventListener(eventName, callback) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
  }

  removeEventListener(eventName, callback) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
      if (this.listeners[eventName].length === 0) {
        delete this.listeners[eventName];
      }
    }
  }

  emit(eventName) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach(callback => callback());
    }
  }

  tick = () => {
    if (this.analyserNode) {
      this.analyserNode.getByteFrequencyData(this.fdata);
    }
  };
}

const audioController = new AudioController();
audioController.setup(); // N'oubliez pas d'appeler setup une fois que l'instance est créée
export default audioController;