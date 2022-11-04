const playerHand = [];
const dealerHand = [];

const drawCard = () => {
  let dupe = 1;
  let myCard = 0;
  while (dupe === 1) {
    dupe = 0;
    myCard = Math.floor(Math.random() * 52) + 1;
    for (let y = 0; y < playerHand.length; y++) {
      if (myCard === playerHand[y]) {
        dupe = 1;
        break;
      }
    }
    for (let z = 0; z < dealerHand; z++) {
      if (myCard === dealerHand[z]) {
        dupe = 1;
        break;
      }
    }
  }
  playerHand.push(myCard);
  console.log(playerHand);
};

for (let x = 0; x < 10; x++) {
  drawCard();
}

/*
1 % 13 = 1
14 % 13 = 1
27 % 13 = 1
41 % 13 = 1

0 = king
1 = ace
2-10 = numbers
11 = jack
12 = queen

if result is 0/10/11/12, value is 10
if result is 1, value is 1 or 11
else the value is the result
*/
