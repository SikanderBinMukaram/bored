const ROWS = 20;
const COLS = 20;
let startNode = null;
let endNode = null;
let isRunning = false;

// Initialize Grids
const gridBfs = document.getElementById('grid-bfs');
const gridDfs = document.getElementById('grid-dfs');
const gridAstar = document.getElementById('grid-astar');
const statusText = document.getElementById('status-text');
const btnRun = document.getElementById('btn-run');

function createGrid(gridElement, type) {
    gridElement.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.r = r;
            cell.dataset.c = c;
            cell.dataset.type = type; // 'bfs', 'dfs', or 'astar'
            
            // Add click listener only to one grid (BFS) to control all
            if (type === 'bfs') {
                cell.addEventListener('click', () => handleCellClick(r, c));
            }
            
            gridElement.appendChild(cell);
        }
    }
}

function init() {
    createGrid(gridBfs, 'bfs');
    createGrid(gridDfs, 'dfs');
    createGrid(gridAstar, 'astar');
}

function getCell(type, r, c) {
    let grid;
    if (type === 'bfs') grid = gridBfs;
    else if (type === 'dfs') grid = gridDfs;
    else grid = gridAstar;
    
    return grid.children[r * COLS + c];
}

function handleCellClick(r, c) {
    if (isRunning) return;

    if (!startNode) {
        startNode = { r, c };
        updateCellVisuals(r, c, 'start');
        statusText.textContent = "2. Click to set END (Red)";
    } else if (!endNode) {
        // Prevent start and end being same
        if (r === startNode.r && c === startNode.c) return;
        
        endNode = { r, c };
        updateCellVisuals(r, c, 'end');
        statusText.textContent = "3. Ready! Click 'Run Visualization'";
        btnRun.disabled = false;
    }
}

function updateCellVisuals(r, c, className) {
    // Update all grids
    getCell('bfs', r, c).classList.add(className);
    getCell('dfs', r, c).classList.add(className);
    getCell('astar', r, c).classList.add(className);
}

function resetGrids() {
    startNode = null;
    endNode = null;
    isRunning = false;
    btnRun.disabled = true;
    statusText.textContent = "1. Click to set START (Green)";
    
    // Clear classes
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
    });
    
    document.getElementById('stats-bfs').textContent = '0';
    document.getElementById('path-bfs').textContent = '0';
    document.getElementById('stats-dfs').textContent = '0';
    document.getElementById('path-dfs').textContent = '0';
    document.getElementById('stats-astar').textContent = '0';
    document.getElementById('path-astar').textContent = '0';
}

async function runAlgorithms() {
    if (!startNode || !endNode || isRunning) return;
    isRunning = true;
    btnRun.disabled = true;
    statusText.textContent = "Running...";

    // Run BFS
    const bfsData = solveBFS();
    await animateAlgorithm(bfsData, 'bfs');
    
    // Run DFS
    const dfsData = solveDFS();
    await animateAlgorithm(dfsData, 'dfs');

    // Run A*
    const astarData = solveAStar();
    await animateAlgorithm(astarData, 'astar');
    
    statusText.textContent = "Finished! Reset to try again.";
    isRunning = false;
}

function solveBFS() {
    const queue = [startNode];
    const visited = new Set();
    const visitedOrder = [];
    const parent = {};
    const startKey = `${startNode.r},${startNode.c}`;
    
    visited.add(startKey);
    parent[startKey] = null;
    
    let found = false;
    
    while (queue.length > 0) {
        const curr = queue.shift();
        visitedOrder.push(curr);
        
        if (curr.r === endNode.r && curr.c === endNode.c) {
            found = true;
            break;
        }
        
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dr, dc] of directions) {
            const nr = curr.r + dr;
            const nc = curr.c + dc;
            const key = `${nr},${nc}`;
            
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(key)) {
                visited.add(key);
                parent[key] = curr;
                queue.push({ r: nr, c: nc });
            }
        }
    }
    
    return { visitedOrder, parent, found };
}

