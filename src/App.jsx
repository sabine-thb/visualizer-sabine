import Canvas from "./components/Canvas/Canvas";
import Landing from "./components/Landing/Landing";
import Dropzone from "./components/Dropzone/Dropzone";
import Tracks from "./components/Tracks/Tracks";
import Picker from "./components/Picker/Picker";
import SelectedTrack from "./components/SelectedTrack/SelectedTrack";
import Playlist from "./components/Playlist/Playlist";

function App() {
  return (
    <>
      <Landing />
      <Dropzone />
      <Picker />
      <Tracks />
      <SelectedTrack />
      <Playlist />
      <Canvas />
    </>
  );
}

export default App;
