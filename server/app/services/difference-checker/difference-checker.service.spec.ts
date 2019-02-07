import "reflect-metadata";

import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { Message } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import { DifferenceCheckerService } from "./difference-checker.service";
import { ImageRequirements } from "./utilities/imageRequirements";

// tslint:disable:no-magic-numbers

let differenceCheckerService: DifferenceCheckerService;

describe("Differece checker service tests", () => {
    const testImageOg: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));
    const testImageDiff: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestDif.bmp"));

    beforeEach(() => {
        differenceCheckerService = new DifferenceCheckerService();
    });

    it("Should return a Buffer", () => {
        const requirements: ImageRequirements = {
            requiredHeight: 480,
            requiredWidth: 640,
            requiredNbDiff: 7,
            originalImage: testImageOg,
            modifiedImage: testImageDiff,
        };

        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage(requirements);
        expect(result).instanceOf(Buffer);
    });

    it("Should return an error of missing 7 differences", () => {

        const testImageDiff1: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/7dots.bmp"));

        const requirements: ImageRequirements = {
            requiredHeight: 480,
            requiredWidth: 640,
            requiredNbDiff: 7,
            originalImage: testImageOg,
            modifiedImage: testImageDiff1,
        };

        const expectedMessage: Message = {
            title: "onError",
            body: Constants.ERROR_MISSING_DIFFERENCES,
        };

        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage(requirements);
        expect(result).to.deep.equal(expectedMessage);
    });

    it("Should return an error of wrong image dimensions", () => {

        const testImageDiff2: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/image9x9_01.bmp"));
        const testImageOg2: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/image9x9_02.bmp"));

        const requirements: ImageRequirements = {
            requiredHeight: 480,
            requiredWidth: 640,
            requiredNbDiff: 7,
            originalImage: testImageOg2,
            modifiedImage: testImageDiff2,
        };

        const expectedMessage: Message = {
            title: "onError",
            body: Constants.ERROR_IMAGES_DIMENSIONS,
        };

        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage(requirements);
        expect(result).to.deep.equal(expectedMessage);
    });

    it("Should return an error of images have unequal dimensions", () => {

        const testImageDiff3: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/whiteTest.bmp"));

        const requirements: ImageRequirements = {
            requiredHeight: 480,
            requiredWidth: 640,
            requiredNbDiff: 7,
            originalImage: testImageOg,
            modifiedImage: testImageDiff3,
        };

        const expectedMessage: Message = {
            title: "onError",
            body: Constants.ERROR_UNEQUAL_DIMENSIONS,
        };

        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage(requirements);
        expect(result).to.deep.equal(expectedMessage);
    });

});