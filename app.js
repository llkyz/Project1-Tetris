// Music / Sound Effects from:
// https://www.zophar.net/music/gameboy-gbs/tetris
// https://www.sounds-resource.com/game_boy_gbc/tetris/sound/45758/
const soundBgm = new Audio("assets/sounds/korobeiniki.mp3");
const soundMenu = new Audio("assets/sounds/Tetris (GB) (17)-menu_sound.wav");
const soundMove = new Audio("assets/sounds/Tetris (GB) (18)-move_piece.wav");
const soundRotate = new Audio(
  "assets/sounds/Tetris (GB) (19)-rotate_piece.wav"
);
const soundClear = new Audio("assets/sounds/Tetris (GB) (21)-line_clear.wav");
const sound4Clear = new Audio(
  "assets/sounds/Tetris (GB) (22)-tetris_4_lines.wav"
);
const soundLevelUp = new Audio(
  "assets/sounds/Tetris (GB) (23)-level_up_jingle (V1.1).wav"
);
const soundGameOver1 = new Audio(
  "assets/sounds/Tetris (GB) (25)-game_over.wav"
);
const soundGameOver2 = new Audio("assets/sounds/08 Game Over.mp3");
const soundLanded = new Audio(
  "assets/sounds/Tetris (GB) (27)-piece_landed.wav"
);
soundBgm.loop = true;

const blocks = [];

blocks[0] = [
  // Long block
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
];

