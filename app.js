$("body").append($("<div>").css("padding-top", "4%"));

for (let y = 0; y < 20; y++) {
  const $gameboard = $("<row>").addClass("game-board").attr("id", `row${y}`);
  for (let x = 0; x < 10; x++) {
    const $square = $("<pixel>").addClass("square").attr("id", `x${x}y${y}`);
    $gameboard.append($square);
  }
  $("body").append($gameboard);
}
