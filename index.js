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
    loadImmidiate(ball.yVel, 1) //THIS IS A TEST
    loadImmidiate(ball.xVel, 1) //MOVES BALL LEFT ON STARTUP SO THE BALL ACTUALLY MOVES CHANGE IMMIEDIATE TO 1 AFTER TESTING
    loadImmidiate(paddle.left, 1110000000)
    loadImmidiate(paddle.right, 1110000000)

    jump(1001110)

    //workaround to implement conditional subroutine returns
    label("returnFromBranch")
    returnFromBranch()

    //this is triggerd when someone loses
    label("gameOver")
    loadImmidiate(temp, 11111111) //loads 255 to seven seg, couldnt think of anything better to do if you loose, its 1 am
    copy(temp, sevenSeg)
    refresh7Seg()
    halt()

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

    //call here to move the ball, say on a ball update
    label("moveBallUp") //moves ball up
    lShift(ball.yPos, ball.yPos)
    returnFromBranch()

    label("moveBallDown") //moves ball down
    rShift(ball.yPos, ball.yPos)
    returnFromBranch()

    label("moveBallLeft") //moves ball left
    add(ball.xPos, 1, ball.xPos)
    returnFromBranch()

    label("moveBallRight") //moves ball right
    sub(ball.xPos, 1, ball.xPos)
    returnFromBranch()

    //changing ball velocity
    label("bounceBallUp")
    loadImmidiate(ball.yVel, 1)
    returnFromBranch()

    label("bounceBallDown")
    loadImmidiate(ball.yVel, 1000000000000000)
    returnFromBranch()

    label("bounceBallLeft")
    loadImmidiate(ball.xVel, 1)
    returnFromBranch()

    label("bounceBallRight")
    loadImmidiate(ball.xVel, 1000000000000000)
    returnFromBranch()

    //collision with floor and cieling
    label("checkNonPaddleCollision")
    sub(ball.yPos, 1, temp) //if ball is at the bottom of the screen (bouncing with floor)
    branchIfZero(labels.bounceBallUp, temp) //then make it move up instead
    branchIfNegative(labels.bounceBallDown, ball.yPos) //if ball is at top of screen (bouncing with cieling) then make it bounce down
    returnFromBranch()

    //collision with paddles
    label("checkLeftPaddleCollision")
    and(paddle.left, ball.yPos, temp) //checks if the ball and paddle collide
    jumpIfZero(labels.gameOver, temp) //if they dont, the games over
    loadImmidiate(ball.xVel, 1000000000000000) //otherwise the ball will move right
    returnFromBranch()

    label("checkRightPaddleCollision")
    and(paddle.right, ball.yPos, temp) //checks if the ball and paddle collide
    jumpIfZero(labels.gameOver, temp) //if they dont then the game is over
    loadImmidiate(ball.xVel, 1) //otherwise set the ball to move left
    returnFromBranch()

    //move ball based on current velocity. run this *AFTER* collision checks are done on the ball
    label("updateBall")
    branchIfPositive(labels.moveBallUp, ball.yVel) //if the velocity for the ball on the y direction is posotive, move it up
    branchIfNegative(labels.moveBallDown, ball.yVel) //if the velocity for the ball on the y direction is negative, move it down
    branchIfPositive(labels.moveBallLeft, ball.xVel) //if the velocity for the ball on the x direction is posotive, move it left (left is posotive and right is negative bc of the way the display addreses are set ip)
    branchIfNegative(labels.moveBallRight, ball.xVel) //if the velocity for the ball on the x direction is negative, move it left
    returnFromBranch()

    //render
    label("render")
    resetFrameBuffer() //resets the frame buffer so the ball doesnt leave a trail
    loadWritePointer(ball.xPos) //load the xpos (screen adress) to the write pointer to write the ball there
    copy(ball.yPos, "pointer") //load the ball to the pointer
    copy(paddle.right, display[0]) //copy right paddle to frame buffer
    copy(paddle.left, display[14]) //copy left paddle to frame buffer
    refreshDisplay() //refresh the frame buffer
    returnFromBranch() //return/close function

    //main loop
    console.log(assembledInstrucions.length)
    label("loop")
    branch(labels.updatePaddle) //updates paddle pos
    branch(labels.checkNonPaddleCollision) //checks ball collision with floor and cieling
    
    //checking if paddle collision needs to be checked
    sub(ball.xPos, 11111110, temp) //if the ball is at the second most left point on the screen
    branchIfZero(labels.checkLeftPaddleCollision, temp) //if so check left paddle collision
    sub(ball.xPos, 11110010, temp) //if the ball is at the second most right point of the screen
    branchIfZero(labels.checkRightPaddleCollision, temp) //if so check right paddle collision

    branch(labels.updateBall) //moves the ball according to its set velocity
    branch(labels.render) //renders everything to screen
    jump(labels.loop) //loops back to the start of the main loop

}
code()
getSchematic()
saveBin()