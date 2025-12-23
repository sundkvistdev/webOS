import { MemoryFootprint } from "../kernel/memfp.js";

/**
 * @typedef {Object} PreprocessedScript A processed script.
 * @property {string} sandboxedCode The sandboxed code.
 * @property {number} memoryFootprint The virtual memory footprint of the code.
 */

class ScriptLoader {

    constructor() {

    }

    /**
     * Preprocesses the provided raw code,
     * e.g. to calculate the virtual memory footprint.
     * @param {string} rawCode
     * @returns {PreprocessedScript}
     */
    preprocess(rawCode) {
        const cost = MemoryFootprint.getVirtualFootprint(rawCode);

        const sandboxed = `
            const SYSTEM = self.OS_API;
            try {
                ${rawCode}
            } catch (e) {
                postMessage({ type: "CRASH", error: e.message }); 
            }
        `;

        return {
            sandboxedCode: sandboxed,
            memoryFootprint: cost
        };
    }

    /**
     * 
     * @param {string} name 
     * @param {string} rawCode 
     * @returns 
     */
    createProcess(name, rawCode) {
        const { boxed, cost } = this.preprocess(rawCode);

        // TODO, HERE: Attempt memory allocation, if out, cancel or something.

        const blob = new Blob([boxed], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(blob);

        const processWorker = new Worker(workerUrl);
        return {
            processWorker,
            name,
            memoryFootprint: cost
        };
    }

}

export {
    ScriptLoader
};