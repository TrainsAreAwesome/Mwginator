# Mwginator
The repository for the 16 bit redstone computer I made, The Mwginator

### The astrixes in the showcase video:
RAM: The ram is actually 478B but you cant read from 2B and another 30B are for the frame buffer (though you CAN read from that and use it like normal RAM if you wanted to)
ALU: It has 7 operations, but that includes a hardware left shifter, even though the adder can do that (why did I put it in then? idk)

# How to use:
## 1: Installing the repo and its dependencies

First make sure you have Git installed so you can download this repo.
To do that, go to git-scm.com and download the version for your OS and install it.

Then you also need to install NodeJS and Python so go do that too.

Then clone this repo to your machine and launch a command line in the same directory as the cloned repo and run the command `pip install mcschematic`

Then also run `npm install` after that other command.

## 2: Get the computer in the world

Firstly, you need a mod that works with .schematic files, I use WorldEdit. You also need the redstone tools mod.
This computer and its schematics were made for Minecraft 1.18.2 (the version the MCHPRS uses)

### How to get the computer in a non MCHPRS world

Now copy the file Mwginator.schem and blankRom.schem into the schematics folder in the installation you are using (by default its .minecraft)
Once you have that done paste the schematic in the world.

### Pasting programmes in the computer in a non MCHPRS world

To run programmes, just transfer the .schematic file into the schematics folder of your installation,
then go to the location im PasteLocation2.png (PasteLocation1.png will help you find where that is)
As the sign says, stand on the blue wool and look east, then type `//schem load blankRom`
and then `//paste`
This will clear the ROM of any previous programme loaded.
If the ROM slightly shifts, then run `//undo` and make sure your standing on the blue block and paste again.

Then run `//schem load schemName` where schemName is the name of the schematic you want to paste in.
Then run `//paste -a` to paste the schematic, and the -a makes sure the torch ROM your pasting in doesnt clear existing blocks with air.
If the torches arnt attached to blocks, then run `//undo` and make sure that your standing on the blue block, and paste again.

Now make a selection that surrounds the entire ROM and run `//update` this runs a block update on every block contained within the ROM.
Thats it! Refer to the How To Use guide on how to run your programmes.

### How to get the computer in the MCHPRS

Firstly you need to download the MCHPRS, use the tutorial on their website but dont compile yet.
Secondly, as the Mwginator is so huge it takes up more space than is avaliable in the deafalt plot.
We need to expand the plost size.
To do this, go into crates/core/src/plot and open mod.rs in a code editor.
On line 44 you should see a const called `PLOT_SCALE` being defined with a value of `4`. Change this to `5` and remember to leave the semicolon in.
Then save the file and compile as instructed on their website.

Once you start the server, join it and look east, and walk left until you are a few blocks away from the plot border, and then walk backwards until you are a few blocks from the plot border.
Now you should be at a corner of the map, looking east, with the corner behind and to the left (PasteLocation3.png could be a good refrence)
Alternitivly, if you are in plot 0 0 you can just teleport to 10 8 10 and look east
Then copy the schematics you want into the schematics folder in the MCHPRS (at least Mwginator.schem and blankRom.schem)
Run `//load Mwginator.schem` and `//paste` to load the Mwginator into the world, and then relog as you might have some visual glitches.
Then go to the blue block featured in PasteLocation2.png (PasteLocation1.png will help you find this)
Once you stand on the blue block and look east, run `//load blankRom.schem` and the `//paste` to clear the ROM
If the ROM slightly shifts, then run `//undo` and make sure your standing on the blue block and paste again.

### Pasting programmes in the computer in MCHPRS

To paste programmes, make sure the ROM is clear and that the programme schematic is in the MCHPRS scheamtics folder.
Then run `//load schmeaticName` where schematicName is the name of the schematic file you want to paste.
The run `//paste -a` to paste the schematic into the ROM withought deleting it.
If the torches are floating and not attached to blocks, run `//undo` and make sure your standing on the blue block and paste again.

Then run `//update -p` to run a block update on the entire plot.
Then run `/redpiler compile` to get the serevr to do some black magic to make redstone really fast.
Then run `/rtps 100000` to activate the black magic and run the computer super fast.

## Using the computer
First you want to reset the computer.
To do this you want to turn on the HALT lever and press the RESET button and wait 700-800 game ticks (this is practicly isntant when using MCHPRS)

