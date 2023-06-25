import {MANUFACTURER_ID as WALDORF_ID} from "../index.js";

const SLOT = {
    MIN: 80,
    MAX: 118
};

const NAME = {
    MAX_LENGTH: 14
};

const WAVE_COUNT = 64;
const WAVE_LENGTH = 128;

const SYSEX = {
    START: 0xF0,
    WALDORF_ID,
    BLOFELD_ID: 0x13,
    WAVETABLE_DUMP: 0x12,
    FORMAT: 0x00,
    RESERVED: 0x00,
    END: 0xF7
};

const BROADCAST_DEVICE_ID = 0x7F;

const DEVICE_ID = {
    "all": BROADCAST_DEVICE_ID,
    "00": 0x00,
    "01": 0x01,
    "02": 0x02,
    "03": 0x03,
    "04": 0x04,
    "05": 0x05,
    "06": 0x06,
    "07": 0x07,
    "08": 0x08,
    "09": 0x09,
    "0A": 0x0A,
    "0B": 0x0B,
    "0C": 0x0C,
    "0D": 0x0D,
    "0E": 0x0E,
    "0F": 0x0F,

    "10": 0x10,
    "11": 0x11,
    "12": 0x12,
    "13": 0x13,
    "14": 0x14,
    "15": 0x15,
    "16": 0x16,
    "17": 0x17,
    "18": 0x18,
    "19": 0x19,
    "1A": 0x1A,
    "1B": 0x1B,
    "1C": 0x1C,
    "1D": 0x1D,
    "1E": 0x1E,
    "1F": 0x1F,

    "20": 0x20,
    "21": 0x21,
    "22": 0x22,
    "23": 0x23,
    "24": 0x24,
    "25": 0x25,
    "26": 0x26,
    "27": 0x27,
    "28": 0x28,
    "29": 0x29,
    "2A": 0x2A,
    "2B": 0x2B,
    "2C": 0x2C,
    "2D": 0x2D,
    "2E": 0x2E,
    "2F": 0x2F,

    "30": 0x30,
    "31": 0x31,
    "32": 0x32,
    "33": 0x33,
    "34": 0x34,
    "35": 0x35,
    "36": 0x36,
    "37": 0x37,
    "38": 0x38,
    "39": 0x39,
    "3A": 0x3A,
    "3B": 0x3B,
    "3C": 0x3C,
    "3D": 0x3D,
    "3E": 0x3E,
    "3F": 0x3F,

    "40": 0x40,
    "41": 0x41,
    "42": 0x42,
    "43": 0x43,
    "44": 0x44,
    "45": 0x45,
    "46": 0x46,
    "47": 0x47,
    "48": 0x48,
    "49": 0x49,
    "4A": 0x4A,
    "4B": 0x4B,
    "4C": 0x4C,
    "4D": 0x4D,
    "4E": 0x4E,
    "4F": 0x4F,

    "50": 0x50,
    "51": 0x51,
    "52": 0x52,
    "53": 0x53,
    "54": 0x54,
    "55": 0x55,
    "56": 0x56,
    "57": 0x57,
    "58": 0x58,
    "59": 0x59,
    "5A": 0x5A,
    "5B": 0x5B,
    "5C": 0x5C,
    "5D": 0x5D,
    "5E": 0x5E,
    "5F": 0x5F,

    "60": 0x60,
    "61": 0x61,
    "62": 0x62,
    "63": 0x63,
    "64": 0x64,
    "65": 0x65,
    "66": 0x66,
    "67": 0x67,
    "68": 0x68,
    "69": 0x69,
    "6A": 0x6A,
    "6B": 0x6B,
    "6C": 0x6C,
    "6D": 0x6D,
    "6E": 0x6E,
    "6F": 0x6F,

    "70": 0x70,
    "71": 0x71,
    "72": 0x72,
    "73": 0x73,
    "74": 0x74,
    "75": 0x75,
    "76": 0x76,
    "77": 0x77,
    "78": 0x78,
    "79": 0x79,
    "7A": 0x7A,
    "7B": 0x7B,
    "7C": 0x7C,
    "7D": 0x7D,
    "7E": 0x7E
};

const PARAMETER = {
    DEVICE_ID,
    SLOT,
    NAME,
};

const DEFAULT = {
    NAME: "wavetable",
    SLOT: SLOT.MIN,
    DEVICE_ID: BROADCAST_DEVICE_ID
};

export {
    SYSEX,
    PARAMETER,
    DEFAULT,
    WAVE_LENGTH,
    WAVE_COUNT
};
