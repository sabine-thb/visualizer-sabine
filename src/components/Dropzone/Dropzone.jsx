import s from "./Dropzone.module.scss";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";

import Button from "../Button/Button";

const Dropzone = () => {
  const { tracks, setTracks } = useStore();

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Créer un tableau temporaire
      const tracksArray = [];

      acceptedFiles.forEach((file, i) => {
        const path = URL.createObjectURL(file);

        //   // Créer un objet avec la structure similaire à celle de TRACKS dans TRACKS.js
        const _track = {
          name: file.name,
          path: path,
          id: tracks.length + i,
        };

        tracksArray.push(_track);
      });

      fetchMetadata(tracksArray, tracks, setTracks);
    },
    [tracks]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: onDrop,
    noClick: true,
    accept: {
      "audio/mpeg": [],
      "audio/mp3": [],
      "audio/wav": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
      ${s.dropzone} 
      ${isDragActive ? s.dropzone_active : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className={s.import}>
        <Button label={"Importer un son"} onClick={open} />
      </div>
    </div>
  );
};

export default Dropzone;
