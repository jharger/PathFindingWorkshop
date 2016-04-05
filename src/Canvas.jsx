import _ from 'lodash';

import React from 'react';

import chroma from 'chroma-js';
import { Noise } from 'noisejs';

import classes from './Canvas.scss';

import Grid from './Grid.js';
import BreadthFirstSearch from './algorithms/BreadthFirstSearch.js';
import DepthFirstSearch from './algorithms/DepthFirstSearch.js';
import BestFirstSearch from './algorithms/BestFirstSearch.js';
import Dijkstra from './algorithms/Dijkstra.js';
import AStar from './algorithms/AStar.js';

import {
  manhattan,
  euclidean,
  chebyshev,
} from './heuristics.js';

const algorithms = [
  {
    name: 'Breadth First Search (NO Cost)',
    alg: BreadthFirstSearch
  },
  {
    name: 'Depth First Search (NO Cost)',
    alg: DepthFirstSearch
  },
  {
    name: 'Best First Search',
    alg: BestFirstSearch
  },
  {
    name: 'Dijkstra\'s Algorithm',
    alg: Dijkstra
  },
  {
    name: 'A*',
    alg: AStar
  }
];

const heuristics = [
  {
    name: 'Manhattan (Taxi Cab)',
    func: manhattan
  },
  {
    name: 'Euclidean',
    func: euclidean
  },
  {
    name: 'Chebyshev (Maximum)',
    func: chebyshev
  }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Canvas extends React.Component {
  constructor(props) {
    super();

    this._start = 0;
    this._goal = 5;//35 + 22 * 40;
    this._currentAlgorithm = algorithms[0];
    this._currentHeuristic = heuristics[0];

    this._setCanvasRef = this._setCanvasRef.bind(this);
    this._handleSelectAlgorithm = this._handleSelectAlgorithm.bind(this);
    this._handleSelectHeuristic = this._handleSelectHeuristic.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._clearGrid = this._clearGrid.bind(this);
    this._handleRandom = this._handleRandom.bind(this);
    this._handlePerlin = this._handlePerlin.bind(this);
    this._handleWalls = this._handleWalls.bind(this);
    this._randomWalls = this._randomWalls.bind(this);
    this._handleDiagonals = this._handleDiagonals.bind(this);
  }

  _setCanvasRef(ref) {
    this._canvas = ref;
  }

  _handleSelectAlgorithm(ev) {
    const idx = _.findIndex(algorithms, { name: ev.target.value });
    this._currentAlgorithm = algorithms[idx];
    this._drawGrid();
  }

  _handleSelectHeuristic(ev) {
    const idx = _.findIndex(heuristics, { name: ev.target.value });
    this._currentHeuristic = heuristics[idx];
    this._drawGrid();
  }

  _handleClick(ev) {
    const rect = this._canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const gx = Math.floor(x / 16);
    const gy = Math.floor(y / 16);
    const idx = this._grid.toIdx(gx, gy);
    if(ev.ctrlKey) {
      const oldCost = this._grid.getCost(idx);
      if(oldCost < 1) {
        this._grid.setCost(idx, 1);
      } else if(oldCost < 32) {
        this._grid.setCost(idx, oldCost + 1);
      }
    } else if(ev.altKey) {
      const oldCost = this._grid.getCost(idx);
      if(oldCost > 1) {
        this._grid.setCost(idx, oldCost - 1);
      } else {
        this._grid.setCost(idx, -1);
      }
    } else if(ev.shiftKey) {
      this._start = idx;
    } else {
      this._goal = idx;
    }
    this._drawGrid();
  }

  _handlePerlin() {
    const noise = new Noise(Math.random());
    for(let y = 0; y < 30; y ++) {
      for (let x = 0; x < 40; x++) {
        const newCost = Math.floor(Math.max(1, Math.min(32, noise.perlin2(x / 40.0, y / 40.0) * 33)));
        const idx = this._grid.toIdx(x, y);
        this._grid.setCost(idx, newCost);
      }
    }
    this._drawGrid();
  }

  _handleRandom() {
    for(let y = 0; y < 30; y ++) {
      for (let x = 0; x < 40; x++) {
        const newCost = Math.floor(Math.max(1, Math.min(32, Math.random() * 33)));
        const idx = this._grid.toIdx(x, y);
        this._grid.setCost(idx, newCost);
      }
    }
    this._drawGrid();
  }

  _clearGrid() {
    for(let y = 0; y < 30; y ++) {
      for (let x = 0; x < 40; x++) {
        const idx = this._grid.toIdx(x, y);
        this._grid.setCost(idx, 1);
      }
    }
    this._drawGrid();
  }

  _randomWalls() {
    for(let i = 0; i < 25; i ++) {
      if(Math.random() > 0.5) {
        // Vertical
        let x = randomInt(2, 38);
        let start = randomInt(2, 18);
        let end = start + randomInt(3, 10);
        for(let y = start; y < end; y ++) {
          const idx = this._grid.toIdx(x, y);
          this._grid.setCost(idx, -1);
        }
      } else {
        // Horizontal
        let y = randomInt(2, 28);
        let start = randomInt(2, 28);
        let end = start + randomInt(5, 10);
        for(let x = start; x < end; x ++) {
          const idx = this._grid.toIdx(x, y);
          this._grid.setCost(idx, -1);
        }
      }
    }
    this._drawGrid();
  }

  _handleWalls() {
    for (let x = 5; x < 40; x += 5) {
      const start = (x % 10 == 0) ? 5 : 0;
      const end = (x % 10 == 0) ? 30 : 25;
      for(let y = start; y < end; y ++) {
        const idx = this._grid.toIdx(x, y);
        this._grid.setCost(idx, -1);
      }
    }
    this._drawGrid();
  }

  _handleDiagonals(ev) {
    this._grid.eightGrid = ev.target.checked;
    this._drawGrid();
  }

  render() {
    return <div className={classes.canvasContainer}>
      <canvas width="640"
              height="480"
              ref={this._setCanvasRef}
              className={classes.canvasItself}
              onMouseUp={this._handleClick}
      />
      <div className={classes.controlContainer}>
        <label htmlFor={this._algId}>Algorithm: </label>
        <select id={this._algId} onChange={this._handleSelectAlgorithm} className={classes.algSelect}>
          {algorithms.map((item, i) => {
            return (
              <option key={i}>{item.name}</option>
            );
          })}
        </select>
        <label htmlFor={this._heurId}>Heuristic: </label>
        <select id={this._heurId} onChange={this._handleSelectHeuristic} className={classes.algSelect}>
          {heuristics.map((item, i) => {
            return (
              <option key={i}>{item.name}</option>
            );
          })}
        </select>
        <label htmlFor={this._diagId}>Diagonal</label>
        <input id={this._diagId} type="checkbox" onChange={this._handleDiagonals} />
        <button onClick={this._handleRandom}>Randomize</button>
        <button onClick={this._handlePerlin}>Randomize (Perlin)</button>
        <button onClick={this._handleWalls}>Add Walls</button>
        <button onClick={this._randomWalls}>Add Random Walls</button>
        <button onClick={this._clearGrid}>Clear Grid</button>
      </div>
    </div>;
  }

  componentWillMount() {
    this._grid = new Grid(40, 30);
    this._algId = _.uniqueId("alg_");
    this._heurId = _.uniqueId("heur_");
    this._diagId = _.uniqueId("diag_");
  }

  componentDidMount() {
    this._drawGrid();
  }

  _drawGrid() {
    const result = this._currentAlgorithm.alg(this._start, this._goal, this._grid, this._currentHeuristic.func);
    const path = new Set();
    let totalCost = 0;
    if(result.path) {
      let prev = -1;
      for(let p in result.path) {
        const idx = parseInt(result.path[p], 10);
        if(prev >= 0) {
          const oldCost = this._grid.getCost(prev);
          const newCost = this._grid.getCost(idx);
          totalCost += Math.max(1, newCost - oldCost);
        }
        path.add(idx);
        prev = idx;
      }
    } else {
      console.log("Can't find path!");
    }

    const scale = chroma.scale(['#444444', '#dddddd']).mode('lab').domain([1, 32]);

    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, 640, 480);
    ctx.strokeStyle = "black";
    ctx.font = "12px arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for(let y = 0; y < 30; y ++) {
      for(let x = 0; x < 40; x ++) {
        const idx = this._grid.toIdx(x, y);
        const cost = this._grid.getCost(idx);
        if(cost < 1) {
          ctx.fillStyle = "black";
        } else {
          ctx.fillStyle = scale(cost).toString();
        }
        const dx = x * 16, dy = y * 16;
        ctx.fillRect(dx, dy, dx + 16, dy + 16);

        if(idx == this._start) {
          ctx.fillStyle = "rgba(0, 124, 255, 0.22)";
          ctx.fillRect(dx, dy, dx + 16, dy + 16);
        } else if(idx == this._goal) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.22)";
          ctx.fillRect(dx, dy, dx + 16, dy + 16);
        } else if(path.has(idx)) {
          ctx.fillStyle = "rgba(255, 0, 255, 0.22)";
          ctx.fillRect(dx, dy, dx + 16, dy + 16);
        } else if(result && result.visited.has(idx)) {
          ctx.fillStyle = "rgba(255, 255, 0, 0.22)";
          ctx.fillRect(dx, dy, dx + 16, dy + 16);
        }
        ctx.strokeRect(dx, dy, dx + 16, dy + 16);
        if(cost > 0) {
          ctx.fillStyle = "#222222";
          ctx.fillText(cost, dx + 8, dy + 8);
        }
      }
    }
    const gp = this._grid.fromIdx(this._goal);
    if(totalCost > 0) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.textAlign = "left";
      ctx.font = "bold 18px arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText("Cost: " + totalCost, (gp.x * 16) + 20, (gp.y * 16) + 16);
      ctx.shadowColor = null;
      ctx.shadowBlur = null;
      ctx.shadowOffsetX = null;
      ctx.shadowOffsetY = null;
    }

  }
}

export default Canvas;