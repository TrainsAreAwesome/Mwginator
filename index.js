import { ldi } from "./assembler.js"
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


export let code = () => {
    //declare variables here, like this let testVar = "<address in binary>"
    //load variables after defining the name and adress
    let testVar = "1"
    //programme
    ldi(testVar, "1")
    add("1", "1", "1")
}
code()