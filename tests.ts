import { expect } from 'chai';
import { hi } from './index.js';

describe("test", () => {
    it("should pass", () => {
        expect(hi).to.equal(true);
    })
})