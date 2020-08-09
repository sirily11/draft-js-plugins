import {AdditionalProps, BasePlugin} from "../index";
import {ContentBlock} from "draft-js";

class TestPlugin extends BasePlugin {
    blockStyleFn(block: ContentBlock, additional: AdditionalProps): string | undefined {
        return "hello world"
    }

    blockRendererFn(block: ContentBlock, additional: AdditionalProps): any {
        return "a";
    }

}

describe("Test Base plugin", () => {
    it("Test Plugin", () => {
        let plugin = new TestPlugin();
        let result = plugin.createPlugin();
        expect(result.blockStyleFn).toBeDefined()
        expect(result.blockRendererFn).toBeDefined()
        expect(result.customStyleFn).toBeUndefined()
    })
})