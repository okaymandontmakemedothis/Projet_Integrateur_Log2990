import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import { ImageManagerService } from "../image-manager.service";

/* tslint:disable:no-any */

let imageManagerService: ImageManagerService;

describe("Image manager service tests", () => {

    chai.use(spies);

    const buffer: Buffer = Buffer.from(["dfgx"]);

    beforeEach(() => {
        imageManagerService = new ImageManagerService();
    });

    it("Should call the stockImage funciton when creating bmp", () => {
        const spy: any = chai.spy.on(imageManagerService, "stockImage");
        imageManagerService.createBMP(buffer, 1);
        chai.expect(spy).to.have.been.called();
    });
});