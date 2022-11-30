# Tetris

An attempt at a faithful(?) recreation of the timeless classic puzzle game, Tetris. Its looks were borrowed from a few separate incarnations of the game, including the classic Game Boy version and more modern coloured variants.


## Installation

The game can be played over at https://llkyz.github.io. Alternatively, clone/download all files into a folder, and run index.html to start.

## Controls

- **Left/Right**: Nudge block horizontally
-  **Up**: Rotate block clockwise
- **Down**: Soft drop
- **Shift** + **Down**: Hard drop
- **ESC**: Pause game

## Technologies Used

- HTML5 <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/html5/html5-white-original-wordmark.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/html5/html5-original-wordmark.svg"></picture>
- CSS3 <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/css3/css3-white-original-wordmark.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/css3/css3-original-wordmark.svg"></picture>
- JavaScript <picture><source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/javascript/javascript-original.svg"><img height="30" width="30" src="https://cdn.jsdelivr.net/gh/llkyz/llkyz/icons/javascript/javascript-original.svg"></picture>

## Game Mechanics
Unlike [**Cave Escape**](https://github.com/llkyz/Project1-IcePath) which uses a 2D array to store data, the game state here is stored as classes within each block rendered on the screen. The classes are modified/removed as the game progresses, which simultaneously changes the graphics and styling for the player to see.

### _Super Rotation System (SRS)_
This system is the current guideline by **The Tetris Company** which governs block spawn, rotation, and wall kicks. Attempts were made to follow these guidelines as closely as possible to deliver an "authentic" experience.

### Game Board
The board is made up of a 20 (H) x 10 (W) grid, with 2 additional hidden rows (dead zone) above that act as the spawn zone and game over condition.

### Block Colours
The official colouring conventions for blocks are followed:
|Block|Colour|
|--|--|
|Long|Cyan|
|Square|Yellow|
|T-shape|Purple|
|S-shape|Green|
|Z-shape|Red|
|J-shape|Blue|
|L-shape|Orange|


### Block Queue
When the game starts, 1 of each type of block is added to the queue, for a total of 7 blocks. Beyond that, every new block spawned is replaced by a random block. The next block is always shown to the player at the top-left corner.

### Block Spawning
Blocks are spawned in the dead zone and drop into view. If an existing block occupies the dead zone and a block cannot be spawned in, the game is over and the player loses.

### Levels
The game starts at **level 0** and increases every 10 lines cleared, up to a maximum of **level 30**. Block speed gets faster as you level up.

### Scoring
Score increases based on the number of rows cleared. The more rows you clear at once, the more points you get.
|Rows cleared|Score|
|--|--|
|1|40|
|2|100|
|3|300|
|4|1200|


### Speed
The speed in the original games is based on frame rate. Since this isn't typical in browsers, I modified this to be based on actual time, while keeping a rough approximation of the original speeds. Also made higher levels slightly slower/easier.


(assuming 60 frames per second)
|Level|Approx. frames per row|
|--|--|
|0|53|
|1|49|
|2|45|
|3|41|
|4|37|
|5|33|
|6|28|
|7|22|
|8|17|
|9|10|
|10|9|
|11|8|
|12|7|
|13-14|6|
|15-17|5|
|18-29|4|
|30+|3|

### Block Rotation
When a block is rotated, the game will check if the new position is valid. If it causes the block to overlap with another block or fall outside the game board, the game will attempt to do wall kicks and floor kicks to nudge the block into place.

- **Wall kick**: Nudge block 1 grid to the **right**, then 1 grid to the **left**. If both fail as valid positions, the wall kick fails.
- **Floor kick**: Nudge block 1 grid **upwards** and check if the position is valid. Only 1 floor kick is allowed once per block to prevent abuse.

### Soft Drop
Soft drop will make a block fall at a fixed rate of 1/2G regardless of level. In this case, it'll be an approximated 3 frames per row, or a speed of **level 30+**.

### Hard Drop
This will cause the block to fall once every **1ms**, equivalent to an almost instantaneous drop. 

## Technical Approach
### Drawing the Game Board
![documentation1](https://user-images.githubusercontent.com/115427253/201157329-4a4ba9bd-75e0-4ea1-8ca1-2465724a998b.JPG)

The game board is drawn in 2 dimensions, with every 10 horizontal cells nested into a row div, and 22 row divs making up the whole board. Each cell is given a ID of **'x#y#'**, making them easy to reference for future use and modification. The board state is stored in this manner instead of an array variable.

### Defining the Blocks
![documentation2](https://user-images.githubusercontent.com/115427253/201159199-701d15a5-ac09-4dd2-8ed8-a98ca0aac8e2.JPG)

Official Tetris guidelines dictate that every block has a specific colour, and are in fact not random. The colours are stored as objects, which can then be used to apply a background colour to a specific cell. This coupled with a transparent tile image layered above creates the signature look of a Tetris block.

The **Super Rotation System** (**SRS**) determines that blocks rotate in a specific manner. Here, I wrapped the block in a bounding box to provide an absolute position reference so that the block can rotate in a predictable fashion.

### Creating the Block Queue
![documentation3](https://user-images.githubusercontent.com/115427253/201162144-b4a63727-a57a-49a2-81e3-28613c83c4f0.JPG)

The first 7 blocks (1 of each shape) are randomized and pushed into the queue array. After the game starts, blocks get consumed from the queue and are replaced by blocks of a randomly drawn shape.

### Block Spawning
![documentation4](https://user-images.githubusercontent.com/115427253/201163307-6cb4f058-8da8-4a30-8a47-68c54801be20.JPG)

A block gets pulled from the block queue and assigned to the object currentBlock with properties including shape, position, colour, etc. It is 'placed' onto the game board by changing the colours and image of the cells it occupies. A setInterval timer is then started to simulate the block falling.

### Soft Drops and DAS
![documentation6](https://user-images.githubusercontent.com/115427253/201168395-6d2d9280-c8b1-428d-a4f6-f92e306faba3.JPG)

Tetris uses a system called the **Delayed Auto Shift** (**DAS**) when moving blocks sideways. This is similar to most modern keyboards and how they repeat a keypress if a key is held down, after a short delay.

However, the soft drop mechanism doesn't follow that system and blocks have to fall downwards at a linear pace without any delay. Hence, holding the down key will modify the falling timer instead. Blocks still fall at a linear pace, but at a faster speed.

### Movement Checks
![documentation5](https://user-images.githubusercontent.com/115427253/201165335-859d2d60-06d0-4e82-8ab0-7789790cc832.JPG)

A placeholder is used to hold a block's would-be position if it successfully moved. The placeholder is then run through a series of checks to ensure the position is valid before moving the actual block into place. These checks include an **areaCheck**, **wallCheck**, **floorCheck**, and **ceilingCheck**.

![documentation6](https://user-images.githubusercontent.com/115427253/201168374-934ca107-8e3d-4f30-a25b-a1779240a4e2.JPG)

- **areaCheck**: checks for overlaps with other blocks
- **wallCheck**: checks if the block exceeds the side walls
- **floorCheck**: checks if the block goes below the floor
- **ceilingCheck**: checks if the block touches the ceiling (game over condition)

The SRS also dictates certain movement aids when rotating a block, namely the **wall kick** and **floor kick**. If the block is rotated and fails a **wallCheck**, the game will then attempt to do a **wall kick** by nudging the block sideways and checking again. Alternatively if it fails an **areaCheck** or **floorCheck**, the game will attempt to do a **floor kick** by nudging the block upwards. If both kicks fail, then the block cannot rotate.

### Animation
![animation](https://user-images.githubusercontent.com/115427253/201173289-eb7fcd1b-3470-4ad7-a579-8bcd383d8926.gif)

Replicating the row clear and game over animations were pretty straight-forward, since every game board cell has a **'x#y#'** ID that can be referenced. A set of cascading timers were used to modify the properties of each row, that fired off consecutively to simulate animation.


## Challenges
The lack of a **sleep** function made animations and queued functions slightly tricky. The **setInterval** function was used in place of it. Due to the nature of constantly falling blocks, soft/hard drops, and needing to pause and resume the game to clear rows, this would sometimes create bugs that cause blocks to fall twice as fast, clear rows twice, or even continue falling after a game has ended.

I had to take extra precautions to make sure all falling functions were cleared before starting a new one.

## Sources

Music / Sound effects:
- https://www.zophar.net/music/gameboy-gbs/tetris
- https://www.sounds-resource.com/game_boy_gbc/tetris/sound/45758/
