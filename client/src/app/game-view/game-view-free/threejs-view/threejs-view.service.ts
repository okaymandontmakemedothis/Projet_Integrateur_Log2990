import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

// je disable les magic number pour linstant, car les chiffres ici sont pour les position et les vecteurs
// je suis pas trop sur encore comment les placer alors je les garde comme ca, on changera les valeurs apres

// tslint:disable:no-magic-numbers

@Injectable()
export class ThreejsViewService {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private ambLight: THREE.AmbientLight;
  private sceneVariable: ISceneVariables;
  private threejsGenerator: ThreejsGenerator;

  public constructor() {
    this.init();
  }

  private init(): void {
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.ambLight = new THREE.AmbientLight(0xEA6117, 0.4);
  }

  public createScene(scene: THREE.Scene, iSceneVariables: ISceneVariables, renderer: THREE.WebGLRenderer): void {
    this.renderer = renderer;
    this.scene = scene;
    this.sceneVariable = iSceneVariables;
    this.threejsGenerator = new ThreejsGenerator(this.scene);
    this.renderer.setSize(640, 480);
    this.renderer.setClearColor(this.sceneVariable.sceneBackgroundColor);
    this.createLighting();
    this.generateSceneObjects();

    this.camera.lookAt(this.scene.position);
  }

  private createLighting(): void {

    const firstLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xEA6117, 5);
    const secondLight: THREE.DirectionalLight = new THREE.DirectionalLight(0xEA6117, 1);

    firstLight.position.set(100, 100, 50);
    secondLight.position.set(-10, -10, -10);

    this.scene.add(firstLight);
    this.scene.add(secondLight);
    this.scene.add(this.ambLight);
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  private renderObject(): void {
    const speed: number = Date.now() * 0.001;

    this.camera.position.x = Math.cos(speed) * 70;
    this.camera.position.z = Math.sin(speed) * 70;
    this.camera.position.y = 70;

    this.scene.position.y = 50;

    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

  private generateSceneObjects(): void {
    this.sceneVariable.sceneObjects.forEach((element: ISceneObject) => {
      this.threejsGenerator.initiateObject(element);
    });
  }

}
