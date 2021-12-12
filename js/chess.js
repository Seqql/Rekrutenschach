let chessTiles = document.querySelectorAll(".singleTile");

let currPos = -1;

let whiteOutputFigures = [],
  blackOutputFigures = [];
//Adding extra information to each tile about their current figure state
chessTiles.forEach((el) => {
  el.figure = {
    isOccupied: false,
    user: true, //True player1, false player2, cant be null
  };
  let img = document.createElement("img");
  img.classList.add("img");

  el.appendChild(img);
});

let isOddRow = true;
let selected = null; //The selected Tile (NodeElement)
let selectedActions = [];

let currUser = true; //true equals player 1 turn, false equals player 2 turn

let color1 = "blackTiles";
let color2 = "whiteTiles";

function figureClick(event) {
  event.preventDefault;
  // console.log(chessTiles);
  console.log(event);

  // console.log(target);

  if (selected == null) {
    //Select a figure
    if (!event.currentTarget.figure.isOccupied) return;

    if (
      event.currentTarget.figure.isOccupied &&
      event.currentTarget.figure.user == currUser
    ) {
      setSelected(event.currentTarget);
    }

    return;
  }

  let index = -1;
  chessTiles.forEach((el, idx) => {
    if (el == event.currentTarget) {
      index = idx;
      return;
    }
  }); //Index of the selected tile

  if (selected != null) {
    if (index == currPos) {
      clearSelected();
    } else if (checkMovement(index)) {
      //If the clicked tile is movement option
      if (event.currentTarget.figure.isOccupied) {
        if (currUser) blackOutputFigures.push(chessTiles[currPos].figure);
        else whiteOutputFigures.push(chessTiles[currPos].figure);

        let kickedFigure = event.currentTarget.figure;
        check4Win(kickedFigure);
      }

      Object.assign(event.currentTarget.figure, chessTiles[currPos].figure); //Set data to new pos
      Object.assign(chessTiles[currPos].figure, {
        isOccupied: false,
        user: true,
      }); //Set data of old pos
      event.currentTarget.firstChild.src = chessTiles[currPos].firstChild.src; //Set img to new pos
      event.currentTarget.firstChild.alt = chessTiles[currPos].firstChild.alt; //Set alt to new pos
      event.currentTarget.className +=
        " " + chessTiles[currPos].className.split(" ")[2]; //Set class to new pos

      chessTiles[currPos].firstChild.src = " "; //Set img of old pos
      chessTiles[currPos].firstChild.alt = ""; //Set alt of old pos
      chessTiles[currPos].className = chessTiles[currPos].className
        .split(" ")
        .splice(0, 2)
        .join(" "); //Set class of old pos

      clearSelected();
      changePlayer();
    } else if (event.currentTarget.figure.user == currUser) {
      setSelected(event.currentTarget);
    }
  }
}

function checkMovement(posToGo) {
  return selectedActions.find((el) => el == posToGo) ? true : false;
}

function setSelected(item) {
  clearSelected();
  selected = item;
  determineActionPossibilities();
  colorizeTiles();
}

function clearSelected() {
  selected = null;
  selectedActions = [];
  decolorizeTiles();
}

function colorizeTiles() {
  // chessTiles.forEach((el, idx) => {
  //   if (selectedActions.find((ele) => ele == idx)) {
  //     el.classList.add("tileToGo");
  //   }
  // });

  selectedActions.forEach((el) => {
    chessTiles[el].classList.add("tileToGo");
  });
}

function decolorizeTiles() {
  chessTiles.forEach((el) => {
    el.classList.remove("tileToGo");
  });
}

function determineActionPossibilities() {
  //Set current Pos
  chessTiles.forEach((el, idx) => {
    if (el == selected) {
      currPos = idx;
      return;
    }
  });

  //Movement of each figure
  if (selected.figure.name.toLowerCase() == "pawn") {
    checkPawn();
  } else if (selected.figure.name.toLowerCase() == "knight") {
    checkKnight();
  } else if (selected.figure.name.toLowerCase() == "king") {
    checkKing();
  } else if (selected.figure.name.toLowerCase() == "rook") {
    checkRook();
  } else if (selected.figure.name.toLowerCase() == "bishop") {
    checkBishop();
  } else if (selected.figure.name.toLowerCase() == "queen") {
    checkQueen();
  }

  //Remove the tiles if a friendly figure stands on it
  selectedActions = selectedActions.filter((el) => {
    if (chessTiles[el].figure.isOccupied) {
      if (chessTiles[el].figure.user == currUser) {
        el = el + 1 - 1;
      } else {
        return el;
      }
    } else {
      if (el === 0) return true;
      else return el;
    }
  });

  console.log(selectedActions);
}

