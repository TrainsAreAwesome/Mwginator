import { assembledInstructions, getInput, loadReadAPointer, loadReadBPointer, loadWritePointer } from "./assembler.js"
import { labels } from "./assembler.js"
import { label } from "./assembler.js"
import { loadImmidiate } from "./assembler.js"
import { noOperation } from "./assembler.js"
import { copy } from "./assembler.js"
import { add } from "./assembler.js"
import { sub } from "./assembler.js"
import { and } from "./assembler.js"
import { or } from "./assembler.js"
import { xor } from "./assembler.js"
import { lShift } from "./assembler.js"
import { rShift } from "./assembler.js"
import { jump } from "./assembler.js"
import { jumpIfZero } from "./assembler.js"
import { jumpNotZero } from "./assembler.js"
import { jumpIfPositive } from "./assembler.js"
import { jumpIfNegative } from "./assembler.js"
import { branch } from "./assembler.js"
import { branchIfZero } from "./assembler.js"
import { branchNotZero } from "./assembler.js"
import { branchIfPositive } from "./assembler.js"
import { branchIfNegative } from "./assembler.js"
import { returnFromBranch } from "./assembler.js"
import { resetFrameBuffer } from "./assembler.js"
import { refreshDisplay } from "./assembler.js"
import { refresh7Seg } from "./assembler.js"
import { halt } from "./assembler.js"


export let code = () => { //main function
    //declare variables here, like this let testVar = "<address in binary>"
    //load variables after defining the name and adress
    //you can also define constant values or numbers in the same way
    let one = "1"
    let two = "10"
    let SSeg = "11110000"
    loadImmidiate(one, "")
    jump("", "110")
    label("branched")
    sub(one, one, "", one, "10")
    copy(SSeg, one)
    refresh7Seg()
    returnFromBranch()
    label("loop")
    getInput(two)
    branchIfPositive("", two, labels.branched, "01")
    jump("", labels.loop)
}
code()