function solveDFS() {
    const stack = [startNode];
    const visited = new Set();
    const visitedOrder = [];
    const parent = {};
    
    let found = false;
    
    while (stack.length > 0) {
        const curr = stack.pop();
        const key = `${curr.r},${curr.c}`;
        
        if (!visited.has(key)) {
            visited.add(key);
            visitedOrder.push(curr);
            
            if (curr.r === endNode.r && curr.c === endNode.c) {
                found = true;
                break;
            }
            
            // Reverse directions for standard DFS order (Right, Down, Left, Up)
            // because stack pops from end
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]].reverse();
            
            for (const [dr, dc] of directions) {
                const nr = curr.r + dr;
                const nc = curr.c + dc;
                const nKey = `${nr},${nc}`;
                
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited.has(nKey)) {
                    // Note: In strict DFS, we might visit a node multiple times if we don't mark it visited immediately on push
                    // But standard graph DFS marks on pop (processing).
                    // To track path, we need to set parent.
                    if (!parent[nKey]) parent[nKey] = curr; 
                    stack.push({ r: nr, c: nc });
                }
            }
        }
    }
    
    return { visitedOrder, parent, found };
}

function solveAStar() {
    // Priority Queue implemented as a simple array (sorted by fScore)
    const openSet = [];
    const visitedOrder = [];
    const parent = {};
    
    // gScore: Cost from start to node
    const gScore = {};
    // fScore: gScore + heuristic
    const fScore = {};
    
    const startKey = `${startNode.r},${startNode.c}`;
    gScore[startKey] = 0;
    fScore[startKey] = heuristic(startNode, endNode);
    
    openSet.push({ 
        r: startNode.r, 
        c: startNode.c, 
        f: fScore[startKey] 
    });
    
    const visited = new Set();
    let found = false;
    
    while (openSet.length > 0) {
        // Sort by fScore (lowest first) - simple priority queue simulation
        openSet.sort((a, b) => a.f - b.f);
        const curr = openSet.shift();
        const currKey = `${curr.r},${curr.c}`;
        
        visitedOrder.push(curr);
        visited.add(currKey);
        
        if (curr.r === endNode.r && curr.c === endNode.c) {
            found = true;
            break;
        }
        
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dr, dc] of directions) {
            const nr = curr.r + dr;
            const nc = curr.c + dc;
            const nKey = `${nr},${nc}`;
            
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                const tentativeGScore = gScore[currKey] + 1;
                
                if (tentativeGScore < (gScore[nKey] ?? Infinity)) {
                    parent[nKey] = curr;
                    gScore[nKey] = tentativeGScore;
                    fScore[nKey] = tentativeGScore + heuristic({r: nr, c: nc}, endNode);
                    
                    if (!openSet.some(n => n.r === nr && n.c === nc)) {
                        openSet.push({ r: nr, c: nc, f: fScore[nKey] });
                    }
                }
            }
        }
    }
    
    return { visitedOrder, parent, found };
}

function heuristic(a, b) {
    // Manhattan distance
    return Math.abs(a.r - b.r) + Math.abs(a.c - b.c);
}

function reconstructPath(parent, end) {
    const path = [];
    let curr = end;
    while (curr) {
        path.push(curr);
        const key = `${curr.r},${curr.c}`;
        curr = parent[key];
    }
    return path.reverse();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateAlgorithm(data, type) {
    const { visitedOrder, parent, found } = data;
    const statsSteps = document.getElementById(`stats-${type}`);
    const statsPath = document.getElementById(`path-${type}`);
    
    // Animate Visited
    for (let i = 0; i < visitedOrder.length; i++) {
        const node = visitedOrder[i];
        // Don't color start/end
        if ((node.r !== startNode.r || node.c !== startNode.c) && 
            (node.r !== endNode.r || node.c !== endNode.c)) {
            getCell(type, node.r, node.c).classList.add('visited');
        }
        statsSteps.textContent = i + 1;
        if (i % 2 === 0) await sleep(10); // Speed of animation
    }
    
    // Animate Path
    if (found) {
        const path = reconstructPath(parent, endNode);
        statsPath.textContent = path.length;
        for (const node of path) {
            if ((node.r !== startNode.r || node.c !== startNode.c) && 
                (node.r !== endNode.r || node.c !== endNode.c)) {
                getCell(type, node.r, node.c).classList.add('path');
                await sleep(20);
            }
        }
    } else {
        statsPath.textContent = "Not Found";
    }
}

init();