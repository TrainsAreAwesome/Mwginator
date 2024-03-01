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
    
    //vars and consts
    let temp = "1"
    let temp2 = "10"
    let cursor = {
        yPos: "11",
        xPos: "100"
    }

    let input = "101"
    let returnValue = "110"
    let currentLine = "111"
    let currentImageOffset = "1000"
    let loopCounter = "1001"
    let currentDisplayLine = "1010"
    let cursorColour = "1011"

    let displayOffset = 11110001

    //INIT
    loadImmidiate(temp, 0)
    loadImmidiate(temp2, 0)
    loadImmidiate(cursor.yPos, 10000000)
    loadImmidiate(cursor.xPos, 11111000)
    loadImmidiate(input, 0)
    loadImmidiate(returnValue, 0)
    loadImmidiate(currentLine, 0)
    loadImmidiate(currentImageOffset, 10000)
    loadImmidiate(cursorColour, 0)
    jump(110100) //to current line


    //conditional branch return
    label("returnFromBranch")
    returnFromBranch()

    label("renderCursor") //renders the cursor and refreshes the display

        loadReadAPointer(cursor.xPos) //load pointers
        loadWritePointer(cursor.xPos)

        copy("pointer", temp) //copy the screen column that the cursors in into temp

        xor(cursorColour, 1111111111111111, cursorColour) //inverts the cursor colour so it flashes so you can see it

        and(cursor.yPos, cursorColour, temp2) //flashes the cursor

        xor(temp2, temp, temp) //xor the correctly coloured cursor with the rendered drawing (merge them, also if the pixel in the drawing is white it will flash black)
        copy(temp, "pointer") //copy the mergerd column back into the frame buffer


        refreshDisplay()
    returnFromBranch()



    //moving the cursor
    label("moveCursorRight")
        sub(cursor.xPos, 1, cursor.xPos)
    returnFromBranch()

    label("moveCursorLeft")
        add(cursor.xPos, 1, cursor.xPos)
    returnFromBranch()

    label("moveCursorUp")
        lShift(cursor.yPos, cursor.yPos)
    returnFromBranch()

    label("moveCursorDown")
        rShift(cursor.yPos, cursor.yPos)
    returnFromBranch()



    //getting cursor inputs and moving it accordingly
    label("moveCursor")
        getInput(input) //capture user input
        
        and(input, inputs.leftDPad.right, temp) //if move right, move right
        branchIfPositive(labels.moveCursorRight, temp)

        and(input, inputs.leftDPad.left, temp) //if move left, move left
        branchIfPositive(labels.moveCursorLeft, temp)

        and(input, inputs.leftDPad.down, temp) //if move down, move down
        branchIfPositive(labels.moveCursorDown, temp)

        and(input, inputs.leftDPad.up, temp) //if move up, move up
        branchIfPositive(labels.moveCursorUp, temp)

    returnFromBranch()






    //render
    label("render")
        resetFrameBuffer()
        loadImmidiate(currentDisplayLine, displayOffset)
        loadImmidiate(loopCounter, 0)
        copy(currentImageOffset, currentLine)




        label("renderLoop")
            loadReadAPointer(currentLine)
            loadWritePointer(currentDisplayLine)

            copy("pointer", temp2)
            copy(temp2, "pointer")
            

            add(currentLine, 1, currentLine)
            add(loopCounter, 1, loopCounter)
            add(currentDisplayLine, 1, currentDisplayLine)

            sub(loopCounter, 1111, temp2)
            jumpIfZero(labels.renderCursor, temp2)
            jump(labels.renderLoop)


    //main
    label("main")
        console.log(assembledInstrucions.length)
        branch(labels.moveCursor)
        branch(labels.render)
        jump(labels.main)


}
code() //runs through your asm code and assembles it
getSchematic() //turns it into a schematic
saveBin() //nothing atm