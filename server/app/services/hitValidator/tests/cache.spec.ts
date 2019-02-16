import * as chai from "chai";
import * as spies from "chai-spies";
import { Cache, ICacheElement } from "../cache";

// tslint:disable:no-magic-numbers no-any

let cache: Cache;

const urls: string[] = ["a", "b", "c", "d", "e"];

const buffers: Buffer[] = [
    Buffer.from([0, 1, 2]),
    Buffer.from([12, 13, 24]),
    Buffer.from([34, 56, 54]),
    Buffer.from([45, 1, 78]),
    Buffer.from([4, 123, 232]),
];

const elements: ICacheElement[] = [
    { imageUrl: urls[0], buffer: buffers[0]},
    { imageUrl: urls[1], buffer: buffers[1]},
    { imageUrl: urls[2], buffer: buffers[2]},
    { imageUrl: urls[3], buffer: buffers[3]},
    { imageUrl: urls[4], buffer: buffers[4]},
];

describe("Cache tests", () => {

    beforeEach(() => {
        cache = new Cache(3);
        chai.use(spies);
    });

});
