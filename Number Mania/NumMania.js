
var gridrows = []; 

$(document).ready(function () {

  launch();

  var strPrevTopVal = "", strPrevLeftVal = "";

  $(document).on('dblclick', '.newTile', function () {
    alert("AAAA");
  });

  $(document).on('mousedown', '.newTile', function () {
    this.style.zIndex = "20";
  });
  
  $(document).on('mouseup', '.newTile', function () {
    
    var strTop = this.style.top;
    var strLeft = this.style.left;
    
    var strTopWithoutPx = strTop.replace("px", "");
    var strLeftWithoutPx = strLeft.replace("px", "");

    var top = parseInt(strTopWithoutPx, 10);
    var left = parseInt(strLeftWithoutPx, 10);

    var newTop = top - (top % 120);
    var newLeft = left - (left % 120);

    var rowIdx = newTop / 120 + 1;
    var colIdx = newLeft / 120 + 1;
    
    var cell = document.getElementById("T_" + rowIdx + "_" + colIdx);

    var strId = this.id;
    if(cell == null){

      $("#" + strId).animate({ left: "" + newLeft + "px", top: "" + newTop + "px" }, 200);
      
      var strTextCont = this.textContent;
      gridrows[rowIdx - 1][colIdx - 1] = parseInt(strTextCont, 10);

      var strOpr = strId.replace("T_", "");
      var strList = strOpr.split("_");

      var oldPosRowIdx = parseInt(strList[0], 10);
      var oldPosColIdx = parseInt(strList[1], 10);
      gridrows[oldPosRowIdx - 1][oldPosColIdx - 1] = -1;

      this.setAttribute("id", "T_" + rowIdx + "_" + colIdx);

      var arrOfTilesHavingSeri = TilesFormingSeries(rowIdx, colIdx);

      if (arrOfTilesHavingSeri.length > 0) {

        gridrows[rowIdx - 1][colIdx - 1] = -1;

        for (var tileIdx = 0; tileIdx < arrOfTilesHavingSeri.length; tileIdx++) {
          $("#" + arrOfTilesHavingSeri[tileIdx]).animate({ left: "" + newLeft + "px", top: "" + newTop + "px" }, 200);
        }
        arrOfTilesHavingSeri.push(this.id);
        var tileContainer = document.getElementsByClassName("tile-container")[0];
        for (var tileIdx = 0; tileIdx < arrOfTilesHavingSeri.length; tileIdx++) {

          var tileToRemove = document.getElementById(arrOfTilesHavingSeri[tileIdx]);
          tileToRemove.style.transform = "scale(0.1)";
        }

        setTimeout(function () {
          var tileContainer = document.getElementsByClassName("tile-container")[0];
          for (var tileIdx = 0; tileIdx < arrOfTilesHavingSeri.length; tileIdx++) {

            var tileToRemove = document.getElementById(arrOfTilesHavingSeri[tileIdx]);
            tileContainer.removeChild(tileToRemove);
          }
        }, 500);

        var score = document.getElementById("score").textContent;
        var intScore = parseInt(score, 10);

        intScore = intScore + (arrOfTilesHavingSeri.length)*10;
        document.getElementById("score").textContent = ("" + intScore);
      }
      else {
        GenerateRandomTiles();
      }
    }
    else {

      var strOpr = strId.replace("T_", "");
      var strList = strOpr.split("_");
      
      var leftVal = (parseInt(strList[1]) - 1) * 120;
      var topVal = (parseInt(strList[0]) - 1) * 120;

      $("#" + strId).animate({ left: "" + leftVal + "px", top: "" + topVal + "px" }, 200);
    }

    this.style.zIndex = "10";
  });
});

