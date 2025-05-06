// ../../utils/store.js
import { create } from "zustand";
import TRACKS from "./TRACKS";

const useStore = create((set, get) => ({
  // defaultTracks: TRACKS,

  // la liste processed par la librairie, et prête à être rendue dans le DOM
  tracks: [],
  setTracks: (_tracks) =>
    set(() => ({
      tracks: _tracks,
    })),

  // Track sélectionné
  selectedTrack: null,
  setSelectedTrack: (track) =>
    set(() => ({
      selectedTrack: track,
    })),

  // Playlist
  playlist: [],

  // Ajouter un track à la playlist
  addToPlaylist: (track) => {
    const { playlist } = get();
    // Vérifier si le track n'est pas déjà dans la playlist
    const trackExists = playlist.some((t) =>
      t.title === track.title &&
      t.src === track.src
    );

    if (!trackExists) {
      set((state) => ({
        playlist: [...state.playlist, track],
      }));
    }
  },

  // Supprimer un track de la playlist
  removeFromPlaylist: (trackToRemove) => {
    set((state) => ({
      playlist: state.playlist.filter(track =>
        track.title !== trackToRemove.title || track.src !== trackToRemove.src
      ),
    }));
  },
}));

export default useStore;