import * as THREE from "three";
import audioController from "../../utils/AudioController";
import fragmentShader from "../shaders/cover/fragment.glsl";
import vertexShader from "../shaders/cover/vertex.glsl";

export default class Box {
    constructor() {
        this.group = new THREE.Group();

        this.timeFrequency = 0.0003;
        this.elapsedTime = 0;

        this.setVariations();
        this.setGeometry();
        this.setLights();
        this.setOffset();
        this.setMaterial();
        this.setMesh();
    }

    // Paramètres des variations basées sur l'audio
    setVariations() {
        this.variations = {};

        this.variations.volume = {
            target: 0,
            current: 0,
            upEasing: 0.03,
            downEasing: 0.002,
            getValue: () => {
                const level0 = audioController.fdata[0] / 100;
                const level1 = audioController.fdata[10] / 100;
                const level2 = audioController.fdata[20] / 100;
                return Math.max(level0, level1, level2) * 0.3;
            },
            getDefault: () => 0.152
        };

        this.variations.lowLevel = {
            target: 0,
            current: 0,
            upEasing: 0.005,
            downEasing: 0.002,
            getValue: () => {
                let value = 0.05 * 0.003 + 0.0001;
                return Math.max(0, value);
            },
            getDefault: () => 0.0003
        };

        this.variations.scaleLevel = {
            target: 1,
            current: 1,
            upEasing: 0.05,
            downEasing: 0.01,
            getValue: () => Math.max(1, audioController.fdata[10] * 0.02),
            getDefault: () => 1
        };
    }

    // Paramétrage des lumières directionnelles et ambiantes
    setLights() {
        this.lights = {};

        // Light A
        this.lights.a = {
            intensity: 1.85,
            color: { value: '#ff4500' },
            colorInstance: new THREE.Color('#ff4500'),
            position: new THREE.Vector3(2, 3, 4)
        };

        // Light B
        this.lights.b = {
            intensity: 1.4,
            color: { value: '#00bfff' },
            colorInstance: new THREE.Color('#00bfff'),
            position: new THREE.Vector3(-2, -3, -4)
        };

        // Lumière ambiante pour éclairer uniformément la scène
        this.ambientLight = new THREE.AmbientLight(0x404040, 1); // Douce lumière ambiante
    }

    // Positionnement aléatoire pour l'animation
    setOffset() {
        this.offset = {};
        this.offset.spherical = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
        this.offset.direction = new THREE.Vector3();
        this.offset.direction.setFromSpherical(this.offset.spherical);
    }

    // Création de la géométrie du cube
    setGeometry() {
        this.geometry = new THREE.BoxGeometry(3, 3, 3);
        this.geometry.computeTangents();
    }

    // Création du matériau avec shaders personnalisés
    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uLightAColor: { value: this.lights.a.colorInstance },
                uLightAPosition: { value: this.lights.a.position },
                uLightAIntensity: { value: this.lights.a.intensity },
                uLightBColor: { value: this.lights.b.colorInstance },
                uLightBPosition: { value: this.lights.b.position },
                uLightBIntensity: { value: this.lights.b.intensity },
                uTime: { value: 0 },
                uDisplacementStrength: { value: 0.5 },
                uDistortionStrength: { value: 0.8 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });
    }

    // Création de l'objet Mesh (Cube)
    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.group.add(this.mesh);
    }

    // Mise à jour des variations basées sur l'audio et autres propriétés
    update(deltaTime) {
        // Mise à jour des variations (modification basée sur l'audio)
        for (let variationName in this.variations) {
            const variation = this.variations[variationName];
            variation.target = audioController.fdata ? variation.getValue() : variation.getDefault();

            const easing = variation.target > variation.current ? variation.upEasing : variation.downEasing;
            variation.current += (variation.target - variation.current) * easing * deltaTime;
        }

        // Mise à jour de l'échelle du cube en fonction du niveau audio
        this.mesh.scale.set(
            this.variations.scaleLevel.current,
            this.variations.scaleLevel.current,
            this.variations.scaleLevel.current
        );

        // Mise à jour des propriétés du matériau
        this.material.uniforms.uDisplacementStrength.value = this.variations.volume.current;
        this.material.uniforms.uDistortionStrength.value = this.variations.lowLevel.current;

        // Mise à jour du temps pour l'animation
        this.material.uniforms.uTime.value += deltaTime;
    }
}
