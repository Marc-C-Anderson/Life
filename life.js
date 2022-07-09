"use strict";

const MAX_ROWS = 8;
const MAX_COLS = 16;

const createDisplay = (maxCols, maxRows) => {
  const createRows = (table, maxRows) => {
    const createCols = (tr, maxCols) => {
      for (let col = 0; col < maxCols; col++) {
        const td = document.createElement("td");
        tr.appendChild(td);
      }
    };
    for (let row = 0; row < maxRows; row++) {
      const tr = document.createElement("tr");
      createCols(tr, maxCols);
      table.appendChild(tr);
    }
  };
  const table = document.getElementById("life");
  createRows(table, maxRows);
  return table;
};

const updateDisplay = (maxCols, maxRows, table, universe) => {
  const elements = table.children;
  for (let row = 0; row < maxRows; row++) {
    const tr = elements.item(row);
    for (let col = 0; col < maxCols; col++) {
      const td = tr.children.item(col);
      const val = universe[row * MAX_COLS + col];
      if (val === undefined) {
        td.innerText = "u";
        td.className = "undefined";
      } else {
        td.innerText = val ? "t" : "f";
        td.className = val ? "alive" : "dead";
      }
    }
  }
};

const createUniverse = (maxCols, maxRows) => {
  const universe = [];
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const cell = row === 3 && col >= 6 && col <= 8 ? true : false;
      const cell2 = Math.random() >= 0.5 ? true : false;
      universe.push(cell);
    }
  }
  return universe;
};

/*
Rules

1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/
const step = (maxCols, universe) => {
  const newUniverse = [];
  for (let idx = 0; idx < universe.length; idx++) {
    const l = idx - 1;
    const r = idx + 1;
    const t = idx - maxCols;
    const b = idx + maxCols;
    const tl = t - 1;
    const tr = t + 1;
    const bl = b - 1;
    const br = b + 1;
    
    let count = 0;
    count += universe[l] ? 1 : 0;
    count += universe[r] ? 1 : 0;  
    count += universe[t] ? 1 : 0;
    count += universe[b] ? 1 : 0;
    count += universe[tl] ? 1 : 0;
    count += universe[tr] ? 1 : 0;
    count += universe[bl] ? 1 : 0;
    count += universe[br] ? 1 : 0;
    const cell = universe[idx];
    if (count < 2 && cell) {
      /* Any live cell with fewer than two live neighbours dies, as if by underpopulation. */
      newUniverse.push(false);
    } else if ((count >= 2 || count <= 3) && cell) {
      /* Any live cell with two or three live neighbours lives on to the next generation. */
      newUniverse.push(true);
    } else if (count > 3 && cell) {
      /* Any live cell with more than three live neighbours dies, as if by overpopulation. */
      newUniverse.push(false);
    } else if (count === 3 && !cell) {
      /* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. */
      newUniverse.push(true);
    } else {
      newUniverse.push(false);
    }
  }
  return newUniverse;
};

const play = (maxCols, maxRows, table, universe, iterations) => {
  // console.log(`play`);
  //for (let i = 0; i < iterations; i++) {
  const newUniverse = step(maxCols, universe);
  updateDisplay(maxCols, maxRows, table, newUniverse);
  //universe = newUniverse;
  //}
  return newUniverse;
};

const game = () => {
  console.log("hi");
  const table = createDisplay(MAX_COLS, MAX_ROWS);
  let universe = createUniverse(MAX_COLS, MAX_ROWS);
  //const universe2 = createUniverse2(MAX_COLS, MAX_ROWS);
  //const universe = universe;
  updateDisplay(MAX_COLS, MAX_ROWS, table, universe);
  let start = 0;
  const step2 = (timestamp) => {
    // if (start === undefined) {
    //   start = timestamp;
    // }
    const elapsed = timestamp - start;
    if (elapsed > 200) {
      start = timestamp;
      // console.log(`timestamp: ${timestamp}`);
      universe = play(MAX_COLS, MAX_ROWS, table, universe, 1);
    }
    window.requestAnimationFrame(step2);
  };
  window.requestAnimationFrame(step2);
};

game();