blocks[1] = [
  // J block
  [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

blocks[2] = [
  // L block
  [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
];

blocks[3] = [
  // Square block
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
];

blocks[4] = [
  // S block
  [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 1],
  ],
  [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

blocks[5] = [
  // T block
  [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
];

blocks[6] = [
  // reverse S block
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0],
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
];

blockColour = [
  { R: 0, G: 230, B: 254 },
  { R: 24, G: 1, B: 255 },
  { R: 255, G: 115, B: 8 },
  { R: 255, G: 222, B: 0 },
  { R: 102, G: 253, B: 0 },
  { R: 184, G: 2, B: 253 },
  { R: 254, G: 16, B: 60 },
];

/*
Block 0: Long block
Block 1: J block
Block 2: L block
Block 3: Square block
Block 4: S block
Block 5: T block
Block 6: Reverse S block

Format
------
block[2][3] = L block, 4th rotation position
*/

speedTable = [
  53, 49, 45, 41, 37, 33, 28, 22, 17, 11, 10, 9, 8, 7, 6, 6, 5, 5, 5, 4, 4, 4,
  4, 4, 4, 4, 4, 4, 4, 4, 3,
];

let queue = [];
let fallingFunc = "";
let movementEnabled = 1;

let currentBlock = {
  type: 0,
  rotation: 0,
  array: [],
  position: [0, 0], // indicates top left corner of bounding box [x,y]
  floorkickCount: 0,
  colour: {},
};

let score = 0;
let level = 0;
let lines = 0;
let speed = (speedTable[level] / 60) * 1000;
// frames per grid movement / frames per second * 1000 ms

// ======================================
// Draw the Gameboard and side bars
// ======================================

$middle = $("<div>").addClass("middle-container");
$sidebar = $("<div>").addClass("sidebar-left");
$nextBlock = $("<div>").addClass("next-block");
$sidebar.append($nextBlock);

// Create sidebar's next block preview
for (let y = 0; y < 3; y++) {
  const $preview = $("<div>")
    .addClass("preview-row")
    .attr("id", `previewRow${y}`);
  for (let x = 0; x < 4; x++) {
    const $square = $("<pixel>")
      .addClass("preview-square")
      .attr("id", `preview-x${x}y${y}`);
    $preview.append($square);
  }
  $nextBlock.append($preview);
}

$score = $("<div>")
  .addClass("stats")
  .attr("id", "score")
  .css("margin-top", "28%")
  .text("0");
$level = $("<div>")
  .addClass("stats")
  .attr("id", "level")
  .css("margin-top", "24%")
  .text("0");
$lines = $("<div>")
  .addClass("stats")
  .attr("id", "lines")
  .css("margin-top", "27%")
  .text("0");
$sidebar.append($score);
$sidebar.append($level);
$sidebar.append($lines);

$middle.append($sidebar);

$middle.append($("<div>").addClass("game-border"));
$middle.append($("<div>").addClass("board-container"));
$("body").append($middle);

$(".board-container").append($("<div>").addClass("dead-zone"));

// Create game board
for (let y = 0; y < 22; y++) {
  const $gameboard = $("<row>").addClass("game-board").attr("id", `row${y}`);
  for (let x = 0; x < 10; x++) {
    const $square = $("<pixel>").addClass("square").attr("id", `x${x}y${y}`);
    $gameboard.append($square);
  }
  $(".board-container").append($gameboard);
}

$gameover = $("<div>").addClass("game-over");
$reset = $("<div>").addClass("reset");
$title = $("<div>").addClass("title");
$logo = $("<div>").addClass("logo");
$play = $("<div>").addClass("play");

// ======================================
// Administrative
// ======================================

const createInitialQueue = () => {
  // The first 7 blocks are always 1 of each type, in a random order
  queue = [];
  const holding = [0, 1, 2, 3, 4, 5, 6];
  while (holding.length > 0) {
    let myRandom = Math.floor(Math.random() * holding.length);
    queue.unshift(holding[myRandom]);
    holding.splice(myRandom, 1);
  }
};

const previewNextBlock = () => {
  // Preview the upcoming block in the top left area
  let nextBlock = blocks[queue[6]][0];
  $(".preview-square").css("background-color", "").removeClass("preview-show");

  for (let x = 0; x < nextBlock[0].length; x++) {
    for (let y = 0; y < nextBlock.length; y++) {
      if (nextBlock[y][x] == 1) {
        if (nextBlock.length === 2) {
          $(`#preview-x${x + 1}y${y}`).addClass("preview-show");
          $(`#preview-x${x + 1}y${y}`).css(
            "background-color",
            `rgb(${blockColour[queue[6]].R},${blockColour[queue[6]].G},${
              blockColour[queue[6]].B
            })`
          );
        } else {
          $(`#preview-x${x}y${y}`).addClass("preview-show");
          $(`#preview-x${x}y${y}`).css(
            "background-color",
            `rgb(${blockColour[queue[6]].R},${blockColour[queue[6]].G},${
              blockColour[queue[6]].B
            })`
          );
        }
      }
    }
  }
};

const createBlock = () => {
  // Generates a new block at the top.
  // If the space is already occupied, game over
  currentBlock.type = queue.pop();
  currentBlock.rotation = 0;
  currentBlock.array = blocks[currentBlock.type][currentBlock.rotation];
  queue.unshift(Math.floor(Math.random() * 7));
  currentBlock.position = [3, 0];
  currentBlock.floorkickCount = 0;
  currentBlock.colour = blockColour[currentBlock.type];
  previewNextBlock();
  addBlockColours();
  if (fallingFunc === "") {
    fallingFunc = setInterval(falling, speed);
  }
  movementEnabled = 1;
};

const falling = () => {
  // Attempt to move the block 1 pixel down and check conditions
  // If all pass, move the block down 1 pixel
  // Otherwise, fix the block in place
  if (
    checkAreaClear(currentBlock.array, 0, 1) &&
    checkFloorClear(currentBlock.array, 1)
  ) {
    currentBlock.position[1] += 1;
    $(".currentBlock").css("background-color", "").removeClass("currentBlock");
    addBlockColours();
  } else {
    // Fix block in place
    movementEnabled = 0;
    clearInterval(fallingFunc);
    for (let x = 0; x < currentBlock.array[0].length; x++) {
      for (let y = 0; y < currentBlock.array.length; y++) {
        if (currentBlock.array[y][x] == 1) {
          $(`#x${currentBlock.position[0] + x}y${currentBlock.position[1] + y}`)
            .removeClass("currentBlock")
            .addClass("occupied");
          soundLanded.play();
        }
      }
    }
    if (checkCeilingClear() == false) {
      inputEnabled = 0;
      gameOver();
    } else {
      if (checkFullRows()) {
        setTimeout(() => {
          createBlock();
          inputEnabled = 1;
        }, 1200);
      } else {
        createBlock();
        inputEnabled = 1;
      }
    }
  }
};

const addBlockColours = () => {
  for (let x = 0; x < currentBlock.array[0].length; x++) {
    for (let y = 0; y < currentBlock.array.length; y++) {
      if (currentBlock.array[y][x] == 1) {
        $(`#x${currentBlock.position[0] + x}y${currentBlock.position[1] + y}`)
          .addClass("currentBlock")
          .css(
            "background-color",
            `rgb(${currentBlock.colour.R},${currentBlock.colour.G},${currentBlock.colour.B})`
          );
      }
    }
  }
};

const gameOver = () => {
  soundBgm.pause();
  soundGameOver1.play();
  $(".preview-square").removeClass("preview-show").css("background-color", "");

  let counter = 30;
  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`)
          .css("background", 'url("assets/tile-dead.png")')
          .css("background-size", "cover")
          .css("z-index", 2);
      }
    }, counter);
    counter += 30;
  }

  setTimeout(() => {
    $(".occupied").removeClass("occupied");
    $(".board-container").append($gameover);
    $(".board-container").append($reset);
    $(".board-container").append($title);
    $reset.on("click", () => {
      $reset.off("click");
      soundMenu.play();
      resetGame();
    });
    $title.on("click", () => {
      $title.off("click");
      soundMenu.play();
      backToTitle();
    });
  }, counter);

  counter += 1500;
  setTimeout(() => {
    soundGameOver2.play();
  }, counter);
  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`).css("background", "").css("z-index", "");
      }
    }, counter);
    counter += 30;
  }
};

