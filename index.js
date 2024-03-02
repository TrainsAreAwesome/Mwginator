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
    let oldInput = "1100"

    let displayOffset = 11110000
    let originalImageOffset = 10001

    //INIT
    loadImmidiate(temp, 0) //resetting all the needed registers so preivous programmes dont mess things up
    loadImmidiate(temp2, 0)
    loadImmidiate(cursor.yPos, 10000000)
    loadImmidiate(cursor.xPos, 11111000)
    loadImmidiate(input, 0)
    loadImmidiate(returnValue, 0)
    loadImmidiate(currentLine, 0)
    loadImmidiate(currentImageOffset, 10001) //auto loads image 0
    loadImmidiate(cursorColour, 0)
    jump(1011101) //to current line


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



    //moving the cursor and making sure it doesnt go off the screen
    label("moveCursorRight")
        sub(cursor.xPos, displayAsNum[0], temp) //if cursor is at edge of screen
        jumpIfZero(labels.returnFromBranch, temp) //the break
        sub(cursor.xPos, 1, cursor.xPos) //else move the cursor right
    returnFromBranch()

    label("moveCursorLeft")
        sub(cursor.xPos, displayAsNum[14], temp)
        jumpIfZero(labels.returnFromBranch, temp)
        add(cursor.xPos, 1, cursor.xPos)
    returnFromBranch()

    label("moveCursorUp")
        jumpIfNegative(labels.returnFromBranch, cursor.yPos)
        lShift(cursor.yPos, cursor.yPos)
    returnFromBranch()

    label("moveCursorDown")
        sub(cursor.yPos, 1, temp)
        jumpIfZero(labels.returnFromBranch, temp)
        rShift(cursor.yPos, cursor.yPos)
    returnFromBranch()



    //getting cursor inputs and moving it accordingly
    label("moveCursor")
        copy(input, oldInput) //gets the old input and puts it into oldInput
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



    //changes which file is pointed to by currentImageOffset
    label("changeFile")
        and(input, 11110000, temp) //if the file selected is the same, then just return
        and(oldInput, 11110000, temp2)
        sub(temp, temp2, temp2)

        jumpIfZero(labels.returnFromBranch, temp2) 
        //if they *arnt* the same then use do some stuff to turn the input into the pointer to the images location in ram

        add(temp, originalImageOffset, temp) //adds the offset for image location 0 so when you select zero it doesnt overwrite registers
        sub(temp, 11110001, temp2) //if its pointed at the frame buffer then return (you dont want it to point to the frame buffer)
        jumpIfZero(labels.returnFromBranch, temp2)

        and(temp, 11111110, temp2) //if the adress overflows and points to registers this detects it and returns
        jumpIfZero(labels.returnFromBranch, temp2)

        copy(temp, currentImageOffset) //set the current image offset to the new value
    returnFromBranch()
    
    
    label("writePixel") //writes a pixel into the image at the cursors position
        
        and(cursor.xPos, 1111, temp) //gets the 0-15 x cordiante
        add(temp, currentImageOffset, temp) //adds the offset to get the x cord of the cursor if it was in the image stored in ram

        loadWritePointer(temp) //loads the x coord as a pointer (x coords are actually just memory adresses)
        loadReadAPointer(temp) //we need to read from here so we can combine the original and modified images

        copy("pointer", temp2) //gets the unmodified image slice into temp2

        or(temp2, cursor.yPos, temp2) //combines them (writes the pixel in the cursors position)

        copy(temp2, "pointer") //writes it back

    returnFromBranch()


    label("erasePixel") //ereases a pixel from the image at the cursors position

        and(cursor.xPos, 1111, temp) //gets the 0-15 x cordiante
        add(temp, currentImageOffset, temp) //adds the offset to get the x cord of the cursor if it was in the image stored in ram

        loadWritePointer(temp) //loads the x coord as a pointer (x coords are actually just memory adresses)
        loadReadAPointer(temp) //we need to read from here so we can erase only the pixel we want and not the intire slice

        copy("pointer", temp2) //gets the unmodified image slice into temp2

        xor(cursor.yPos, 1111111111111111, temp) //inverts the cursors y pos and saves it into temp so we can use it as a bitmask

        and(temp2, temp, temp2) //uses the bitmask we just made to mask out the pixel we want to erase

        copy(temp2, "pointer") //writes it back

    returnFromBranch()

    //editing the image is handled here
    label("edit")
        
        //checking for if write pixel has been selected
        and(input, inputs.toggles.four, temp)
        branchIfPositive(labels.writePixel, temp)

        and(input, inputs.toggles.three, temp)
        branchIfPositive(labels.erasePixel, temp)

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
        console.log(assembledInstrucions.length) //gets the rom location of the main "function" for the jump instruction after init to go to
        branch(labels.changeFile) //handles file swapping
        branch(labels.moveCursor) //handles cursor movement
        branch(labels.edit) //handels pixel modifications
        branch(labels.render) //renderes everything to the screen

        jump(labels.main) //loops forever


}
code() //runs through your asm code and assembles it
getSchematic() //turns it into a schematic
saveBin() //nothing atm