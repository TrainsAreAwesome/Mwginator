import { code } from "./index.js" //importing the assembly
import * as AEAPI from "ansiescapeapi" //importing the colour stuff
let opOrange = AEAPI.BRGB(255, 127, 39) //defining the colours
let wrYellow = AEAPI.BRGB(255, 242, 0)
let raLime = AEAPI.BRGB(181, 230, 19)
let rbGreen = AEAPI.BRGB(34, 177, 76)
let imGrey = AEAPI.BRGB(127, 127, 127)
let ibDBlue = AEAPI.BRGB(63, 72, 204)
let poLBlue = AEAPI.BRGB(153, 217, 234)
let textColour = AEAPI.RGB(0, 0, 0)

export let assembledInstrucions = []
export let labels = {}
export let stringInstruction = "" //a string thats just all of the binary in one

let padWithZero = (value, amount) => { //pads the left hand side of a string with a zero, so you dont have to yourself
    while (value.length < amount) {
        value = "0" + value
    }
    return value
}

let isVar = (value) => {
    if (value === undefined || value === null) {
        throw console.error("value is", typeof (value));
    }
    if (typeof (value) === "string") {
        return true
    } else {
        return false
    }
}

let getStr = (valueA = 0, valueB = 0, writeAddress = 0, opcode = 0, writeback) => { //CONVERTS ASSEMBLY TO A BINARY
    let strObj = {} //DEFINE THE OBJ CONTAINING THE INSTRUCIOTN
    let immidiateUsed = false

    strObj.opcode = padWithZero(opcode.toString(), 6) //EXPAND THE OPCODE TO 6 BITS
    if (valueA) { //if valueA defined
        if (valueA === "0pointer" || valueA === "pointer") { //if its a pointer
            strObj.readA = "00000000" //set the read add to 0
            strObj.pointer = strObj.pointer | "001" //enable the readA pointer bit
        } else if (isVar(valueA)) { //check if its refering to a var
            strObj.readA = padWithZero(valueA, 8) //if it is put the vars loc into read adress A
        } else { //otherwise
            strObj.readA = "00000000"
            strObj.immidiate = padWithZero(valueA.toString(), 16) //put it into an immiediate
            strObj.immidiateBehavour = strObj.immidiateBehavour | "01" //and set it to go to the A bus
            immidiateUsed = true
        }
    } else {
        strObj.readA = "00000000" //if none is specified, its 0
    }

    if (valueB) { //if valueB defined
        if (valueB === "0pointer" || valueB === "pointer") { //if its a pointer
            strObj.readB = "00000000" //set readB to 0
            strObj.pointer = strObj.pointer | "010" //enable the readB pointer bit
        } else if (isVar(valueB)) { //check if its refering to a var
            strObj.readB = padWithZero(valueB, 8) //if it is put the vars loc into read adress B
        } else { //otherwise
            if(immidiateUsed && valueA !== valueB) {
                throw console.error("Only valueA OR valueB can use an immediate in the same instruction if they are different values!")
            }
            strObj.readB = "00000000"
            strObj.immidiate = padWithZero(valueB.toString(), 16) //put it into an immmiediate
            strObj.immidiateBehavour = strObj.immidiateBehavour | "10" //and set it to go to the B bus
        }
    } else {
        strObj.readB = "00000000" //if none specified its 0
    }

    if (strObj.immidiate === undefined) {
        strObj.immidiate = "0000000000000000"
    }

    if (writeback) {
        strObj.immidiate = padWithZero(writeback.toString(), 16)
    }


    if (writeAddress) { //if a write adress specified
        if (writeAddress === "0pointer" || writeAddress === "pointer") { //if a pointer wants to be used
            strObj.writeAddress = "00000000" //set the write adress to 0
            strObj.pointer = strObj.pointer | "100" //and enable the write adress pointer
        } else { //otherwise
            writeAddress = writeAddress.toString()
            strObj.writeAddress = padWithZero(writeAddress, 8) //add the specified adress to the write adress
        }
    } else { //if no write adress specified
        strObj.writeAddress = "00000000" //its 0
    }


    if (strObj.immidiateBehavour) {
        strObj.immidiateBehavour = strObj.immidiateBehavour.toString()
    } else {
        strObj.immidiateBehavour = "00"
    }
    if (!strObj.pointer) {
        strObj.pointer = "000"
    } else if (strObj.pointer.toString().length < 3) {
        strObj.pointer = padWithZero(strObj.pointer.toString(), 3)
    }
    if(strObj.immidiateBehavour.toString().length < 2) {
        strObj.immidiateBehavour = padWithZero(strObj.immidiateBehavour.toString(), 2)
    }
    return strObj
}

