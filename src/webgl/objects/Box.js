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

    setVariations() {
        this.variations = {};

        this.variations.volume = {};
        this.variations.volume.target = 0;
        this.variations.volume.current = 0;
        this.variations.volume.upEasing = 0.03;
        this.variations.volume.downEasing = 0.002;
        this.variations.volume.getValue = () => {
            const level0 = audioController.fdata[0] / 100;
            const level1 = audioController.fdata[10] / 100;
            const level2 = audioController.fdata[20] / 100;

            return Math.max(level0, level1, level2) * 0.3;
        };
        this.variations.volume.getDefault = () => {
            return 0.152;
        };

        this.variations.lowLevel = {};
        this.variations.lowLevel.target = 0;
        this.variations.lowLevel.current = 0;
        this.variations.lowLevel.upEasing = 0.005;
        this.variations.lowLevel.downEasing = 0.002;
        this.variations.lowLevel.getValue = () => {
            let value = 0.05;
            value *= 0.003;
            value += 0.0001;
            value = Math.max(0, value);

            return value;
        };
        this.variations.lowLevel.getDefault = () => {
            return 0.0003;
        };
        
        this.variations.scaleLevel = {};
        this.variations.scaleLevel.target = 1;
        this.variations.scaleLevel.current = 1;
        this.variations.scaleLevel.upEasing = 0.05;
        this.variations.scaleLevel.downEasing = 0.01;
        this.variations.scaleLevel.getValue = () => {
            let value = audioController.fdata[10] * 0.02;
            return Math.max(1, value); // Empêche le cube de rétrécir en dessous de la taille de base
        };
        this.variations.scaleLevel.getDefault = () => {
            return 1;
        };
    }

    setLights() {
        this.lights = {};

        // Light A
        this.lights.a = {};
        this.lights.a.intensity = 1.85;
        this.lights.a.color = { value: '#ff4500' };
        this.lights.a.color.instance = new THREE.Color(this.lights.a.color.value);
        this.lights.a.position = new THREE.Vector3(2, 3, 4);

        // Light B
        this.lights.b = {};
        this.lights.b.intensity = 1.4;
        this.lights.b.color = { value: '#00bfff' };
        this.lights.b.color.instance = new THREE.Color(this.lights.b.color.value);
        this.lights.b.position = new THREE.Vector3(-2, -3, -4);
    }

    setOffset() {
        this.offset = {};
        this.offset.spherical = new THREE.Spherical(1, Math.random() * Math.PI, Math.random() * Math.PI * 2);
        this.offset.direction = new THREE.Vector3();
        this.offset.direction.setFromSpherical(this.offset.spherical);
    }

    setGeometry() {
        this.geometry = new THREE.BoxGeometry(3, 3, 3);
        this.geometry.computeTangents();
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uLightAColor: { value: this.lights.a.color.instance },
                uLightAPosition: { value: this.lights.a.position },
                uLightAIntensity: { value: this.lights.a.intensity },

                uLightBColor: { value: this.lights.b.color.instance },
                uLightBPosition: { value: this.lights.b.position },
                uLightBIntensity: { value: this.lights.b.intensity },

                uTime: { value: 0 },

                uDisplacementStrength: { value: 0.5 },
                uDistortionStrength: { value: 0.8 },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.group.add(this.mesh);
    }

    update(deltaTime) {
        // Update variations (audio-driven changes)
        for (let _variationName in this.variations) {
            const variation = this.variations[_variationName];
            variation.target = audioController.fdata ? variation.getValue() : variation.getDefault();

            const easing = variation.target > variation.current ? variation.upEasing : variation.downEasing;
            variation.current += (variation.target - variation.current) * easing * deltaTime;
        }

        // Update cube scale based on the audio (low level frequencies)
        this.mesh.scale.set(
            this.variations.scaleLevel.current,
            this.variations.scaleLevel.current,
            this.variations.scaleLevel.current
        );

        // Update material properties
        this.material.uniforms.uDisplacementStrength.value = this.variations.volume.current;
        this.material.uniforms.uDistortionStrength.value = this.variations.lowLevel.current;

        // Time for animation
        this.material.uniforms.uTime.value += deltaTime;
    }
}
