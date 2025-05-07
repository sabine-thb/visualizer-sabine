import React, { useState, useEffect } from "react"; // Importez useEffect
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import useStore from "../../utils/store";
import s from "./Track.module.scss";
import hearthIcon from "/textures/icons/hearth.svg";
import hearth2Icon from "/textures/icons/hearth2.svg";
import PropTypes from "prop-types";
// import TRACKS from "../../utils/TRACKS";

const Track = ({ title, cover, src, duration, artists, index }) => {
  const { selectedTrack, setSelectedTrack, playlist, addToPlaylist, removeFromPlaylist: removeFromPlaylistStore } = useStore();
  const [isFavorite, setIsFavorite] = useState(() => {
    return playlist.some(track => track.title === title && track.src === src);
  });

  useEffect(() => {
    setIsFavorite(playlist.some(track => track.title === title && track.src === src));
  }, [playlist, title, src]);

  const getSeconds = () => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };

  const onClick = () => {
    // 1. Mettre à jour le track sélectionné EN PREMIER
    setSelectedTrack({
      title,
      cover,
      src,
      duration,
      artists,
      index
    });

    // 2. Réinitialiser la position de lecture AVANT de lancer la lecture
    audioController.setCurrentTime(0);

    // 3. Lancer la lecture
    audioController.play(src);
    scene.cover.setCover(cover);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation(); // Empêcher le déclenchement du onClick du parent

    const trackToAddOrRemove = {
      title,
      cover,
      src,
      duration,
      artists,
      index
    };

    if (isFavorite) {
      removeFromPlaylistStore(trackToAddOrRemove);
      setIsFavorite(false);
    } else {
      addToPlaylist(trackToAddOrRemove);
      setIsFavorite(true);
    }
  };

  // Vérifier si ce track est le track sélectionné en comparant le titre et la source
  const isSelected = selectedTrack &&
    selectedTrack.title === title &&
    selectedTrack.src === src;

  return (
    <div className={`${s.track} ${isSelected ? s.active : ''}`} onClick={onClick}>
      <span className={s.order}>{index + 1}</span>
      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <div className={s.details}>
          <span className={s.trackName}>{title}</span>
          {Array.isArray(artists) && artists.length > 0 ? (
            artists.map((artist, i) =>
              artist?.name ? (
                <span key={artist.id || i} className={s.artistName}>
                  {artist.name}
                </span>
              ) : null
            )
          ) : (
            <span className={s.artistName}>{artists?.name || "Artiste inconnu"}</span>
          )}

          <span className={s.duration}>{getSeconds()}</span>
        </div>
      </div>
      <div className={s.controls}>
        <button
          className={`${s.addToPlaylist} ${isFavorite ? s.added : ''}`}
          onClick={handleAddToPlaylist}
          title={isFavorite ? "Retirer de la playlist" : "Ajouter à la playlist"}
        >
          <img
            src={isFavorite ? hearth2Icon : hearthIcon}
            alt=""
            className={s.favorite}
          />
        </button>
      </div>
    </div>
  );
};


Track.propTypes = {
  title: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,

  artists: PropTypes.arrayOf(PropTypes.string).isRequired,
  index: PropTypes.number.isRequired,
};

export default Track;