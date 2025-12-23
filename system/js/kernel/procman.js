import { Process } from "./process.js";

/**
 * @typedef {Object} ProcessParams Process parameters.
 * @property {number} initialMemorySize The initially allocated memory amount.
 * @property {number} maxMemorySize The maximum absolute allowed memory occupation.
 */

const MAX_PROCESSES = 100;
const PID_BASE = 1000;

const DEFAULT_INMEMSZ = 255;
const DEFAULT_MAXMEMSZ = 65535;

class ProcessManager {

    /**
     * @param {number} processCap Maximum amount of processes.
     */
    constructor(processCap = MAX_PROCESSES) {
        /** @type {any[]} */
        this._processes = [];

        /** @type {number} */
        this._nextPid = 1000;
    }

    /**
     * Starts a specified process with the specified parameters.
     * @param {Process} process 
     * @param {ProcessParams} params 
     * @returns {number} The process identifier (PID).
     */
    startProcess(process, params = {
        initialMemorySize: DEFAULT_INMEMSZ,
        maxMemorySize: DEFAULT_MAXMEMSZ
    }) {
        if (this._nextPid - PID_BASE >= MAX_PROCESSES)
            throw "PROCMAN:PROCESS_OVERFLOW";

        return this._nextPid++;
    }

    endProcess(pid, params) {

    }

}