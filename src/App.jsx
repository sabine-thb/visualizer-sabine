import Canvas from "./components/Canvas/Canvas";
import StartScreen from "./components/StartScreen/StartScreen";
import Dropzone from "./components/Dropzone/Dropzone";
import Tracks from "./components/Tracks/Tracks";
import Picker from "./components/Picker/Picker";
import SelectedTrack from "./components/SelectedTrack/SelectedTrack";
import Favourites from "./components/Favourites/Favourites";

function App() {
  return (
    <>
      <StartScreen />
      <Dropzone />
      <Picker />
      <Tracks />
      <SelectedTrack />
      <Favourites />
      <Canvas />
    </>
  );
}

export default App;
