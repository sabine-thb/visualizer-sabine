import { useState, useEffect, useRef } from "react";
import useStore from "../../utils/store";
import audioController from "../../utils/AudioController";
import s from "./SelectedTrack.module.scss";

const SelectedTrack = () => {
  const { selectedTrack } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const timelineRef = useRef(null);


  const isDeezerPreview = selectedTrack?.src?.includes("cdnt-preview.dzcdn.net");

  const effectiveDuration = isDeezerPreview ? 30 : selectedTrack?.duration || 0;

  console.log("selectedTrack.src:", selectedTrack?.src);


  useEffect(() => {
    if (selectedTrack && timelineRef.current) {
      timelineRef.current.max = effectiveDuration;
      timelineRef.current.value = Math.min(currentTime, effectiveDuration);
    }
  }, [currentTime, selectedTrack, effectiveDuration, isDeezerPreview]);




  // Vérifier périodiquement l'état de lecture
  useEffect(() => {
    const checkPlayingStatus = () => {
      setIsPlaying(audioController.isPlaying);
    };

    const interval = setInterval(checkPlayingStatus, 500);
    return () => clearInterval(interval);
  }, []);

  // Mettre à jour l'état currentTime en fonction de l'audio
  useEffect(() => {
    const updateTime = () => {
      const time = audioController.getCurrentTime();
      setCurrentTime(time);

      if (isDeezerPreview && time >= 30) {
        audioController.pause();
        audioController.setCurrentTime(0);
        setIsPlaying(false);
      }
    };

    audioController.addEventListener("timeupdate", updateTime);
    return () => audioController.removeEventListener("timeupdate", updateTime);
  }, [isDeezerPreview]);

  // Synchroniser la timeline avec l'état currentTime

  if (!selectedTrack) {
    return null;
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    let seconds = Math.round(time - minutes * 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    console.log("handlePlayPause - isPlaying avant toggle:", isPlaying);
    const newPlayingState = audioController.togglePlayPause();
    setIsPlaying(newPlayingState);
    console.log("handlePlayPause - isPlaying après toggle:", newPlayingState);
    console.log("handlePlayPause - audioController.currentTime:", audioController.getCurrentTime());
  };

  const handleTimelineChange = (event) => {
    const newTime = parseFloat(event.target.value);
    console.log("handleTimelineChange - newTime:", newTime);
    audioController.setCurrentTime(newTime);
    setCurrentTime(newTime);
    console.log("handleTimelineChange - audioController.currentTime après set:", audioController.getCurrentTime());
  };

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <img src={selectedTrack.cover} alt="" className={s.cover} />
        <div className={s.info}>
          <h2 className={s.title}>{selectedTrack.title}</h2>
          <div className={s.artistContainer}>
            {Array.isArray(selectedTrack.artists) && selectedTrack.artists.length > 0 ? (
              selectedTrack.artists.map((artist, i) =>
                artist?.name ? (
                  <h3 key={artist.id || i} className={s.artist}>
                    {artist.name}
                  </h3>
                ) : null
              )
            ) : (
              <h3 className={s.artist}>{selectedTrack.artists?.name || "Artiste inconnu"}</h3>
            )}
          </div>
          <div className={s.durationContainer}>
            <p className={s.currentTime}>{formatTime(currentTime)}</p>
            <p className={s.duration}>  / {formatTime(effectiveDuration)}</p>

          </div>
          <div className={s.controls}>
            <input
              type="range"
              ref={timelineRef}
              className={s.timeline}
              value={Math.min(currentTime, effectiveDuration)}
              min={0}
              max={isDeezerPreview ? 30 : effectiveDuration}
              onChange={handleTimelineChange}
              aria-label="Timeline de lecture"
            />
            <button
              className={s.playPauseButton}
              onClick={handlePlayPause}
              title={isPlaying ? "Pause" : "Lecture"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedTrack;