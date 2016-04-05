import PriorityQueue from '../PriorityQueue.js';
import Grid from '../Grid.js';

const BestFirstSearch = (start, goal, grid, heuristic) => {
    const open = new PriorityQueue();
    const closed = new Set();
    const startCoord = grid.fromIdx(start);
    const goalCoord = grid.fromIdx(goal);
    const info = {};

    open.enqueue({
        priority: 0,
        data: start
    });

    info[start] = {
        parent: undefined,
        gScore: 0
    };

    while(!open.isEmpty()) {
        const entry = open.dequeue();
        const idx = entry.data;
        if(idx === goal) {
            const path = [goal];
            let parent = info[goal].parent;
            while(parent) {
                path.unshift(parent);
                parent = info[parent].parent;
            }
            return {
                visited: new Set(Object.keys(info).map((k) => parseInt(k, 10))),
                path
            }
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
            if(closed.has(newIdx)) {
                continue;
            }

            // Downhill is "free"
            const diffCost = Math.max(1, (grid.getCost(newIdx) - grid.getCost(idx)));
            const gScoreTentative = info[idx].gScore + diffCost;
            if (!info.hasOwnProperty(newIdx)) {
                info[newIdx] = {
                    parent: idx,
                    gScore:  gScoreTentative
                }
                open.enqueue({
                    data: newIdx,
                    priority: gScoreTentative
                });
            } else {
                if(gScoreTentative >= info[newIdx].gScore) {
                    continue;
                }
                info[newIdx].parent = idx;
                info[newIdx].gScore = gScoreTentative;
                open.remove(newIdx);
                open.enqueue({
                    data: newIdx,
                    priority: gScoreTentative
                });
            }
        }
    }
    return {
        visited: new Set(Object.keys(info).map((k) => parseInt(k, 10))),
        path: []
    }
};

export default BestFirstSearch;