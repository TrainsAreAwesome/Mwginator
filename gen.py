import mcschematic
import sys
schem = mcschematic.MCSchematic()
file = open("output.txt", "r").read()
exec(file)
name = "./schems/" + sys.argv[1]
schem.save("./", name, mcschematic.Version.JE_1_18_2)