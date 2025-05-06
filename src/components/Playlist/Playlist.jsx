import useStore from "../../utils/store";
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Playlist.module.scss";

const Playlist = () => {
  const { playlist, removeFromPlaylist, setSelectedTrack, selectedTrack } = useStore();

  if (playlist.length === 0) {
    return null;
  }

  const playTrack = (track) => {
    audioController.play(track.src);
    scene.cover.setCover(track.cover);
    
    // Mettre à jour le track sélectionné avec ses propres informations
    setSelectedTrack({
      ...track
    });
  };

  const handleRemove = (e, trackToRemove) => {
    e.stopPropagation();
    removeFromPlaylist(trackToRemove);
    console.log("Playlist - handleRemove - trackToRemove:", trackToRemove);
  };

  const getSeconds = (duration) => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };
  
  // Vérifier si un track est sélectionné
  const isTrackSelected = (track) => {
    return selectedTrack && 
      selectedTrack.title === track.title && 
      selectedTrack.src === track.src;
  };

  return (
    <div className={s.wrapper}>
      <h3 className={s.title}>Mes sons prefs</h3>
      <div className={s.tracks}>
        {playlist.map((track, index) => (
          <div 
            key={`playlist-${track.title}-${index}`} 
            className={`${s.track} ${isTrackSelected(track) ? s.active : ''}`}
            onClick={() => playTrack(track)}
          >
            <img src={track.cover} alt="" className={s.cover} />
            <div className={s.info}>
              <span className={s.trackName}>{track.title}</span>
              {Array.isArray(track.artists) && track.artists.length > 0 ? (
                track.artists.map((artist, i) =>
                  artist?.name ? (
                    <span key={artist.id || i} className={s.artistName}>
                      {artist.name}
                    </span>
                  ) : null
                )
              ) : (
                <span className={s.artistName}>{track.artists?.name || "Artiste inconnu"}</span>
              )}
            </div>
            <span className={s.duration}>{getSeconds(track.duration)}</span>
            <button 
              className={s.removeButton} 
              onClick={(e) => handleRemove(e, track)}
              title="Retirer de la playlist"
            >
              ×
            </button>

            
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist; 