import { code } from "./index.js" //importing the assembly
import * as AEAPI from "ansiescapeapi" //importing the colour stuff
let opOrange = AEAPI.BRGB(255, 127, 39) //defining the colours
let wrYellow = AEAPI.BRGB(255, 242, 0)
let raLime = AEAPI.BRGB(181, 230, 19)
let rbGreen = AEAPI.BRGB(34, 177, 76)
let imGrey = AEAPI.BRGB(127, 127, 127)
let ibDBlue = AEAPI.BRGB(63, 72, 204)
let poLBlue = AEAPI.BRGB(153, 217, 234)

export let padWithZero = (value, amount) => { //pads the left hand side of a string with a zero, so you dont have to yourself
    while (value.length < amount) {
        value = "0" + value
    }
    return value
}

export let assembledInstructions = [] //array for the assembled instructions to go in
export let labels = {} //where label names and values are stored


//-----------------------"FAKE" INSTRUCTIONS------------------------------

export let loadImmidiate = (writeAddress, content) => { //loads an immidieate into reg addr provided
    writeAddress = padWithZero(writeAddress, 8); //formats to 8 bits long
    content = padWithZero(content, 16); //formats to 16 bits long
    let str = `${opOrange}000000${wrYellow}${writeAddress}${raLime}00000000${rbGreen}00000000${imGrey}${content}${ibDBlue}00${poLBlue}000${AEAPI.reset}` //assembles the instruction
    console.log(str) //c-logs the instruction
    assembledInstructions.push(str) //adds the instruction to the list of instructions
    return str //reuturns it if you need it
}

export let copy = (writeAddress, readAddress) => { //copy value between mem adresses, could be ram or register
    writeAddress = padWithZero(writeAddress, 8); //formats to 8 bits long
    readAddress = padWithZero(readAddress, 8); //formats to 8 bits long
    let str = `${opOrange}000000${wrYellow}${writeAddress}${raLime}${readAddress}${rbGreen}00000000${imGrey}0000000000000000${ibDBlue}00${poLBlue}000${AEAPI.reset}` //assembles the instruction
    console.log(str) //c-logs the instruction
    assembledInstructions.push(str) //adds the instruction to the list of instructions
    return str //reuturns it if you need it
}

export let label = (name) => { //defines a label, not an actual instruction in the Mwginator
    let loc = assembledInstructions.length + 1
    labels[`${name}`] = loc.toString(2) //converts current line to binary and adds it to the label list along with name
}

//----------------------------ALU--------------------------------

export let add = (writeAddress = "0", readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //adds two numbers together
    readB = padWithZero(readB, 8);
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000001${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}`
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let sub = (writeAddress = "0", readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //subtracts data b from data a
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000010${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}
export let and = (writeAddress = "0", readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //ANDs two numbers
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000011${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let or = (writeAddress = "0", readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //XORs two numbers
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000100${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let xor = (writeAddress = "0", readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //XORs two numbers
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000101${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let lShift = (writeAddress = "0", readA = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //shifts a number left (up) once
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000110${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}00000000${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let rShift = (writeAddress = "0", readA = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //shifts a number right (down) once
    writeAddress = padWithZero(writeAddress, 8);
    readA = padWithZero(readA, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}000111${wrYellow}${writeAddress}${raLime}${readA}${rbGreen}00000000${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

//---------------------------------JUMPING-----------------------------------------

export let jump = (readA = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //jump
    readA = padWithZero(readA, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010000${wrYellow}00000000${raLime}${readA}${rbGreen}00000000${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let jumpIfZero = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010010${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let jumpNotZero = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010100${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let jumpIfPositive = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010110${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let jumpIfNegative = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}011000${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

//---------------------------SUB-ROUTINES-----------------------------

export let branch = (readA = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => { //jump
    readA = padWithZero(readA, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010001${wrYellow}00000000}${raLime}${readA}${rbGreen}00000000${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let branchIfZero = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010011${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let branchNotZero = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010101${wrYellow}00000000}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let branchIfPositive = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}010111${wrYellow}00000000${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let branchIfNegative = (readA = "0", readB = "0", imediate = "0", imediateBehavour = "01", pointer = "0") => {
    readA = padWithZero(readA, 8);
    readB = padWithZero(readB, 8);
    imediate = padWithZero(imediate, 16);
    imediateBehavour = padWithZero(imediateBehavour, 2);
    pointer = padWithZero(pointer, 3);
    let str = `${opOrange}011001${wrYellow}00000000}${raLime}${readA}${rbGreen}${readB}${imGrey}${imediate}${ibDBlue}${imediateBehavour}${poLBlue}${pointer}${AEAPI.reset}` //put them all into the instruction
    console.log(str)
    assembledInstructions.push(str)
    return str //return the instruction
}

export let returnFromBranch = () => { //returns from a sub-routine
    let str = `${opOrange}011011${wrYellow}00000000${raLime}00000000${rbGreen}00000000${imGrey}0000000000000000${ibDBlue}00${poLBlue}000${AEAPI.reset}`
    console.log(str)
    assembledInstructions.push(str)
    return str
}

//------------------------OTHER-----------------------

export let halt = () => { //stops the clock, doesnt reset pc
    let str = `${opOrange}111111${wrYellow}00000000${raLime}00000000${rbGreen}00000000${imGrey}0000000000000000${ibDBlue}00${poLBlue}000${AEAPI.reset}`
    console.log(str)
    assembledInstructions.push(str)
    return str
}