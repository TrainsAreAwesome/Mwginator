import { getSchematic } from "./getschem.js"
import { assembledInstrucions, labels } from "./newAsm.js"
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

export let code = () => { //main function and entry point for the assembler, put your code inside it
    //"Variables": let name = "<adress>"
    //Immediates to use later: let name = <number>
    
    let ball = {
        yPos: "01",
        xPos: "10",
        yVel: "11",
        xVel: "100"
    }
    let paddle = {
        left: "101",
        right: "110"
    }
    let temp = "111"
    let temp2 = "1000"

    //INIT
    loadImmidiate(ball.xPos, 11111000)
    loadImmidiate(ball.yPos, 100000000)
    loadImmidiate(ball.xVel, 1)
    loadImmidiate(paddle.left, 1110000000)
    loadImmidiate(paddle.right, 1110000000)

    jump(100101)

    //workaround for conditional subroutine returns
    label("returnFromBranch")
    returnFromBranch()


    //paddle moving
    label("moveRightPaddleDown")
    sub(paddle.right, 111, temp2)
    jumpIfZero(labels.returnFromBranch, temp2)
    rShift(paddle.right, paddle.right)
    returnFromBranch()

    label("moveLeftPaddleDown")
    sub(paddle.left, 111, temp2)
    jumpIfZero(labels.returnFromBranch, temp2)
    rShift(paddle.left, paddle.left)
    returnFromBranch()

    label("moveRightPaddleUp")
    sub(paddle.right, 1110000000000000, temp2)
    jumpIfZero(labels.returnFromBranch, temp2)
    lShift(paddle.right, paddle.right)
    returnFromBranch()
    
    label("moveLeftPaddleUp")
    sub(paddle.left, 1110000000000000, temp2)
    jumpIfZero(labels.returnFromBranch, temp2)
    lShift(paddle.left, paddle.left)
    returnFromBranch()

    //paddle input
    label("updatePaddle")
    getInput(temp)
    and(temp, 1, temp2)
    branchIfPositive(labels.moveRightPaddleDown, temp2)
    and(temp, 10, temp2)
    branchIfPositive(labels.moveLeftPaddleDown, temp2)
    and(temp, 100, temp2)
    branchIfPositive(labels.moveRightPaddleUp, temp2)
    and(temp, 1000, temp2)
    branchIfPositive(labels.moveLeftPaddleUp, temp2)
    returnFromBranch()

    //render
    label("render")
    copy(paddle.right, display[0])
    copy(paddle.left, display[14])
    refreshDisplay()
    returnFromBranch()

    //main loop
    console.log(assembledInstrucions.length)
    label("loop")
    branch(labels.updatePaddle)
    branch(labels.render)
    jump(labels.loop)

}
code()
getSchematic()
saveBin()