import { injectable } from "inversify";
import { Message } from "../../../../common/communication/message";
import { BufferManager } from "./utilities/bufferManager";
import { CircleDifferences } from "./utilities/circleDifferences";
import { ClusterCounter } from "./utilities/clusterCounter";
import { ImageRequirements } from "./utilities/imageRequirements";
import { ImagesDifference } from "./utilities/imagesDifference";

const CIRCLE_RADIUS: number = 3;
const WIDTH_START: number = 18;
const WIDTH_END: number = 22;
const HEIGHT_END: number = 26;
const HEADER_INDEX: number = 0;
const BODY_INDEX: number = 1;

@injectable()
export class DifferenceCheckerService {

    private bufferManager: BufferManager;
    private splittedOriginal: Buffer[];
    private splittedDifferent: Buffer[];
    private circledDifferences: number[];

    public constructor() {
        this.bufferManager = new BufferManager();
    }

    public generateDifferenceImage(requirements: ImageRequirements): Buffer | Message {

        let numberOfDifferences: number = 0;

        try {
            numberOfDifferences = this.calculateDifferences(requirements);
        } catch (error) {
            return this.sendErrorMessage(error.message);
        }

        if (this.imageHasNotDimensionsNeeded(this.splittedOriginal) ||
            this.imageHasNotDimensionsNeeded(this.splittedDifferent)) {

            return this.sendErrorMessage("Les images n'ont pas les bonnes dimensions");
        }

        if (numberOfDifferences === requirements.requiredNbDiff) {

            const dataImageBuffer: Buffer = this.bufferManager.arrayToBuffer(this.circledDifferences);

            return this.bufferManager.mergeBuffers(this.splittedOriginal[HEADER_INDEX], dataImageBuffer);

        } else {

            return this.sendErrorMessage("Les images ne contiennent pas 7 erreures");
        }
    }

    private calculateDifferences(requirements: ImageRequirements): number {

        this.splittedOriginal = this.bufferManager.splitHeader(requirements.originalImage);
        this.splittedDifferent = this.bufferManager.splitHeader(requirements.modifiedImage);

        const differencesFound: number[] = this.findDifference(this.splittedOriginal[BODY_INDEX], this.splittedDifferent[BODY_INDEX]);
        this.circledDifferences = this.circleDifference(differencesFound, requirements.requiredWidth);

        return this.countAllClusters(this.circledDifferences, requirements.requiredWidth);
    }

    private findDifference(orignalBuffer: Buffer, differenceBuffer: Buffer): number[] {
        const imagesDifference: ImagesDifference = new ImagesDifference();

        return imagesDifference.searchDifferenceImage(orignalBuffer, differenceBuffer);
    }

    private circleDifference(differencesArray: number[], width: number): number[] {
        const circleDifferences: CircleDifferences = new CircleDifferences( differencesArray, width, CIRCLE_RADIUS);

        return circleDifferences.circleAllDifferences();
    }

    private countAllClusters(differenceList: number[], width: number): number {
        const clusterCounter: ClusterCounter = new ClusterCounter(differenceList, width);

        return clusterCounter.countAllClusters();
    }

    private sendErrorMessage(message: string): Message {
        return {
            title: "onError",
            body: message,
        } as Message;
    }

    private imageHasNotDimensionsNeeded(splittedBuffer: Buffer[]): boolean {
        const imageWidht: Buffer = this.extractWidth(splittedBuffer[HEADER_INDEX]);
        const imageHeight: Buffer = this.extractHeight(splittedBuffer[HEADER_INDEX]);

        const requiredWidth: Buffer = Buffer.from("80020000", "hex");
        const requiredHeight: Buffer = Buffer.from("e0010000", "hex");

        let isEqual: boolean = true;

        for (let i: number = 0; i < imageWidht.length; i++) {
            if (imageWidht[i] !== requiredWidth[i] ||
               imageHeight[i] !== requiredHeight[i]) {
                   isEqual = false;
               }
        }

        return !isEqual;
    }

    private extractWidth(buffer: Buffer): Buffer {
        return buffer.slice(WIDTH_START, WIDTH_END);
    }

    private extractHeight(buffer: Buffer): Buffer {
        return buffer.slice(WIDTH_END, HEIGHT_END);
    }

}
