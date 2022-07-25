'use strict'

/*
Rules
1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell,
   as if by reproduction.
*/

const MAX_COLS = 64
const MAX_ROWS = 32

const universe = new Array(MAX_COLS * MAX_ROWS)

const createDisplay = (maxCols, maxRows) => {
  const table = document.getElementById('life')
  for (let row = 0; row < maxRows; row++) {
    const tr = document.createElement('tr')
    table.appendChild(tr)
    for (let col = 0; col < maxCols; col++) {
      const td = document.createElement('td')
      td.id = `c${col}r${row}`
      tr.appendChild(td)
    }
  }
}

const createIndex = (col, row, maxCols, maxRows) => {
  if (col < 0 && row < 0) {
    return maxCols * maxRows - 1
  } else if (col < 0) {
    return row * maxCols + maxCols - 1
  } else if (row < 0) {
    return (maxRows - 1) * maxCols + col
  } else if (col === maxCols && row === maxRows) {
    return 0
  } else if (col === maxCols) {
    return row * maxCols
  } else if (row === maxRows) {
    return col
  } else {
    return row * maxCols + col
  }
}

const createGlider = (universe, maxCols, maxRows) => {
  universe[createIndex(1, 0, maxCols, maxRows)] = true
  universe[createIndex(2, 1, maxCols, maxRows)] = true
  universe[createIndex(0, 2, maxCols, maxRows)] = true
  universe[createIndex(1, 2, maxCols, maxRows)] = true
  universe[createIndex(2, 2, maxCols, maxRows)] = true
}

const createRandom = (universe, maxCols, maxRows) => {
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const idx = row * maxCols + col
      universe[idx] = !(Math.random() < 0.5)
    }
  }
}

const createUniverse = (universe, maxCols, maxRows) => {
  universe.fill(false)
  createRandom(universe, maxCols, maxRows)
  createGlider(universe, maxCols, maxRows)
}

const updateDisplay = (universe, maxCols, maxRows) => {
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      const i = row * maxCols + col
      const id = `c${col}r${row}`
      const el = document.getElementById(id)
      el.className = universe[i] ? 'alive' : 'dead'
    }
  }
}

const updateUniverse = (universe, maxCols, maxRows) => {
  const newUniverse = new Array(universe.length)
  for (let row = 0; row < maxRows; row++) {
    for (let col = 0; col < maxCols; col++) {
      let count = 0
      count += universe[createIndex(col - 1, row, maxCols, maxRows)] ? 1 : 0 // left
      count += universe[createIndex(col + 1, row, maxCols, maxRows)] ? 1 : 0 // right
      count += universe[createIndex(col, row - 1, maxCols, maxRows)] ? 1 : 0 // top
      count += universe[createIndex(col, row + 1, maxCols, maxRows)] ? 1 : 0 // bottom
      count += universe[createIndex(col - 1, row - 1, maxCols, maxRows)] ? 1 : 0 // top left
      count += universe[createIndex(col + 1, row - 1, maxCols, maxRows)] ? 1 : 0 // top right
      count += universe[createIndex(col - 1, row + 1, maxCols, maxRows)] ? 1 : 0 // bottom left
      count += universe[createIndex(col + 1, row + 1, maxCols, maxRows)] ? 1 : 0 // bottom right
      const cell = universe[createIndex(col, row, maxCols, maxRows)]
      if (count < 2 && cell) {
        /* Any live cell with fewer than two live neighbours dies, as if by underpopulation. */
        newUniverse[createIndex(col, row, maxCols, maxRows)] = false
      } else if (count >= 2 && count <= 3 && cell) {
        /* Any live cell with two or three live neighbours lives on to the next generation. */
        newUniverse[createIndex(col, row, maxCols, maxRows)] = true
      } else if (count > 3 && cell) {
        /* Any live cell with more than three live neighbours dies, as if by overpopulation. */
        newUniverse[createIndex(col, row, maxCols, maxRows)] = false
      } else if (count === 3 && !cell) {
        /* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. */
        newUniverse[createIndex(col, row, maxCols, maxRows)] = true
      } else {
        newUniverse[createIndex(col, row, maxCols, maxRows)] = false
      }
    }
  }
  for (let idx = 0; idx < universe.length; idx++) {
    universe[idx] = newUniverse[idx]
  }
}

const life = () => {
  createDisplay(MAX_COLS, MAX_ROWS)
  createUniverse(universe, MAX_COLS, MAX_ROWS)
  let start = 0
  const step = (now) => {
    if (now - start > 250) {
      start = now
      updateDisplay(universe, MAX_COLS, MAX_ROWS)
      updateUniverse(universe, MAX_COLS, MAX_ROWS)
    }
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}

const onReset = () => {
  createUniverse(universe, MAX_COLS, MAX_ROWS)
}
