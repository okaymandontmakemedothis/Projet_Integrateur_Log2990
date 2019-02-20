import { ISceneObject, SceneObjectType } from "../../../../../common/communication/iSceneObject";
import { SceneConstants } from "../sceneConstants";

export class CollisionBoxGenerator {

    public generateCollisionRadius(sceneObject: ISceneObject): number {
        let radius: number;
        switch (sceneObject.type) {
            case SceneObjectType.Cube:
                radius = this.calculateCubeCollisionRadius(sceneObject);
                break;

            case SceneObjectType.Sphere:
            radius = this.calculateSphereCollisionRadius(sceneObject);
            break;

            case SceneObjectType.Cylinder:
                radius = this.calculateCylinderCollisionRadius(sceneObject);
                break;

            case SceneObjectType.TriangularPyramid:
                radius = this.calculatePyramidCollisionRadius(sceneObject);
                break;

            case SceneObjectType.Cone:
                radius = this.calculateConeCollisionRadius(sceneObject);
                break;

            default:
                radius = this.calculateSphereCollisionRadius(sceneObject);
                break;
        }

        return radius;
    }

    public pythagore(values: number[]): number {

        let result: number = 0;

        values.forEach((element: number) => {
            result += Math.pow(element, SceneConstants.TWO);
        });

        return Math.sqrt(result);
    }

    private calculateCubeCollisionRadius(sceneObject: ISceneObject): number {

        const halfWidth: number = this.divideByTwo(sceneObject.scale.x);
        const halfHeight: number = this.divideByTwo(sceneObject.scale.y);
        const halfDepth: number = this.divideByTwo(sceneObject.scale.z);

        return this.pythagore( [halfWidth, halfHeight, halfDepth] );
    }

    private calculatePyramidCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        const radius: number = sceneObject.scale.x;
        const thirdOfHeight: number = this.divideByThree(sceneObject.scale.y);

        return this.pythagore( [radius, thirdOfHeight] );
    }

    private calculateConeCollisionRadius(sceneObject: ISceneObject): number {

        // for now scale.x = radius and scale.y = heigth
        const radius: number = sceneObject.scale.x;
        const thirdOfHeight: number = this.divideByThree(sceneObject.scale.y);

        return this.pythagore( [radius, thirdOfHeight] );
    }

    private calculateCylinderCollisionRadius(sceneObject: ISceneObject): number {

        const halfRadius: number = this.divideByTwo(sceneObject.scale.x);
        const halfHeight: number = this.divideByTwo(sceneObject.scale.y);

        return this.pythagore( [halfRadius, halfHeight] );
    }

    private calculateSphereCollisionRadius(sceneObject: ISceneObject): number {

        return sceneObject.scale.x;
    }

    private divideByTwo(value: number): number {

        return value / SceneConstants.TWO;
    }

    private divideByThree(value: number): number {

        return value / SceneConstants.THREE;
    }
}