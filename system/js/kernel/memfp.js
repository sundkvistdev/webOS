

const CHAR_COSTS = {
    "+": 4, "-": 4, "*": 4, "/": 4, "%": 4,
    "(": 8,
    "{": 16,
    "[": 32,
    "\"": 128, "`": 128, "'": 128
};

class MemoryFootprint {

    /**
     * Gets the memory footprint of the specified source code.
     * @param {string} src An ES6 source code snippet.
     */
    static getVirtualFootprint(src) {
        let cost = 0;

        for (let i = 0; i < src.length; i++) {
            cost += CHAR_COSTS[src[i]] ?? 1;
        }

        return cost;
    }

}

export {
    MemoryFootprint
};