'use strict'

/*
Rules
1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
*/

const MAX_ROWS = 8
const MAX_COLS = 16

const universe = new Array(MAX_COLS * MAX_ROWS)

const createDisplay = () => {
  const table = document.getElementById('life')
  for (let row = 0; row < MAX_ROWS; row++) {
    const tr = document.createElement('tr')
    table.appendChild(tr)
    for (let col = 0; col < MAX_COLS; col++) {
      const td = document.createElement('td')
      td.id = `r${row}c${col}`
      tr.appendChild(td)
    }
  }
}

const createIndex = (col, row) => {
  if (row === MAX_ROWS) {
    console.log(row)
    return 0 * MAX_COLS + col
  }
  return row * MAX_COLS + col
}

const createUniverse = () => {
  universe.fill(false)
  universe[createIndex(2, 1)] = true
  universe[createIndex(3, 2)] = true
  universe[createIndex(1, 3)] = true
  universe[createIndex(2, 3)] = true
  universe[createIndex(3, 3)] = true
}

const updateDisplay = () => {
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      const i = row * MAX_COLS + col
      const id = `r${row}c${col}`
      const el = document.getElementById(id)
      el.className = universe[i] ? 'alive' : 'dead'
    }
  }
}

const updateUniverse = () => {
  const newUniverse = new Array(universe.length)
  for (let row = 0; row < MAX_ROWS; row++) {
    for (let col = 0; col < MAX_COLS; col++) {
      let count = 0
      count += universe[createIndex(col - 1, row)] ? 1 : 0 // left
      count += universe[createIndex(col + 1, row)] ? 1 : 0 // right
      count += universe[createIndex(col, row - 1)] ? 1 : 0 // top
      count += universe[createIndex(col, row + 1)] ? 1 : 0 // bottom
      count += universe[createIndex(col - 1, row - 1)] ? 1 : 0 // top left
      count += universe[createIndex(col + 1, row - 1)] ? 1 : 0 // top right
      count += universe[createIndex(col - 1, row + 1)] ? 1 : 0 // bottom left
      count += universe[createIndex(col + 1, row + 1)] ? 1 : 0 // bottom right
      const cell = universe[createIndex(col, row)]
      if (count < 2 && cell) {
        /* Any live cell with fewer than two live neighbours dies, as if by underpopulation. */
        newUniverse[createIndex(col, row)] = false
      } else if (count >= 2 && count <= 3 && cell) {
        /* Any live cell with two or three live neighbours lives on to the next generation. */
        newUniverse[createIndex(col, row)] = true
      } else if (count > 3 && cell) {
        /* Any live cell with more than three live neighbours dies, as if by overpopulation. */
        newUniverse[createIndex(col, row)] = false
      } else if (count === 3 && !cell) {
        /* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. */
        newUniverse[createIndex(col, row)] = true
      } else {
        newUniverse[createIndex(col, row)] = false
      }
    }
  }

  for (let idx = 0; idx < universe.length; idx++) {
    universe[idx] = newUniverse[idx]
  }
}

const life = () => {
  createDisplay()
  createUniverse()
  let start = 0
  const step = (now) => {
    if (now - start > 400) {
      start = now
      updateDisplay()
      updateUniverse()
    }
    window.requestAnimationFrame(step)
  }
  window.requestAnimationFrame(step)
}

const onReset = () => {
  createUniverse()
}