const resetGame = () => {
  let counter = 30;
  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`)
          .css("background", 'url("assets/tile-dead.png")')
          .css("background-size", "cover")
          .css("z-index", 2);
      }
    }, counter);
    counter += 30;
  }

  setTimeout(() => {
    $gameover.remove();
    $reset.remove();
    $title.remove();
  }, counter);

  counter += 1500;

  setTimeout(() => {
    score = 0;
    level = 0;
    lines = 0;
    speed = (speedTable[level] / 60) * 1000;
    $("#score").text(0);
    $("#level").text(0);
    $("#lines").text(0);
  }, counter);

  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`).css("background", "").css("z-index", "");
      }
    }, counter);
    counter += 30;
  }

  setTimeout(playGame, counter);
};

const backToTitle = () => {
  let counter = 30;
  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`)
          .css("background", 'url("assets/tile-dead.png")')
          .css("background-size", "cover")
          .css("z-index", 2);
      }
    }, counter);
    counter += 30;
  }

  setTimeout(() => {
    $gameover.remove();
    $reset.remove();
    $title.remove();
    showTitle();
  }, counter);

  counter += 1500;

  setTimeout(() => {
    score = 0;
    level = 0;
    lines = 0;
    speed = (speedTable[level] / 60) * 1000;
    $("#score").text(0);
    $("#level").text(0);
    $("#lines").text(0);
  }, counter);

  for (let y = 21; y > 1; y--) {
    setTimeout(() => {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`).css("background", "").css("z-index", "");
      }
    }, counter);
    counter += 30;
  }
};

const showTitle = () => {
  $(".board-container").append($logo);
  $(".board-container").append($play);
  $play.on("click", () => {
    $logo.remove();
    $play.remove();
    playGame();
  });
};

const playGame = () => {
  inputEnabled = 1;
  fallingFunc = "";
  soundBgm.currentTime = 0;
  soundBgm.play();
  createInitialQueue();
  createBlock();
};

// ======================================
// Row Clearing
// ======================================

const checkFullRows = () => {
  // See if any row is full. If so, put their Y coordinate in an array
  let fullRows = [];
  for (let y = 0; y < 22; y++) {
    let pixelCount = 0;
    for (let x = 0; x < 10; x++) {
      if ($(`#x${x}y${y}`).hasClass("occupied")) {
        pixelCount += 1;
      }
    }
    if (pixelCount === 10) {
      fullRows.push(y);
    }
  }
  if (fullRows.length > 0) {
    if (fullRows.length === 4) {
      sound4Clear.play();
      score += 1200;
    } else {
      soundClear.play();
      if (fullRows.length === 1) {
        score += 40;
      } else if (fullRows.length === 2) {
        score += 100;
      } else if (fullRows.length === 3) {
        score += 300;
      }
    }
    rowAnimation(fullRows);
    console.log("removing rows...");
    setTimeout(() => {
      lines += fullRows.length;
      $("#score").text(score);
      $("#lines").text(lines);
      checkLevel();
      removeFullRows(fullRows);
    }, 1200);
    return true;
  }
  return false;
};

