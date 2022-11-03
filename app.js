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

let queue = [];
let fallingFunc = "";

let currentBlock = {
  type: 0,
  rotation: 0,
  array: [],
  position: [0, 0], // indicates top left corner of bounding box [x,y]
  floorkickCount: 0,
};

$("body").append($("<div>").css("padding-top", "4%"));

for (let y = 0; y < 22; y++) {
  const $gameboard = $("<row>").addClass("game-board").attr("id", `row${y}`);
  for (let x = 0; x < 10; x++) {
    const $square = $("<pixel>").addClass("square").attr("id", `x${x}y${y}`);
    $gameboard.append($square);
  }
  $("body").append($gameboard);
}

const changePixelColour = (x, y) => {
  $(`#x${x}y${y}`).css("background-color", "black");
};

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
  //preview the upcoming block in the top left area
  console.log(queue[6]);
};

const createBlock = () => {
  currentBlock.type = queue.pop();
  currentBlock.rotation = 0;
  currentBlock.array = blocks[currentBlock.type][currentBlock.rotation];
  queue.unshift(Math.floor(Math.random() * 7));
  currentBlock.position = [3, 0];

  //console.log(currentBlock.array);
  previewNextBlock();
  if (checkAreaClear(currentBlock.array, 0, 0)) {
    addBlockColours();
    fallingFunc = setInterval(falling, 2000);
  } else {
    console.log("GAME OVER");
    //game over
  }
};

const falling = () => {
  if (
    checkAreaClear(currentBlock.array, 0, 1) &&
    checkFloorClear(currentBlock.array, 1)
  ) {
    currentBlock.position[1] += 1;
    $(".currentBlock").removeClass("currentBlock");
    addBlockColours();
  } else {
    //fix block in place
    for (let x = 0; x < currentBlock.array[0].length; x++) {
      for (let y = 0; y < currentBlock.array.length; y++) {
        if (currentBlock.array[y][x] == 1) {
          $(`#x${currentBlock.position[0] + x}y${currentBlock.position[1] + y}`)
            .removeClass("currentBlock")
            .addClass("occupied");
        }
      }
    }
    clearInterval(fallingFunc);
    checkFullRows();
    createBlock();
  }
};

const addBlockColours = () => {
  for (let x = 0; x < currentBlock.array[0].length; x++) {
    for (let y = 0; y < currentBlock.array.length; y++) {
      if (currentBlock.array[y][x] == 1) {
        $(
          `#x${currentBlock.position[0] + x}y${currentBlock.position[1] + y}`
        ).addClass("currentBlock");
      }
    }
  }
};

const checkFullRows = () => {
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
    console.log("Removing full rows");
    console.log(fullRows);
    removeFullRows(fullRows);
  }
};

const removeFullRows = (rowArray) => {
  for (let y of rowArray) {
    for (let x = 0; x < 10; x++) {
      $(`#x${x}y${y}`).removeClass("occupied");
    }
    for (let y2 = y - 1; y2 >= 0; y2--) {
      for (let x2 = 0; x2 < 10; x2++) {
        console.log(`checking #x${x2}y${y2}`);
        if ($(`#x${x2}y${y2}`).hasClass("occupied")) {
          $(`#x${x2}y${y2}`).removeClass("occupied");
          $(`#x${x2}y${y2 + 1}`).addClass("occupied");
          console.log(`Remove from #x${x2}y${y2}, add to #x${x2}y${y2 + 1}`);
        }
      }
    }
  }
};

// ======================================
// Movement
// ======================================

const rotate = () => {
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
    $(".currentBlock").removeClass("currentBlock");
    addBlockColours();
  } else if (wallClearResults === false) {
    console.log("checking wallkick");
    let wallkickResults = wallkick(tempArray);
    if (
      wallkickResults[0] &&
      checkAreaClear(tempArray, wallkickResults[1], 0)
    ) {
      console.log("executing wallkick");
      currentBlock.position[0] += wallkickResults[1];
      currentBlock.rotation = tempRotation;
      currentBlock.array = tempArray;
      $(".currentBlock").removeClass("currentBlock");
      addBlockColours();
    }
  } else if (areaClearResults === false || floorClearResults === false) {
    console.log("checking floorkick");
    if (floorkick(tempArray)) {
      console.log("executing floorkick");
      currentBlock.position[1] -= 1;
      currentBlock.rotation = tempRotation;
      currentBlock.array = tempArray;
      $(".currentBlock").removeClass("currentBlock");
      addBlockColours();
    } else {
      console.log("rotate failed.");
    }
  }
};

const nudgeLeft = () => {
  if (
    checkAreaClear(currentBlock.array, -1, 0) &&
    checkWallClear(currentBlock.array, -1, 0)
  ) {
    currentBlock.position[0] -= 1;
    $(".currentBlock").removeClass("currentBlock");
    addBlockColours();
  }
};

const nudgeRight = () => {
  if (
    checkAreaClear(currentBlock.array, 1, 0) &&
    checkWallClear(currentBlock.array, 1, 0)
  ) {
    currentBlock.position[0] += 1;
    $(".currentBlock").removeClass("currentBlock");
    addBlockColours();
  }
};

// ======================================
// Advanced Movement
// ======================================

const wallkick = (tempArray) => {
  if (checkWallClear(tempArray, 1)) {
    return [true, 1];
  } else if (checkWallClear(tempArray, -1)) {
    return [true, -1];
  } else {
    return [false, 0];
  }
};

const floorkick = (tempArray) => {
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
  //don't check bounding box, only block pixels
  try {
    for (let x = 0; x < testingArray[0].length; x++) {
      for (let y = 0; y < testingArray.length; y++) {
        if (testingArray[y][x] == 1) {
          if (
            $(
              `#x${currentBlock.position[0] + x + offsetX}y${
                currentBlock.position[1] + y + offsetY
              }`
            ).hasClass("occupied")
          ) {
            console.log(
              `block x${currentBlock.position[0] + x}y${
                currentBlock.position[1] + y
              } is occupied`
            );
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

// ======================================
// Keypress Listeners
// ======================================

$(document).keydown(function (e) {
  if (e.which === 37) {
    nudgeLeft();
  } else if (e.which === 39) {
    nudgeRight();
  } else if (e.which === 40) {
    falling();
  } else if (e.which === 38) {
    rotate();
  }
});

// ======================================
// Execute when user loads game
// ======================================

createInitialQueue();

$("#x0y0").on("click", () => {
  createBlock();
});

//$("#x4y9").addClass("occupied");
