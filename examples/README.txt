This is the examples folder which contains example programme schematics and the asm used to generate them.
The schematics have the .schem extension. I use WorldEdit to paste them in, you might be able to use other mods
but i dont know, but WorldEdit works on the MCHPRS though the commands are a bit different that normal.
The .txt files are the asm code I made, I then used the assembler to generate a schematic, but I included
the "source code" so you can modify them yourself.

If you want to make your own programmes, make them inside the code function inside index.js. I might make something telling you how
to do this, but idk if I will lol.

If you want to make a "variable" (refrence to a memory adress using a string) do this: `let variableName = "<binaryMemoryAdress>"
with binaryMemoryAdress being a memory adress in binary, also make sure that its a string, not a number.

If you want a constant value that you can load to a register at any time, do this `let constantValueName = <value>`
where value is the number in binary, not as a string.

Heres how to format an instruction

instructionName(arg1, arg2, arg3)

different instuctions have different arguments, some have none at all.

Memory management
You need to manage completly manually, and there are no malloc() or free() functions avalable.
You can copy values using the copy(from, to) instruction
where from is where you want to copy from and to is where the value is pasted to.

You can copy between registers, or registers and RAM, but *not* between RAM and RAM

Basic programme tutorial:
As there isnt a text display hello world is too complicated for a first programme, so insted lets do 1 + 1 and display the result to the number display.

Firstly, we need to get our values to add (1 and 1) into the computer, but we can actually do this in the same instruction as adding!
You can only load one value though, but we only need one as 1 == 1, so we can just load the same value as both operands, like this:

let registerOne = "1"

add(1, 1, registerOne)

copy(registerOne, sevenSeg)

refresh7Seg()

halt()

The first two arguments are the numbers to add, and the last one is where to save the result.
We cant save a result directly to RAM (where the number display reads from) so we need to save it to a register first.
We define a variable to hold the number in first, then save the result to that variable.

We then copy the value from the register to the seven segment display buffer (which is where the seven segment display reads from)

Then we refresh the display to show the result

and then halt the computer to stop programme execution.

But how do we get this in game? Thats what the assembler and schematic generator are for!

You need nodejs and python installed for the assembler and schematic generator to work.

Run the command `node index.js` to assemble your code, you will then be asked for a schematic file name, dont enter a name with spaces.
Then, your schematic will be located in the ./schems folder, along with some other ones I've made while developing this PC and the assembler.
Keep in mind that not all of them work, and that bugs are extremly annoying sometimes as there are no error messages,
actually you dont even know if an error is happening unless you can see that something is wrong.