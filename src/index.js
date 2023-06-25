import {encodeWAV} from "wav-recorder-node";

import * as DEFAULT from "./defaults.js";
import * as WALDORF from "./waldorf/index.js";


const SYSEX = {
    WALDORF
};

const flattenWavetable = (wavetable = [[]]) => {
    const result = new Float32Array(wavetable.length * wavetable[0].length);
    wavetable.forEach((wave, index) => result.set(wave, index * wave.length));
    return result;
};

const wavBlob = (wavetable, resolution = DEFAULT.RESOLUTION, samplerate = DEFAULT.SAMPLE_RATE, float = false) => URL.createObjectURL(
    new Blob(
        [encodeWAV([flattenWavetable(wavetable)], samplerate, float, resolution)],
        {type: "audio/wav"}
    )
);

const _withinBounds = value => typeof value === "number" && Math.abs(value) <= 1;
const isValidWaveData = (requiredLength = null) => data => typeof data === "object" && (Array.isArray(data) || data.constructor.name === "Float32Array") && (requiredLength === null || data.length === requiredLength) && data.every(_withinBounds);


export {
    flattenWavetable,
    isValidWaveData,
    wavBlob,
    SYSEX
};