function TilesFormingSeries(rowIdx, colIdx) {

  // Checking in row................................................
  var arrOfNumsInRow = gridrows[rowIdx - 1];

  var leftDiff = 0;
  var leftElemCount = 0;
  var arr = LeftTraversal(arrOfNumsInRow, colIdx);
  leftDiff = arr[0];
  leftElemCount = arr[1];

  var rightDiff = 0;
  var rightElemCount = 0;
  arr = RightTraversal(arrOfNumsInRow, colIdx);
  rightDiff = arr[0];
  rightElemCount = arr[1];

  var arrOfTilesId = [];

  if (leftElemCount + rightElemCount >= 3) {

    if (leftDiff == rightDiff) {

      for (var idx = 1; idx <= leftElemCount; idx++) {

        var strElemId = "T_" + rowIdx + "_" + (colIdx - idx);
        gridrows[rowIdx - 1][colIdx - idx - 1] = -1;
        arrOfTilesId.push(strElemId);
      }

      for (var idx = 1; idx <= rightElemCount; idx++) {

        var strElemId = "T_" + rowIdx + "_" + (colIdx + idx);
        gridrows[rowIdx - 1][colIdx + idx - 1] = -1;
        arrOfTilesId.push(strElemId);
      }
    }
    else {

      if ((leftDiff == 1 || leftDiff == -1) && leftElemCount >= 3) {

        for (var idx = 1; idx <= leftElemCount; idx++) {

          var strElemId = "T_" + rowIdx + "_" + (colIdx - idx);
          gridrows[rowIdx - 1][colIdx - idx - 1] = -1;
          arrOfTilesId.push(strElemId);
        }
      }

      if ((rightDiff == 1 || rightDiff == -1) && rightElemCount >= 3) {

        for (var idx = 1; idx <= rightElemCount; idx++) {

          var strElemId = "T_" + rowIdx + "_" + (colIdx + idx);
          gridrows[rowIdx - 1][colIdx + idx - 1] = -1;
          arrOfTilesId.push(strElemId);
        }
      }
    }
  }

  // Checking in column................................................
  var arrOfNumInCol = [];

  for (var idx = 0; idx < 7; idx++) arrOfNumInCol.push(gridrows[idx][colIdx - 1]);

  leftDiff = 0;
  leftElemCount = 0;
  arr = LeftTraversal(arrOfNumInCol, rowIdx);
  leftDiff = arr[0];
  leftElemCount = arr[1];

  rightDiff = 0;
  rightElemCount = 0;
  arr = RightTraversal(arrOfNumInCol, rowIdx);
  rightDiff = arr[0];
  rightElemCount = arr[1];

  if (leftElemCount + rightElemCount >= 3) {

    if (leftDiff == rightDiff) {

      for (var idx = 1; idx <= leftElemCount; idx++) {

        var strElemId = "T_" + (rowIdx - idx) + "_" + colIdx;
        gridrows[rowIdx - idx - 1][colIdx - 1] = -1;
        arrOfTilesId.push(strElemId);
      }

      for (var idx = 1; idx <= rightElemCount; idx++) {

        var strElemId = "T_" + (rowIdx + idx) + "_" + colIdx;
        gridrows[rowIdx + idx - 1][colIdx - 1] = -1;
        arrOfTilesId.push(strElemId);
      }
    }
    else {

      if ((leftDiff == 1 || leftDiff == -1) && leftElemCount >= 3) {

        for (var idx = 1; idx <= leftElemCount; idx++) {

          var strElemId = "T_" + (rowIdx - idx) + "_" + colIdx;
          gridrows[rowIdx - idx - 1][colIdx - 1] = -1;
          arrOfTilesId.push(strElemId);
        }
      }

      if ((rightDiff == 1 || rightDiff == -1) && rightElemCount >= 3) {

        for (var idx = 1; idx <= rightElemCount; idx++) {

          var strElemId = "T_" + (rowIdx + idx) + "_" + colIdx;
          gridrows[rowIdx + idx - 1][colIdx - 1] = -1;
          arrOfTilesId.push(strElemId);
        }
      }
    }
  }
  
  return arrOfTilesId;
}

function LeftTraversal(array, pickIdx) {

  //left traversal..........
  var leftCount = 0;
  var leftDiff = 0;
  if (pickIdx > 1) {

    var idx = pickIdx - 1;
    leftDiff = array[idx] - array[idx - 1];
    if (leftDiff == 1 || leftDiff == -1) {
      leftCount++;
      var loop = true;
      idx--;

      while (loop) {
        if (idx == 0) break;
        var currDiff = array[idx] - array[idx - 1];
        if (currDiff == leftDiff) leftCount++;
        else break;
        idx--;
      }

    }
  }

  return [leftDiff, leftCount];
}

function RightTraversal(array, pickIdx) {

  //Right traversal..........
  var rightCount = 0;
  var rightDiff = 0;
  if (pickIdx < array.length) {

    var idx = pickIdx - 1;
    rightDiff = array[idx + 1] - array[idx];
    if (rightDiff == 1 || rightDiff == -1) {
      rightCount++;
      var loop = true;
      idx++;

      while (loop) {
        if (idx == (array.length - 1)) break;
        var currDiff = array[idx + 1] - array[idx];
        if (currDiff == rightDiff) rightCount++;
        else break;
        idx++;
      }

    }
  }

  return [rightDiff, rightCount];
}