const rowAnimation = (fullRows) => {
  const setWhite = () => {
    for (let y of fullRows) {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`).css("background-color", "rgb(255,255,255)");
      }
    }
  };
  const setGrey = () => {
    for (let y of fullRows) {
      for (let x = 0; x < 10; x++) {
        $(`#x${x}y${y}`).css("background-color", "rgb(30,30,30)");
      }
    }
  };

  setWhite();
  setTimeout(setGrey, 150);
  setTimeout(setWhite, 300);
  setTimeout(setGrey, 450);
  setTimeout(setWhite, 600);
  setTimeout(setGrey, 750);
  setTimeout(setWhite, 900);
  setTimeout(setGrey, 1050);
};

const removeFullRows = (rowArray) => {
  // For every full row, unoccupy every cell and move all the blocks above them 1 pixel down
  for (let y of rowArray) {
    for (let x = 0; x < 10; x++) {
      $(`#x${x}y${y}`).removeClass("occupied").css("background-color", "");
    }
    for (let y2 = y - 1; y2 >= 0; y2--) {
      for (let x2 = 0; x2 < 10; x2++) {
        if ($(`#x${x2}y${y2}`).hasClass("occupied")) {
          let tempColor = $(`#x${x2}y${y2}`).css("background-color");
          $(`#x${x2}y${y2}`)
            .removeClass("occupied")
            .css("background-color", "");
          $(`#x${x2}y${y2 + 1}`)
            .addClass("occupied")
            .css("background-color", tempColor);
        }
      }
    }
  }
};

const checkLevel = () => {
  if (lines < 309) {
    if (Math.floor(lines / 10) !== level) {
      soundLevelUp.play();
      level = Math.floor(lines / 10);
      speed = (speedTable[level] / 60) * 1000;
      $("#level").text(level);
    }
  }
};

// ======================================
// Movement
// ======================================

const rotate = () => {
  // Rotate the block 90 degrees, then check all conditions
  let tempRotation = 0;
  if (currentBlock.rotation !== 3) {
    tempRotation = currentBlock.rotation + 1;
  }
  let tempArray = blocks[currentBlock.type][tempRotation];

  let areaClearResults = checkAreaClear(tempArray, 0, 0);
  let wallClearResults = checkWallClear(tempArray, 0);
  let floorClearResults = checkFloorClear(tempArray, 0);

  if (areaClearResults && wallClearResults && floorClearResults) {
    currentBlock.rotation = tempRotation;
    currentBlock.array = tempArray;
    $(".currentBlock").css("background-color", "").removeClass("currentBlock");
    addBlockColours();
    soundRotate.play();
  } else if (wallClearResults === false) {
    // Check if wallkick is possible
    let wallkickResults = wallkick(tempArray);
    if (
      wallkickResults[0] &&
      checkAreaClear(tempArray, wallkickResults[1], 0)
    ) {
      currentBlock.position[0] += wallkickResults[1];
      currentBlock.rotation = tempRotation;
      currentBlock.array = tempArray;
      $(".currentBlock")
        .css("background-color", "")
        .removeClass("currentBlock");
      addBlockColours();
      soundRotate.play();
    }
  } else if (areaClearResults === false || floorClearResults === false) {
    // Check if floorkick is possible
    if (floorkick(tempArray) && currentBlock.floorkickCount === 0) {
      currentBlock.position[1] -= 1;
      currentBlock.rotation = tempRotation;
      currentBlock.array = tempArray;
      currentBlock.floorkickCount += 1;
      $(".currentBlock")
        .css("background-color", "")
        .removeClass("currentBlock");
      addBlockColours();
      soundRotate.play();
    }
  }
};

const nudgeLeft = () => {
  // If area and wall checks are clear, move the block 1 pixel left
  if (
    checkAreaClear(currentBlock.array, -1, 0) &&
    checkWallClear(currentBlock.array, -1, 0)
  ) {
    currentBlock.position[0] -= 1;
    $(".currentBlock").css("background-color", "").removeClass("currentBlock");
    addBlockColours();
    return true;
  }
};

