# GA Project 1: Tetris

An attempt at a faithful(?) recreation of the timeless classic puzzle game, Tetris. Its looks were borrowed from a few separate incarnations of the game, including the classic Game Boy version and more modern coloured variants.


## Installation

Clone/download all files into a folder, and simply run **index.html** to start!

## Controls

- **Left/Right**: Nudge block horizontally
-  **Up**: Rotate block clockwise
- **Down**: Soft drop
- **Shift** + **Down**: Hard drop
- **ESC**: Pause game

## Technical Approach
Unlike **Cave Escape** which uses a 2D array to store data, the game state here is stored as classes within each block rendered on the screen. The classes are modified/removed as the game progresses, which simultaneously changes the graphics and styling for the player to see.

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

## Challenges
The lack of a **sleep** function made animations and queued functions slightly tricky. The **setInterval** function was used in place of it. Due to the nature of constantly falling blocks, soft/hard drops, and needing to pause and resume the game to clear rows, this would sometimes create bugs that cause blocks to fall twice as fast, clear rows twice, or even continue falling after a game has ended.

I had to take extra precautions to make sure all falling functions were cleared before starting a new one.

## Sources

Music / Sound effects:
- https://www.zophar.net/music/gameboy-gbs/tetris
- https://www.sounds-resource.com/game_boy_gbc/tetris/sound/45758/