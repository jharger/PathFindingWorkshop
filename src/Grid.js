import Exception from './Exception.js';

const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;
const NORTHEAST = 4;
const NORTHWEST = 5;
const SOUTHEAST = 6;
const SOUTHWEST = 7;

class Grid {
  constructor(width, height, eightGrid = false) {
    this._validDirections = eightGrid ?
      [NORTH, SOUTH, EAST, WEST, NORTHEAST, NORTHWEST, SOUTHEAST, SOUTHWEST]
      : [NORTH, SOUTH, EAST, WEST];
    this._width = width;
    this._height = height;
    const size = width * height;
    this._data = new Array(size).fill(1);
  }

  get validDirections() {
    return this._validDirections;
  }

  set eightGrid(eightGrid) {
    this._validDirections = eightGrid ?
      [NORTH, SOUTH, EAST, WEST, NORTHEAST, NORTHWEST, SOUTHEAST, SOUTHWEST]
      : [NORTH, SOUTH, EAST, WEST];
  }

  isValid(x, y) {
    const idx = this.toIdx(x, y);
    return !(x < 0 || x >= this._width || y < 0 || y >= this._height) && this.getCost(idx) > 0;
  }

  getCost(idx) {
    if (idx < 0 || idx >= this._data.length) {
      throw new Exception(`(${idx}) out of bounds!`);
    }

    return this._data[idx];
  }

  setCost(idx, cost) {
    if (idx < 0 || idx >= this._data.length) {
      throw new Exception(`(${idx}) out of bounds!`);
    }

    this._data[idx] = cost;
  }

  toIdx(x, y) {
    return x + y * this._width;
  }

  fromIdx(idx) {
    return {
      x: idx % this._width,
      y: Math.floor(idx / this._width)
    };
  }

  static getDiff(direction) {
    switch (parseInt(direction, 10)) {
      case NORTH:
        return {dx: 0, dy: -1};
      case SOUTH:
        return {dx: 0, dy: 1};
      case EAST:
        return {dx: 1, dy: 0};
      case WEST:
        return {dx: -1, dy: 0};
      case NORTHEAST:
        return {dx: 1, dy: -1};
      case NORTHWEST:
        return {dx: -1, dy: -1};
      case SOUTHEAST:
        return {dx: 1, dy: 1};
      case SOUTHWEST:
        return {dx: -1, dy: 1};
    }
    throw new Exception(`Unknown direction (${direction})!`);
  }
}

export {
  NORTH,
  SOUTH,
  EAST,
  WEST,
  NORTHEAST,
  NORTHWEST,
  SOUTHEAST,
  SOUTHWEST
};

export default Grid;