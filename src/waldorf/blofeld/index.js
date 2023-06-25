"use strict";

import { floatToPCM } from "wav-recorder-node";
import { flattenWavetable, isValidWaveData } from "../../index.js";
import {MANUFACTURER_ID as WALDORF_ID} from "../constants.js";
import {DEFAULT, PARAMETER, SYSEX, WAVE_COUNT, WAVE_LENGTH} from "./constants.js";

const mask7bits = 0x7F;


// check length and legal characters
const isValidName = (name) => name.length <= 14 && !Array.from(name).some(l => l.charCodeAt() < 0x20 || l.charCodeAt() > 0x7F);
const isValidSlot = (slot) => typeof slot === "number" && slot >= PARAMETER.SLOT.MIN && slot <= PARAMETER.SLOT.MAX;
const isValidWavetable = wavetable => Array.isArray(wavetable) && wavetable.length <= WAVE_COUNT && wavetable.every(isValidWaveData(WAVE_LENGTH));


const waldorfBlofeldWave = (input, name, slot = DEFAULT.SLOT, waveNumber = 0, deviceId = DEFAULT.DEVICE_ID, output = null) => {

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

    result[index] = SYSEX.START;
    index += 1;
    result[index] = WALDORF_ID;
    index += 1;
    result[index] = SYSEX.BLOFELD_ID;
    index += 1;
    result[index] = deviceId; // device number, 0x7F = broadcast
    index += 1;
    result[index] = SYSEX.WAVETABLE_DUMP; // message id
    index += 1;
    result[index] = slot & mask7bits; // location high byte
    index += 1;
    result[index] = waveNumber & mask7bits; // location low byte
    index += 1;

    const checkStart = index;

    // Data part of sysex message
    result[index] = SYSEX.FORMAT;
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
    result[index] = SYSEX.RESERVED;
    index += 1;
    result[index] = SYSEX.RESERVED;
    index += 1;

    const checkEnd = index;

    // checksum
    result[index] = result.subarray(checkStart, checkEnd).reduce((acc, value) => acc + value) & mask7bits;
    index += 1;
    result[index] = SYSEX.END;

    return result;
};


const waldorfBlofeldWavetable = (input = [[],[]], name = DEFAULT.NAME, slot = DEFAULT.SLOT, deviceId = DEFAULT.DEVICE_ID, output = null) => {
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
        waldorfBlofeldWave(input.subarray(i * 128, (i + 1) * 128), name, slot, i, deviceId, result.subarray(i * 410, (i + 1) * 410));
    }
    return result;
};


// create blob for inclusion as download link href
const waldorfBlofeldSysexBlob = (wavetable, name = DEFAULT.NAME, slot = DEFAULT.SLOT, deviceId = DEFAULT.DEVICE_ID) => URL.createObjectURL(new Blob(
    [waldorfBlofeldWavetable(flattenWavetable(wavetable), name, slot, deviceId)],
    {type: "application/midi"}
));


export {
    isValidName,
    isValidSlot,
    isValidWavetable,
    waldorfBlofeldSysexBlob,
    waldorfBlofeldWave,
    waldorfBlofeldWavetable,
    DEFAULT,
    PARAMETER,
    WAVE_COUNT,
    WAVE_LENGTH
};