function GetRandNumbers(limit, count) {
   
  var numbers = [];
  for (var idx = 1; idx <= limit; idx++) numbers.push(idx);

  var randNums = [];

  while (randNums.length < count) {

    var arrIdx = Math.floor(Math.random() * (numbers.length));
    randNums.push(numbers[arrIdx]);
    numbers.splice(arrIdx, 1);
  }

  return randNums;
}

function GetNumberOfOccurence(array, number){

  var count = 0;
  for(var idx = 0; idx < array.length; idx++){

    if(array[idx] == number) count++;
  }

  return count;
}

function GenerateRandomTiles() {

  var arrOfRowsHavingNulls = [];
  var nullCount = 0;
  for (var rowIdx = 0; rowIdx < 7; rowIdx++) {
    var nullOccrInRow = GetNumberOfOccurence(gridrows[rowIdx], -1);

    if (nullOccrInRow > 0) {

      nullCount = nullCount + nullOccrInRow;
      arrOfRowsHavingNulls.push(rowIdx + 1);
    }
  }

  var numOfTilesToGen = 3;
  if (nullCount < 3) numOfTilesToGen = nullCount;

  var arrOfRandNums = GetRandNumbers(10, numOfTilesToGen);

  for (var newTileIdx = 0; newTileIdx < numOfTilesToGen; newTileIdx++) {

    if (arrOfRowsHavingNulls.length == 0) break;
    var randArrIdx = Math.floor(Math.random() * (arrOfRowsHavingNulls.length));
    var rowIdx = arrOfRowsHavingNulls[randArrIdx] - 1;
    var rowArr = gridrows[rowIdx];

    var arrOfNullIdxs = [];
    for (var idx = 0; idx < rowArr.length; idx++) {

      if (rowArr[idx] == -1) arrOfNullIdxs.push(idx);
    }

    if (arrOfNullIdxs.length == 0) {

      arrOfRowsHavingNulls.splice(randArrIdx, 1);
      newTileIdx--;
      continue;
    }

    randArrIdx = Math.floor(Math.random() * (arrOfNullIdxs.length));
    var arrIdx = arrOfNullIdxs[randArrIdx];
    CreateTile(rowIdx + 1, arrIdx + 1, arrOfRandNums[newTileIdx]);
    document.getElementById("T_" + (rowIdx + 1) + "_" + (arrIdx + 1)).style.transform = "scale(1)";
    gridrows[rowIdx][arrIdx] = arrOfRandNums[newTileIdx];
  }

  if (nullCount <= 3) {
    alert("GAME OVER");
    location.reload();
  }
}

function CreateTile(rowIdx, colIdx, tileNum) {

  var tileContainer = document.getElementsByClassName("tile-container")[0];

  var newTile = document.createElement("div");

  newTile.setAttribute("class", "newTile");

  var strTop  = "" + (120 * (rowIdx - 1)) + "px";
  var strLeft = "" + (120 * (colIdx - 1)) + "px";

  newTile.style.left = strLeft;
  newTile.style.top = strTop;
  newTile.textContent = "" + tileNum;
  var strId = "T_" + rowIdx + "_" + colIdx;
  newTile.setAttribute("id", strId);
  newTile.style.transform = "scale(0.1)";
  newTile.style.zIndex = "10";
  tileContainer.appendChild(newTile);

  $(".newTile").draggable();
  $(".newTile").droppable();
}

function launch() {

  for (var rowIdx = 1; rowIdx <= 7; rowIdx++) {

    var row = [];
    for (var colIdx = 1; colIdx <= 16; colIdx++) row.push(-1);

    gridrows.push(row);
  }

  for (var rowIdx = 1; rowIdx <= 7; rowIdx++) {

    var randColIdx = GetRandNumbers(16, 7);
    var randTileNums = GetRandNumbers(10, 7);
    
    for (var colIdx = 0; colIdx < randTileNums.length; colIdx++) {

      CreateTile(rowIdx, randColIdx[colIdx], randTileNums[colIdx]);
      document.getElementById("T_" + rowIdx + "_" + randColIdx[colIdx]).style.transform = "scale(1)";
      gridrows[rowIdx - 1][randColIdx[colIdx] - 1] = randTileNums[colIdx];
    }
    
  }
}

