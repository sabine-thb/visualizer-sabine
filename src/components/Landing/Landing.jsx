import s from "./Landing.module.scss";
import AudioController from "../../utils/AudioController";
import { useState, useEffect } from "react";
import Button from "../Button/Button";

const Landing = () => {
  const [hasClicked, setHasClicked] = useState(false);
  const [hideCompletely, setHideCompletely] = useState(false);

  const onClick = () => {
    AudioController.setup();
    setHasClicked(true);

    // ⏳ Retirer du DOM après l'animation (500ms = durée du fondu)
    setTimeout(() => setHideCompletely(true), 500);
  };

  if (hideCompletely) return null;

  return (
    <section className={`${s.landing} ${hasClicked ? s.landingHidden : ""}`}>
      <div className={s.videoContainer}>
        <video
          className={s.video}
          autoPlay
          loop
          muted
          playsInline
          src="/video/background2.mp4"
          type="video/mp4"
        />
      </div>
      <div className={s.content}>
          <p className={s.description}>
            Une expérience immersive de visualisation musicale en 3D.
          </p>

          <h1 className={s.headerText} aria-hidden="true">
            Visualizer
          </h1>

          <p className={s.subtitle}>
                Importez vos propres morceaux ou explorez des extraits de 30 secondes issus de Deezer.        
          </p>
          <Button label="Découvrir" onClick={onClick} />

      </div>
        
       
    </section>
  );
};

export default Landing;
