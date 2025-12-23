

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
     * @param {string} rawCode The raw ES6 source code.
     */
    static getVirtualFootprint(rawCode) {
        let cost = 0;

        for (let i = 0; i < rawCode.length; i++) {
            cost += CHAR_COSTS[rawCode[i]] ?? 1;
        }

        return cost;
    }

}

export {
    MemoryFootprint
};