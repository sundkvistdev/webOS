/**
 * @typedef {Object} MemoryAllocationStatistic A memory allocation.
 * @property {string} owner The owner of the allocated memory.
 * @property {number} size Size of allocation in bytes.
 */

/**
 * @typedef {Object} MemoryStatistics Basic memory statistics.
 * @property {number} bytesUsed Amount of reserved bytes.
 * @property {number} bytesLeft Amount of remaining free bytes.
 * @property {number} poolUsed Amount of allocations made.
 * @property {number} poolLeft Amount of allocations remaining.
 */

const ALLOC_POOL_MAX = 255;

class MemoryManager {

    /**
     * @param {number} totalMemory Total available memory to the system in bytes.
     */
    constructor(totalMemory) {
        /** @type {number} */
        this._totalMemory = totalMemory;

        /** @type {MemoryAllocationStatistic[]} */
        this._allocations = [];

        /** @type {MemoryStatistics} */
        this._allocationStatistics = {
            bytesUsed: 0,
            bytesLeft: 0,
            poolUsed: 0,
            poolLeft: 0
        };
        
        this.updateAllocationStatistics();
    }

    /**
     * Allocates a specified amount of memory under the specified owner.
     * @param {string} owner 
     * @param {number} size 
     * @returns {number}
     */
    allocateMemory(owner, size) {
        this.updateAllocationStatistics();

        if (this._allocations.length > ALLOC_POOL_MAX)
            throw "MEM:POOL_FULL";

        if (size > this.getRemainingMemoryAmount())
            throw "MEM:OUT_OF_MEMORY";

        const allocStat = {
            owner: owner,
            size: size
        };

        return this._allocations.push(allocStat) - 1;
    }

    /**
     * Frees an allocation by the allocation token.
     * @param {string} owner The owner of the original allocation.
     * @param {number} allocation
     * @returns {-1}
     */
    freeMemory(owner, allocation) {
        if (allocation < 0 || allocation > this._allocations.length - 1)
            throw "MEM:FREE_FAILED";

        const original = this._allocations[allocation];

        if (!original)
            throw "MEM:INVALID_ACCESS";

        if (original.owner !== owner)
            throw "MEM:AUTH_ERROR";

        this._allocations[allocation] = null;

        this.updateAllocationStatistics();

        return -1;
    }

    /**
     * Resizes an allocation by the allocation token.
     * @param {string} owner The owner of the original allocation.
     * @param {number} allocation
     * @param {number} newSize
     * @returns {number} The allocation token.
     */
    reallocateMemory(owner, allocation, newSize) {
        if (allocation < 0 || allocation > this._allocations.length - 1)
            throw "MEM:FREE_FAILED";

        const original = this._allocations[allocation];

        if (!original)
            throw "MEM:INVALID_ACCESS";

        if (original.owner !== owner)
            throw "MEM:AUTH_ERROR";

        if (original.size === newSize)
            throw "MEM:USELESS_OPERATION";

        if (newSize < original.size) {
            original.size = newSize;
            this.updateAllocationStatistics();
            return allocation;
        }

        this.updateAllocationStatistics();

        if (newSize - original.size > this.getRemainingMemoryAmount())
            throw "MEM:OUT_OF_MEMORY";

        original.size = newSize;
        this.updateAllocationStatistics();
        return allocation;
    }

    /**
     * Updates the allocation statistics.
     * Not recommended to call manually.
     */
    updateAllocationStatistics() {
        let used = 0;
        let poolUsed = ALLOC_POOL_MAX;

        this._allocations.forEach(allocation => {
            if (!allocation)
                return;
            used += allocation.size;
        });

        this._allocationStatistics.bytesUsed = used;
        this._allocationStatistics.bytesLeft = this._totalMemory - used;
        this._allocationStatistics.poolUsed = poolUsed;
        this._allocationStatistics.poolLeft = ALLOC_POOL_MAX - poolUsed;
    }

    /**
     * Gets the amount of total memory (used and available) in the system.
     */
    getTotalMemoryAmount() {
        return this._totalMemory;
    }

    /**
     * Gets the amount of remaining free memory in the system.
     */
    getRemainingMemoryAmount() {
        return this._allocationStatistics.bytesLeft;
    }

    /**
     * Gets the amount of used memory in the system.
     */
    getUsedMemoryAmount() {
        return this._allocationStatistics.bytesUsed;
    }
}

export {
    MemoryManager
};