"use strict";

import { floatToPCM } from "wav-recorder-node";
import { flattenWavetable, isValidWaveData } from "../../index.js";
import * as BLOFELD from "./constants.js";

const mask7bits = 0x7F;


// check length and legal characters
const isValidName = (name) => name.length <= 14 && !Array.from(name).some(l => l.charCodeAt() < 0x20 || l.charCodeAt() > 0x7F);
const isValidSlot = (slot) => typeof slot === "number" && slot >= BLOFELD.PARAMETER.SLOT.MIN && slot <= BLOFELD.PARAMETER.SLOT.MAX;
const isValidWavetable = wavetable => Array.isArray(wavetable) && wavetable.length <= BLOFELD.WAVE_COUNT && wavetable.every(isValidWaveData(BLOFELD.WAVE_LENGTH));

// create blob for inclusion as download link href
const waldorfBlofeldSysexBlob = (wavetable, name, slot, deviceId) => URL.createObjectURL(
    new Blob(
        [waldorfBlofeldWavetable(null, flattenWavetable(wavetable), name, slot, deviceId)],
        {type: "application/midi"}
    )
);


const waldorfBlofeldWave = (output, input, name, slot = BLOFELD.DEFAULT.SLOT, waveNumber = 0, deviceId = BLOFELD.DEFAULT.DEVICE_ID) => {

    /*
        parameters:
        -----------

        output: Uint8Array, length 410
        input: Float32Array, length >= 128
        name: String, length <= 14
        slot: integer, 80...118
    */


    let result;
    let buffer;

    if (!isValidName(name)) {
        throw new Error("'" + name + "' is not a valid wavetable name");
    }

    if (output === null) {
        buffer = new ArrayBuffer(410);
        result = new Uint8Array(buffer);
    } else {
        result = output;
    }


    let index = 0;


    result[index] = BLOFELD.SYSEX.START;
    index += 1;
    result[index] = BLOFELD.SYSEX.WALDORF_ID;
    index += 1;
    result[index] = BLOFELD.SYSEX.BLOFELD_ID;
    index += 1;
    result[index] = deviceId; // device number, 0x7F = broadcast
    index += 1;
    result[index] = BLOFELD.SYSEX.WAVETABLE_DUMP; // message id
    index += 1;
    result[index] = slot & mask7bits; // location high byte
    index += 1;
    result[index] = waveNumber & mask7bits; // location low byte
    index += 1;

    const checkStart = index;

    // Data part of sysex message
    result[index] = BLOFELD.SYSEX.FORMAT;
    index += 1;

    // wave data

    const dv = new DataView(result.buffer, result.byteOffset + index, 128 * 3);

    floatToPCM(dv, 0, input, 21, false, 7);
    index += (128 * 3);

    // name
    Array.from(name.padEnd(14)).forEach(letter => {
        result[index] = letter.charCodeAt() & mask7bits;
        index += 1;
    });

    // reserved bytes
    result[index] = BLOFELD.SYSEX.RESERVED;
    index += 1;
    result[index] = BLOFELD.SYSEX.RESERVED;
    index += 1;

    const checkEnd = index;

    // checksum
    result[index] = result.subarray(checkStart, checkEnd).reduce((acc, value) => acc + value) & mask7bits;
    index += 1;
    result[index] = BLOFELD.SYSEX.END;

    return result;
};


const waldorfBlofeldWavetable = (output, input = [[],[]], name = BLOFELD.DEFAULT.NAME, slot = BLOFELD.DEFAULT.SLOT, deviceId = BLOFELD.DEFAULT.DEVICE_ID) => {
    /*
        parameters:
        -----------

        output: Uint8Array, length 410 * 64 or null
        input: Float32Array, length >= 128 * 64
        name: String, length <= 14
        slot: integer, 80...118
    */

    let result;
    let buffer;

    if (!isValidName(name)) {
        throw new Error("'" + name + "' is not a valid wavetable name");
    }

    if (output === null) {
        buffer = new ArrayBuffer(410 * 64);
        result = new Uint8Array(buffer);
    } else {
        result = output;
    }

    for (let i = 0; i < 64; i += 1) {
        waldorfBlofeldWave(result.subarray(i * 410, (i + 1) * 410), input.subarray(i * 128, (i + 1) * 128), name, slot, i, deviceId);
    }
    return result;
};


export {
    isValidName,
    isValidSlot,
    isValidWavetable,
    waldorfBlofeldSysexBlob,
    waldorfBlofeldWave,
    waldorfBlofeldWavetable
};