function init() {
  //Colorize the chessboard
  chessTiles.forEach((el, idx) => {
    if (idx % 8 == 0) isOddRow = !isOddRow;
    if (idx % 2 == 0) {
      el.classList.add(isOddRow ? color1 : color2);
    } else el.classList.add(isOddRow ? color2 : color1);
  });

  //Set img for the start
  chessTiles.forEach((el, idx) => {
    let img = el.firstChild;
    let user = false;

    if (idx > 31) user = true;

    if ((idx >= 48 && idx <= 55) || (idx >= 8 && idx <= 15)) {
      img.setAttribute("src", "./chessFigures/Figuren/Rekrut.png");
      img.setAttribute("alt", "REKRUT");
      Object.assign(el.figure, figures.pawn);
      el.figure.isOccupied = true;
    } else if (idx == 56 || idx == 63 || idx == 0 || idx == 7) {
      img.setAttribute("src", "./chessFigures/Figuren/Leutnant.png");
      img.setAttribute("alt", "LEUTNANT");
      Object.assign(el.figure, figures.rook);
      el.figure.isOccupied = true;
    } else if (idx == 57 || idx == 62 || idx == 1 || idx == 6) {
      img.setAttribute("src", "./chessFigures/Figuren/Zugsführer.png");
      img.setAttribute("alt", "ZUGSFÜHRER");
      Object.assign(el.figure, figures.knight);
      el.figure.isOccupied = true;
    } else if (idx == 58 || idx == 61 || idx == 2 || idx == 5) {
      img.setAttribute("src", "./chessFigures/Figuren/Stabswachtmeister.png");
      img.setAttribute("alt", "STABSWACHTMEISTER");
      Object.assign(el.figure, figures.bishop);
      el.figure.isOccupied = true;
    } else if (idx == 60 || idx == 3) {
      img.setAttribute("src", "./chessFigures/Figuren/General.png");
      img.setAttribute("alt", "GENERAL");
      Object.assign(el.figure, figures.king);
      el.figure.isOccupied = true;
    } else if (idx == 59 || idx == 4) {
      img.setAttribute("src", "./chessFigures/Figuren/Oberst.png");
      img.setAttribute("alt", "OBERST");
      Object.assign(el.figure, figures.queen);
      el.figure.isOccupied = true;
    }

    if (el.figure.isOccupied) {
      if (user) {
        el.figure.user = true;
        el.classList.add("whiteFigure");
      } else {
        el.figure.user = false;
        el.classList.add("blackFigure");
      }
    }
  });

  //Add an EventListener
  chessTiles.forEach((el) => {
    el.addEventListener("click", figureClick);
  });
}

init();

function checkPawn() {
  if (selected.figure.user == true) {
    if (currPos < 8) {
      //End of Board
      return;
    }
    if (currPos % 8 != 0) {
      //Left Wall
      selectedActions.push(currPos - 7);
    }
    if (currPos % 8 != 7) {
      //Right Wall
      selectedActions.push(currPos - 9);
    }
    selectedActions = selectedActions.filter((el) => {
      if (chessTiles[el].figure.isOccupied)
        if (chessTiles[el].figure.user != currUser) return el;
    });
    selectedActions.push(currPos - 8);
  } else if (selected.figure.user == false) {
    if (currPos > 56) {
      //End of Board
      return;
    }
    if (currPos % 8 != 0) {
      //Left Wall
      selectedActions.push(currPos + 9);
    }
    if (currPos % 8 != 7) {
      //Right Wall
      selectedActions.push(currPos + 7);
    }
    selectedActions = selectedActions.filter((el) => {
      if (chessTiles[el].figure.isOccupied)
        if (chessTiles[el].figure.user != currUser) return el;
    });

    if (!chessTiles[currPos + 8].figure.isOccupied)
      selectedActions.push(currPos + 8);
  }
}

