import { Queue } from 'es-collections';
import Grid from '../Grid.js';

const BreadthFirstSearch = (start, goal, grid) => {
    const open = new Queue();
    const closed = new Set();
    const info = {};
    open.enqueue(start);

    info[start] = { parent: undefined };

    let max = 0;

    while(open.size > 0) {
        max ++;
        if(max > 10000) {
            return;
        }
        const idx = open.dequeue();
        if(idx === goal) {
            const path = [goal];
            let parent = info[goal].parent;
            while(parent) {
                path.unshift(parent);
                parent = info[parent].parent;
            }
            return {
                visited: closed,
                path
            }
        }

        if (closed.has(idx)) {
            continue;
        }
        
        closed.add(idx);

        const {x, y} = grid.fromIdx(idx);
        const directions = grid.validDirections;
        for(let dir in directions) {
            const {dx, dy} = Grid.getDiff(dir);
            const nx = x + dx, ny = y + dy;
            if(!grid.isValid(nx, ny)) {
                continue;
            }

            const newIdx = grid.toIdx(nx, ny);
            if (closed.has(newIdx)) {
                continue;
            }

            info[newIdx] = { parent: idx };
            open.enqueue(newIdx);
        }
    }
    return {
        visited: closed,
        path: []
    }
};

export default BreadthFirstSearch;