Then turn off the HALT lever and click the START CLOCK button to start the computer.
Turn on the HALT lever if you want to stop the computer.

Make sure to reset the computer whever you switch programmes, as the first line of code is loaded when you reset, before the computer starts.

## Programming for the computer

If you want to programme for this computer, first look inside the .txt files in the examples to see what the code looks like.
You can then guess what you need to do, but heres a basic guide that I might add things to if you want me to:

Make your programmes inside the index.js file, perferably using a code editor like vscode.
Its alot better to have programming experiance before using this as assembly language isnt exactly easy for beginners.

The assabler will asseble things in the `code` function, so write your code inside of it.
Each operation is a function call, and the import statements for those functions are at the top of the file, so look at those to see what you can do.

When you use a number it must be in binary (16 bit twos complement)

All instructions are actually just function calls to the assembler, so even if they have no arguments, you still need to have brackets to call the function

### Variables and constants:
Heres how to declare a variable: `let variableName = "adressInBinary"`
where adressInBinary is the binary adress of the variable, as a string value. Note that variables are just refrences to memory adresses, so copying it wont change where the variable points to.

How to declare a constant: `let constantName = constantValue` where constant value is the value you are storing, in binary.
Constants arnt actually stored in a memory adress in the Mwginator, but as immediate values in ROM.

Whenever you do an operation, the operands have to be registers (memory addreses 1 - 1000) except for the copy instruction which can copy between registers or registers and RAM, and the resetDisplay instruction (more on that later)

The frame buffer is located between memory adresses 11110001 and 11111111 going right to left (You can read from these adresses back into registers).
The seven segment display buffer is located at memory adress 11110000 (You cannot read from this adress, only write).

### Jumping, Branching and Labels:
If you want to use loops and "functions" you need jumps or branches.
the jump instruction takes one paramater, an adress (or register that contains an adress) and executes that instruction, and jumps to that point and starts execution at that point in the code.

You can also have conditional jumps, which only jump if a condition is true. The contions you can check for are: ifPositive, ifNegative, ifZero, notZero, and the contiional jumps have a second paramter, the value to check the condition of.

But what if you want to go back to just after the jump like returning from a function call?
Well thats what the branch instruction is for! Its just like the jump instruction, but if the condition is true (or its uncontitional) it puts the adress of the line it would execute if it hadnt branched on the "call stack"
This allows you to use a primative version of functions, branch to somewhere, execute some code and return using the returnFromBranch instruction (there is no conditional branch return, but you can do a conditional jump to a branch return to implement it in software)
But weve had to use ROM adresses to tell the computer where to jump to, and those change, and I havent even told you how to get those!
Note that the call stack can only hold 15 adresses before overflowing back to the start and causing issues

Thats where labels come in. Define a label like this `label("labelName")` and now you can refer to that label later on in your code like this `jump(labels.labelName)` Note that labels are contained inside the label object
But you can only jump/branch to a label that is above the jump/branch instruction! Thats why my main functions and loops in the example programmes are at the bottom of the file.
Heres an example:

`let registerOne = "1"
label("doSomething")
add(1, 1, registerOne)
jump(labels.doSomething)`

Note that you can only refrence the doSomething label on lines after its defenition, but if you mis-spell a label or try to acsess it before its defined the assembler doenst know and will just jump/branch to line 0! This is a very common bug in programmes.

But then if all refrences to a label must be after its definition, how do you get the the main function/loop if its at the bottom of the file?
For this you need to manually get the ROM adress of the start of the main function and put it in a jump instruction after your init section or at line 0.
You can see me do this in the example files.
To get the ROM adress of a line in the console, type this just above your main loop: `console.log(assembledInstrucions.length)` and it will print the adress of the start of the main loop to the stdout when you assemble your code.
So then convert that adress to binary and pass it as the adress argument of the jump instruction that starts the main loop, and assemble again.

### Displays:
The Mwginator has two seperate displays: the 7 Segment number display, and the pixel display.

The seven segment display is quite simple, simply copy a value from a register to it (the adress is provided as an variable value called `sevenSeg` that you can use as the write adress) and then use the `refresh7Seg()` instruction to refresh the display to show the number you put in.
Note that you cant read from the seven segment display buffer.

