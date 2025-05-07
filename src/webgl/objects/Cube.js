import * as THREE from "three";
import audioController from "../../utils/AudioController";

export default class Cube {
  constructor() {
    this.group = new THREE.Group();
    this.count = 0;

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      // roughness: 0.5,
      // metalness: 0.5,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.group.add(this.mesh);

  }

  update(time, deltaTime) {
    const fdata = audioController.fdata;

    const isAudioPlaying = fdata && fdata.length > 0 && [...fdata].some((val) => val > 1);

    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.015;


    this.mesh.position.y = Math.sin(time * 0.001) * 0.5;

    if (audioController.bpm && isAudioPlaying) {
      this.count += deltaTime * 0.001;

      if (this.count > 60 / audioController.bpm) {
        this.material.color.setRGB(Math.random(), Math.random(), Math.random());
        this.count = 0;
      }
    }
  }

}