export let renderInstructions = (instruction) => {
    let commandConstruct = textColour
    commandConstruct += opOrange + instruction.opcode
    commandConstruct += wrYellow + instruction.writeAddress
    commandConstruct += raLime + instruction.readA
    commandConstruct += rbGreen + instruction.readB
    commandConstruct += imGrey + instruction.immidiate
    commandConstruct += ibDBlue + instruction.immidiateBehavour
    commandConstruct += poLBlue + instruction.pointer
    //AEAPI.printProsscedString(commandConstruct)
}

let addToString = (str) => {
    let rstr = ""
    rstr += str.opcode
    rstr += str.writeAddress
    rstr += str.readA
    rstr += str.readB
    rstr += str.immidiate
    rstr += str.immidiateBehavour
    rstr += str.pointer
    return rstr
}

//FAKE INSTRUCTIONS
export let loadImmidiate = (writeAddress = 0, content = 0) => {
    let str = getStr(0, 0, padWithZero(writeAddress, 8), 0, content)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let copy = (from = 0, to = 0) => {
    let str = getStr(from, 0, to, 100)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let label = (name) => {
    let loc = assembledInstrucions.length
    labels[name] = loc.toString(2)
    labels[name] = Number(labels[name])
}

export let noOperation = () => {
    let str = getStr()
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

//ALU

export let add = (valueA, valueB, writeAddress) => {
    let str = getStr(valueA, valueB, writeAddress, 1)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let sub = (valueA, valueB, writeAddress) => {
    let str = getStr(valueA, valueB, writeAddress, 10)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let and = (valueA, valueB, writeAddress) => {
    let str = getStr(valueA, valueB, writeAddress, 11)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let or = (valueA, valueB, writeAddress) => {
    let str = getStr(valueA, valueB, writeAddress, 100)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let xor = (valueA, valueB, writeAddress) => {
    let str = getStr(valueA, valueB, writeAddress, 101)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let lShift = (value, writeAddress) => {
    let str = getStr(value, 0, writeAddress, 110)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let rShift = (value, writeAddress) => {
    let str = getStr(value, 0, writeAddress, 111)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}
//JUMPING
export let jump = (adress) => {
    let str = getStr(adress, 0, 0, 10000)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let jumpIfZero = (adress, value) => {
    let str = getStr(adress, value, 0, 10010)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let jumpNotZero = (adress, value) => {
    let str = getStr(adress, value, 0, 10100)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let jumpIfPositive = (adress, value) => {
    let str = getStr(adress, value, 0, 10110)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let jumpIfNegative = (adress, value) => {
    let str = getStr(adress, value, 0, 11000)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}
//BRANCHING
export let branch = (adress) => {
    let str = getStr(adress, 0, 0, 10001)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let branchIfZero = (adress, value) => {
    let str = getStr(adress, value, 0, 10011)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let branchNotZero = (adress, value) => {
    let str = getStr(adress, value, 0, 10101)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let branchIfPositive = (adress, value) => {
    let str = getStr(adress, value, 0, 10111)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let branchIfNegative = (adress, value) => {
    let str = getStr(adress, value, 0, 11001)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let returnFromBranch = () => {
    let str = getStr(0, 0, 0, 11011)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}
//OTHER
export let halt = () => {
    let str = getStr(0, 0, 0, 111111)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let loadReadAPointer = (adress) => {
    let str = getStr(adress, 0, 0, 1000)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let loadReadBPointer = (adress) => {
    let str = getStr(adress, 0, 0, 1001)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let loadWritePointer = (adress) => {
    let str = getStr(adress, 0, 0, 1010)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let resetFrameBuffer = (value) => {
    let str = getStr(value, 0, 0, 1011)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let refreshDisplay = () => {
    let str = getStr(0, 0, 0, 1100)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let refresh7Seg = () => {
    let str = getStr(0, 0, 0, 1101)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}

export let getInput = () => {
    let str = getStr(0, 0, 0, 1110)
    renderInstructions(str)
    assembledInstrucions.push(str)
    stringInstruction+= addToString(str)
}