The pixel display is slightly more complicated, but heres how it works:
The pixel display ocupies 15 different memory adresses (`11110001` on the right through to `11111111` on the left). Each of these adresses holds a vertical line of pixels, with the adresses counting up as you go left across the screen
To get stuff to the pixel display, copy a value one of the displays adresses (these are provided as an array called `display` just refrence this as the write adress like this `display[0]` would be the right most line and `display[14]` would be the left most line)
Then, run refreshDisplay() instruction to refresh the frame buffer.
To reset the pixel display, use the `resetFrameBuffer()` instruction. But why does it take an argument?
Thats because you can get the entire screen to one value, as the instruction actually writes the value on the readA bus to every memory adress the display uses!

### Inputs:
The computer has a 12 input controller thats used for inputs.
Use the `getInput(register)` instruction to get an input from the controller. If you want the computer to pause so the user can enter an input, use the `halt()` instruction, let the user put in the input and then they will start the clock when they are ready.
The input is saved to the register listed in the instruction. You can then use the `and()` instruction to tell weather a certian input was on or off, using the provied bit masks inside the `inputs` object, and then jump or branch accordingly.

### Pointers
So far all the memory adresses we've been refrencing have been hardcoded into the instructions. This is fine for most things, but what about looping through a list?
If you want to loop through a list (perhaps rendering something) you want to be able to load and store from memory adresses that *arnt* hardcoded values.
For example in a higher level language you could use a for each loop to loop through elements of an array, and your able to modify the current element, using a value like `i` for example.
It would be redicoulous to have something that checks what the value is out of every possible value (lots of if statements), and then branches to do an operation on a hardcoded value. Thats inefficient, takes up lots of ROM and is slow, as you have to go through lots of if statemants.
A better way to do this uses pointers.
Pointers tell the computer to load or write to an adress thats stored in a seperate adress, this is how I made the MSPaint Cursor and the ball in Pong get rendererd to the correct XPos on the screen, the XPos is the adress it should be copied to,
and then we tell the computer to "Copy the ball to the adress stored in the XPos value" We dont know the XPos value at assemble time, so we need to use a pointer for this to work.
Heres how.
First, load a pointer using one of these instructions:
`loadReadAPointer(adress)`
`loadReadBPointer(adress)`
`loadWritePointer(adress)`

These instructions load the "pointer registers" with the value from the specified adress. Then later in your code, in place of an argument you can use "pointer" (with the quotes) to tell the computer to use whatever is loaded to the applicable pointer register in place of a hardcoded adress.
But what are readA and readB? These are the two memory read adress lines. `readA` gets gets a value and puts it onto the `valueA` bus and `readB` gets a value and puts it onto the `valueB` bus respectivly. Note that when you read from RAM the data goes to the `writeback` bus so you cant use it in other operations.
For example, the `sub()` instruction takes three arguments, `valueA`, `valueB`, `writeAdress`. `valueA` is is the original number, and `valueB` is subtracted from it and the result is written to the `writeAdress`
So if you use the `readA` pointer its value will go into the `valueA` bus and if you use the `readB` pointer is value will go into the `valueB` bus.
The write adress pointer stores a pointer for the writeback adress, so you can write to an adress that isnt hardcoded into ROM (such as looping though each section of the frame buffer)
The assembler works out if a value is supposed to be hardcoded or if it refers to a register/ram adress so you dont need to do that yourself (such as adding `1` + `exampleVar` the assembler knows that 1 is an immediate and `exampleVar` refers to a memory adress)

### Other:
Some example instructions:
`add(valueA, valueB, writeAdress)` `valueA` and `valueB` are added to eachother and the result is saved to the adress specified in `writeAdress`
`sub(valueA, valueB, writeAdress)` `valueB` is subtracted from `valueA` and the result is saved to the adress specified in `writeAdress`
Use the `halt()` instruction to get the computer to stop executing instructions.

### Assembling
To assemble your code into a .schematic file, make sure all your code is inside the `code` function inside of index.js
Then run `node index.js` to asseble it, if it works, enter in a name for the schematic file (without any spaces!)
Your file will be created inside the ./schems folder, and refer to pasting in programmes and how to use sections for how to get your programme running.

Wow thats alot of text, hope this was helpfull!
