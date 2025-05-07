import { useEffect } from "react";

import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";

import fetchJsonp from "fetch-jsonp";

import s from "./Tracks.module.scss";

const Tracks = () => {

  // permet d'alterner entre true et false pour afficher / cacher le composant
  //const [showTracks, setShowTracks] = useState(false);
  const { tracks, setTracks } = useStore();


  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      // l'utilisateur a appuyé sur sa touche entrée
      const userInput = e.target.value;

      // appeler la fonction
      getSongs(userInput);
    }
  };

  const getSongs = async (userInput) => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );

    if (response.ok) {
      response = await response.json();

      setTracks(response.data);
    } else {
      // erreurs
    }
  };

  const resetTracks = () => {
    // Réinitialiser la liste des tracks avec les tracks locaux
    fetchMetadata(TRACKS, [], setTracks);
  };

  return (
    <section className={s.wrapper}>
      <input
        type="text"
        placeholder="Rechercher un morceau..."
        className={s.searchInput}
        onKeyDown={onKeyDown}
      />

      <button
        className={s.resetButton}
        onClick={resetTracks}
        title="Réinitialiser la recherche"
      >
        <img src="/textures/icons/restart.svg" alt="Réinitialiser la recherche" />
      </button>

      <div className={s.tracks}>
        {tracks.map((track, i) => (
          <Track
            key={track.title + i}
            title={track.title}
            duration={track.duration}
            cover={track.album.cover_xl}
            artists={track.artist ? [track.artist] : track.artists || []}
            src={track.preview}
            index={i}
          />
        ))}
      </div>
    </section>
  );
};

export default Tracks;