const nudgeRight = () => {
  // If area and wall checks are clear, move the block 1 pixel right
  if (
    checkAreaClear(currentBlock.array, 1, 0) &&
    checkWallClear(currentBlock.array, 1, 0)
  ) {
    currentBlock.position[0] += 1;
    $(".currentBlock").css("background-color", "").removeClass("currentBlock");
    addBlockColours();
    return true;
  }
};

// ======================================
// Advanced Movement
// ======================================

const wallkick = (tempArray) => {
  // Shift block 1 pixel right and test, then shift 1 pixel left and test
  if (checkWallClear(tempArray, 1)) {
    return [true, 1];
  } else if (checkWallClear(tempArray, -1)) {
    return [true, -1];
  } else {
    return [false, 0];
  }
};

const floorkick = (tempArray) => {
  // Shift block 1 pixel up and test
  if (
    checkWallClear(tempArray, 0) &&
    checkAreaClear(tempArray, 0, -1) &&
    checkFloorClear(tempArray, -1)
  ) {
    return true;
  } else {
    return false;
  }
};

// ======================================
// Clearance Checks
// ======================================

const checkAreaClear = (testingArray, offsetX, offsetY) => {
  //Check if the area the block will be is occupied
  try {
    for (let x = 0; x < testingArray[0].length; x++) {
      for (let y = 0; y < testingArray.length; y++) {
        if (testingArray[y][x] == 1) {
          //Don't check bounding box, only block pixels
          if (
            $(
              `#x${currentBlock.position[0] + x + offsetX}y${
                currentBlock.position[1] + y + offsetY
              }`
            ).hasClass("occupied")
          ) {
            return false;
          }
        }
      }
    }
    return true;
  } catch {
    return false;
  }
};

const checkWallClear = (testingArray, offsetX) => {
  //Check if the block will exceed the wall limits
  for (let x = 0; x < testingArray[0].length; x++) {
    for (let y = 0; y < testingArray.length; y++) {
      if (testingArray[y][x] == 1) {
        if (
          currentBlock.position[0] + x + offsetX < 0 ||
          currentBlock.position[0] + x + offsetX > 9
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

const checkFloorClear = (testingArray, offsetY) => {
  //Check if the block will go beyond the floor
  for (let x = 0; x < testingArray[0].length; x++) {
    for (let y = 0; y < testingArray.length; y++) {
      if (testingArray[y][x] == 1) {
        if (currentBlock.position[1] + y + offsetY > 21) {
          return false;
        }
      }
    }
  }
  return true;
};

const checkCeilingClear = () => {
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 10; x++) {
      if ($(`#x${x}y${y}`).hasClass("occupied")) {
        return false;
      }
    }
  }
  return true;
};

// ======================================
// Keypress / Button Listeners
// ======================================
let inputEnabled = 0;
let shiftEnabled = 0;

$(document).keydown(function (e) {
  if (movementEnabled === 1 && inputEnabled === 1) {
    if (e.which === 37) {
      // Left
      if (nudgeLeft() && e.originalEvent.repeat === false) {
        soundMove.play();
      }
    } else if (e.which === 39) {
      // Right
      if (nudgeRight() && e.originalEvent.repeat === false) {
        soundMove.play();
      }
    } else if (e.which === 40) {
      // Down
      if (e.originalEvent.repeat === false) {
        clearInterval(fallingFunc);
        if (shiftEnabled === 1) {
          fallingFunc = setInterval(falling, 1);
        } else {
          falling();
          fallingFunc = setInterval(falling, 50);
        }
      }
    } else if (e.which === 38) {
      // Up
      if (e.originalEvent.repeat === false) {
        rotate();
      }
    } else if (e.which === 16) {
      shiftEnabled = 1;
    }
  }
});

$(document).keyup(function (e) {
  if (e.which === 40) {
    clearInterval(fallingFunc);
    fallingFunc = setInterval(falling, speed);
  } else if (e.which === 16) {
    shiftEnabled = 0;
  }
});

// ======================================
// Execute when user loads game
// ======================================

showTitle();
