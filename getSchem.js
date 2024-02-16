import * as readLine from "readline/promises" 
import {readFileSync } from "fs" //imports
import * as fs from "fs/promises"
import { stringInstruction } from "./newAsm.js"
import { execSync } from "child_process"
import { createInterface } from "readline"
const getInput = createInterface({
    input: process.stdin,
    output: process.stdout
});
export let saveFile = (path, contents) => {
    fs.writeFile(path, contents).then(() => {
        console.log(`File saved to: ${path}`)
        getInput.question("Enter schematic file name (no spaces): ", savePath => {
            execSync(`python gen.py ${savePath}`)
            getInput.close()
        })
    }).catch((err) => {
        throw(err)
    })
}

export let getSchematic = (outputPath = "./output.txt") => {

let schematic = [] //where the finished schematic gets built into
let binary = stringInstruction
//gets the binary to make a schematic from
let startingY = [0, 1, 17, 34, 35] //starting y pos ofsets
let currentY = [0, 1, 17, 34, 35] //the current y pos, starts with ofsets applied
let currentZ = [0, 5, 5, 0, 5] //current z corrds with ofsets
let currentX = 0 //current x coord
let romLoc = 0 //index for where to read from in the rom
let dataSplitter = (input) => { //spits an instruction into its differernt parts
        let instruction = {}
        instruction.opcode = input.substr(0 + romLoc, 6)
        instruction.write = input.substr(6 + romLoc, 8)
        instruction.readA = input.substr(14 + romLoc, 8)
        instruction.readB = input.substr(22 + romLoc, 8)
        instruction.immediate = input.substr(30 + romLoc, 16)
        instruction.immediateBehavour = input.substr(46 + romLoc, 2)
        instruction.pointer = input.substr(48 + romLoc, 3)
        return instruction
}

//ORDER: readAwriteA, opcode, readB, behavour, immediate //i used this when making this

while(romLoc < binary.length){ //runs for each instruction in the binary
    let currentInstruction = dataSplitter(binary) //gets new instruction
    romLoc = romLoc + 51 //increments rom index
    let readWrite = currentInstruction.write + currentInstruction.readA //gets parts of the instruction and puts them together to match the arrangment in the rom
    let opcode = currentInstruction.opcode //^
    let readB = currentInstruction.readB//^
    let behavour = currentInstruction.immediateBehavour + currentInstruction.pointer//^
    let immediate = currentInstruction.immediate//^
    for(let i = 15; i >= 0; --i){ //read a and write
        if(readWrite[i] === "1"){ //if we need to write a 1 into the rom
            schematic.push(`schem.setBlock((${currentX}, ${currentY[0]}, ${currentZ[0]}), "minecraft:redstone_wall_torch[facing=north,lit=false]")`) //paste it in with the right ofsets and rotation
        }
        currentY[0] = currentY[0] + 2 //add 2 to the y offset (each torch is two block apart)
    }
    for(let i = 5; i >= 0; --i){ //opcode
        if(opcode[i] === "1"){ //if we need to write a 1 into the rom
            schematic.push(`schem.setBlock((${currentX}, ${currentY[1]}, ${currentZ[1]}), "minecraft:redstone_wall_torch[facing=south,lit=false]")`) //paste it in with the right ofsets and rotation
        }
        currentY[1] = currentY[1] + 2 //add 2 to the y offset (each torch is two block apart)
    }
    for(let i = 7; i >= 0; --i){ //read b
        if(readB[i] === "1"){ //if we need to write a 1 into the rom
            schematic.push(`schem.setBlock((${currentX}, ${currentY[2]}, ${currentZ[2]}), "minecraft:redstone_wall_torch[facing=south,lit=false]")`) //paste it in with the right ofsets and rotation
        }
        currentY[2] = currentY[2] + 2 //add 2 to the y offset (each torch is two block apart)
    }
    for(let i = 4; i >= 0; --i){ //behavour and pointer
        if(behavour[i] === "1"){ //if we need to write a 1 into the rom
            schematic.push(`schem.setBlock((${currentX}, ${currentY[3]}, ${currentZ[3]}), "minecraft:redstone_wall_torch[facing=north,lit=false]")`) //paste it in with the right ofsets and rotation
        }
        currentY[3] = currentY[3] + 2 //add 2 to the y offset (each torch is two block apart)
    }
    for(let i = 15; i >= 0; --i){ //immedieate
        if(immediate[i] === "1"){ //if we need to write a 1 into the rom
            schematic.push(`schem.setBlock((${currentX}, ${currentY[4]}, ${currentZ[4]}), "minecraft:redstone_wall_torch[facing=south,lit=false]")`) //paste it in with the right ofsets and rotation
        }
        currentY[4] = currentY[4] + 2 //add 2 to the y offset (each torch is two block apart)
    }

    for(let i = 0; i < 5; ++i){ //resets the current y pos the the starting one
        currentY[i] = startingY[i]
    }

    currentX = currentX + 2 //adds 2 to the x offset (each torch is two blocks apart)
    if(currentX >= 127){ //if we reached the end of the rom
        if(currentZ[0] >= 128){ //if were on the last rom "stick"
            throw("Too many instructions in programme! Cant fit in ROM!") //error out
        } //otherwise
        currentX = 0 //reset the x offset
        for(let i = 0; i < 5; ++i){ //and add 9 to the z offset to go to the next rom "stick"
            currentZ[i] = currentZ[i] + 9
        }
    }

}
let finshedString = "" //string for the array to paste into
schematic.forEach(element => { //for each redstone torch place command
    if(finshedString !== ""){ //if the string not empty (only false for first run)
        finshedString = finshedString + "\n" + element //paste in a newline and the element
    } else { //otherwise
        finshedString = element //ignore the newline and just paste in the element (only for first element)
    }
});
saveFile(outputPath, finshedString)
}