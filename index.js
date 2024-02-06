import { loadImmidiate } from "./newAsm.js"

export let code = () => { //main function
//     //declare variables here, like this let testVar = "<address in binary>"
//     //load variables after defining the name and adress
//     //you can also define constant values or numbers in the same way
let one = 1
let two = 10
//     let SSeg = "11110000"
//     let display = [
//         "11110001",
//         "11110010",
//         "11110011",
//         "11110100",
//         "11110101",
//         "11110110",
//         "11110111",
//         "11111000",
//         "11111001",
//         "11111010",
//         "11111011",
//         "11111100",
//         "11111101",
//         "11111110",
//         "11111111",
//     ]
loadImmidiate("pointer", 1000000000000001)
loadImmidiate(two, 1111111111111111)
//     for (let i = 0; i < 15; ++i) {
//         if (i === 0 || i === 15) {
//             copy(display[i], one)
//         }
//         copy(display[i], one)
//     }


}