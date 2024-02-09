import { labels } from "./newAsm.js"
import { label } from "./newAsm.js"
import { loadImmidiate } from "./newAsm.js"
import { copy } from "./newAsm.js"
import { noOperation } from "./newAsm.js"
import { add } from "./newAsm.js"
import { sub } from "./newAsm.js"
import {and} from "./newAsm.js"
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

export let code = () => { //main function and entry point for the assembler
//variable example: let variableName = "<adress in binary>"
//adress must be in a string, the var name only applies to the adress, so copying values wont move the variable label
//if you define a const value that you need alot, then make sure you define the value as *not* a string
let reg1 = "1"
let number1 = 1
let sSeg = "11110000"

branch(111)
halt()
copy(10, sSeg)
refresh7Seg()
returnFromBranch()
noOperation()
noOperation()
copy(1, sSeg)
refresh7Seg()
branch(10)
returnFromBranch()
}
code()