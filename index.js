import { getSchematic } from "./getschem.js"
import { assembledInstrucions, labels, renderInstructions } from "./newAsm.js"
import { label } from "./newAsm.js"
import { loadImmidiate } from "./newAsm.js"
import { copy } from "./newAsm.js"
import { noOperation } from "./newAsm.js"
import { add } from "./newAsm.js"
import { sub } from "./newAsm.js"
import { and } from "./newAsm.js"
import { or } from "./newAsm.js"
import { xor } from "./newAsm.js"
import { lShift } from "./newAsm.js"
import { rShift } from "./newAsm.js"
import { jump } from "./newAsm.js"
import { jumpIfZero } from "./newAsm.js"
import { jumpNotZero } from "./newAsm.js"
import { jumpIfPositive } from "./newAsm.js"
import { jumpIfNegative } from "./newAsm.js"
import { branch } from "./newAsm.js"
import { branchIfZero } from "./newAsm.js"
import { branchNotZero } from "./newAsm.js"
import { branchIfPositive } from "./newAsm.js"
import { branchIfNegative } from "./newAsm.js"
import { returnFromBranch } from "./newAsm.js"
import { halt } from "./newAsm.js"
import { loadReadAPointer } from "./newAsm.js"
import { loadReadBPointer } from "./newAsm.js"
import { loadWritePointer } from "./newAsm.js"
import { resetFrameBuffer } from "./newAsm.js"
import { refreshDisplay } from "./newAsm.js"
import { refresh7Seg } from "./newAsm.js"
import { getInput } from "./newAsm.js"
import { saveBin } from "./newAsm.js"
import { isVar } from "./newAsm.js"
export let sevenSeg = "11110000"
export let display = [
    "11110001",
    "11110010",
    "11110011",
    "11110100",
    "11110101",
    "11110110",
    "11110111",
    "11111000",
    "11111001",
    "11111010",
    "11111011",
    "11111100",
    "11111101",
    "11111110",
    "11111111"
]
let displayAsNum = [
    11110001,
    11110010,
    11110011,
    11110100,
    11110101,
    11110110,
    11110111,
    11111000,
    11111001,
    11111010,
    11111011,
    11111100,
    11111101,
    11111110,
    11111111
]
let inputs = { //stores the bitmasks for each input
    toggles: {
        one: 1,
        two: 10,
        three: 100,
        four: 1000
    },

    rightDPad: {
        right: 10000,
        down: 100000,
        left: 1000000,
        up: 10000000
    },

    leftDPad: {
        right: 100000000,
        down: 1000000000,
        left: 10000000000,
        up: 100000000000
    }
}

export let code = () => { //main function and entry point for the assembler, put your code inside it
    //Variables: let <name> = "<adress>"
    //Immediates to use later: const <name> = <number>
    //dont name a variable pointer or 0pointer bc that will mess things up



}
code() //runs through your asm code and assembles it
getSchematic() //turns it into a schematic
saveBin() //nothing atm