function checkKnight() {
  if (currPos > 15) {
    //Forward
    if (currPos % 8 >= 1) {
      //Forward (t2, l1)
      selectedActions.push(currPos - 17);
    }
    if (currPos % 8 <= 6) {
      //Forward (t2, r1)
      selectedActions.push(currPos - 15);
    }
  }

  if (currPos < 48) {
    //Back
    if (currPos % 8 >= 1) {
      //Back (b2, l1)
      selectedActions.push(currPos + 15);
    }
    if (currPos % 8 <= 6) {
      //Forward (t2, r1)
      selectedActions.push(currPos + 17);
    }
  }

  if (currPos % 8 >= 2) {
    //Left
    if (currPos > 8) {
      //left (l2, t1)
      selectedActions.push(currPos - 10);
    }
    if (currPos < 56) {
      //Left (l2, b1)
      selectedActions.push(currPos + 6);
    }
  }

  if (currPos % 8 <= 5) {
    //right
    if (currPos > 8) {
      //left (r2, t1)
      selectedActions.push(currPos - 6);
    }
    if (currPos < 56) {
      //Left (r2, b1)
      selectedActions.push(currPos + 10);
    }
  }
}

function checkKing() {
  if (currPos > 7) {
    //top
    selectedActions.push(currPos - 8);
  }

  if (currPos % 8 >= 1) {
    //left
    selectedActions.push(currPos - 1);
  }

  if (currPos < 56) {
    //Bottom
    selectedActions.push(currPos + 8);
  }

  if (currPos % 8 <= 6) {
    //Right
    selectedActions.push(currPos + 1);
  }

  if (currPos > 7 && currPos % 8 >= 1) {
    //top-left
    selectedActions.push(currPos - 9);
  }

  if (currPos > 7 && currPos % 8 <= 6) {
    //top-right
    selectedActions.push(currPos - 7);
  }

  if (currPos % 8 >= 1 && currPos < 56) {
    //bottom-left
    selectedActions.push(currPos + 7);
  }

  if (currPos < 56 && currPos % 8 <= 6) {
    //bottom-right
    selectedActions.push(currPos + 9);
  }
}

function checkBishop() {
  //Top-left
  for (let i = currPos - 9; i >= 0 && i % 8 != 7; i -= 9) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Top-right
  for (let i = currPos - 7; i >= 0 && i % 8 != 0; i -= 7) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Bottom-left
  for (let i = currPos + 7; i <= 63 && i % 8 != 7; i += 7) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Bottom-right
  for (let i = currPos + 9; i <= 63 && i % 8 != 0; i += 9) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }
}

function checkRook() {
  //Right
  for (let i = currPos + 1; i % 8 <= 7; i++) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Left
  for (let i = currPos - 1; i >= currPos - (currPos % 8); i--) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Top
  for (let i = currPos - 8; i >= 0; i -= 8) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }

  //Bottom
  for (let i = currPos + 8; i <= 63; i += 8) {
    const el = chessTiles[i];
    if (el.figure.isOccupied) {
      if (el.figure.user != currUser) selectedActions.push(i);
      break;
    }
    selectedActions.push(i);
  }
}

function checkQueen() {
  checkRook();
  checkBishop();
}
// Pawn = pa | check
// Rook = ro | check
// Knight = kn | check
// bishop = bi
// King = ki | check
// Queen = qu
// White bottom player1, Black top Player2

let infoDisplay = document.querySelector("#infoDisplay");
console.log(infoDisplay);

function check4Win(kickedFigure) {
  if (kickedFigure.name.toLowerCase() == "king") {
    let winner = currUser ? "1 (White)" : "2 (Black)";
    infoDisplay.innerText = "Player " + winner + " WINS!!";
  }
}

function changePlayer() {
  currUser = !currUser;
  let con = document.querySelector(".container");
  // let interval = setInterval((i) => {
  // let trans = con.getAttribute("style");
  //   console.log("Transform1", trans);

  // trans = trans.split("(")[1].split(")")[0].split("d")[0];
  //   con.removeAttribute("style");

  //   trans++;
  //   con.setAttribute("style", "transform: rotate(" + trans + "deg)");

  //   if (trans % 180 == 0) {
  //     i.clearInterval();
  //   }
  // });

  // let trans = con.getAttribute("style");
  // trans = parseInt(trans.split("(")[1].split(")")[0].split("d")[0]);
  // trans += 180;
  // con.removeAttribute("style");
  // con.setAttribute("style", "transform: rotate(" + trans + "deg)");

  // for (let i = 0; 180; i++) {
  //   setTimeout(() => {
  //     let trans = con.getAttribute("style");
  //     trans = parseInt(trans.split("(")[1].split(")")[0].split("d")[0]);
  //     trans++;
  //     con.removeAttribute("style");
  //     con.setAttribute("style", "transform: rotate(" + trans + "deg)");
  //   }, 10);
  // }
}
