import { IMeshInfo } from "./iSceneVariables";


export interface ITheme {
    sceneEntities:          ISceneEntity[];
    floorEntity?:           ISceneEntity;
    backgroundColor:        string;
    startCameraPosition:    IVector3D;
    generationArea:         IArea3D;
}

export interface IVector3D {
    x: number;
    y: number;
    z: number;
}

export interface ISceneEntity {
    name:               string;
    meshInfos:          IMeshInfo;
    baseSize:           number;
    radius:             number;
    presenceRatio:      number;
}

export interface IArea3D {
    topLeftFarPosition:         IVector3D;
    bottomRightNearPosition:    IVector3D;
}