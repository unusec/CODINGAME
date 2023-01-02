var inputs = readline().split(' ');
const R = parseInt(inputs[0]); // number of rows.
const C = parseInt(inputs[1]); // number of columns.
const A = parseInt(inputs[2]); // number of rounds between the time the alarm countdown is activated and the time the alarm goes off.
const visited = Array(R).fill().map(_ => Array(C).fill(false))
let initialStart = {}
let controlRoom = undefined
let roomNotReached = true
let returnPath = []
let q = []
// directions
const dx = [1, 0, -1, 0]
const dy = [0, 1, 0, -1]

// const toQ = (x, y, colNo) => x * colNo + y
// const fromQ = (q, colNo) => [Math.abs(q / colNo), q % colNo]

const setCourse = (from, to) => {
    if (to.x < from.x) {
        console.log("UP")
    } else if (to.x > from.x) {
        console.log("DOWN")
    }
    if (to.y < from.y) {
        console.log("LEFT")
    } else if (to.y > from.y) {
        console.log("RIGHT")
    }
}

// to get fastest path when switching DFS nodes
function aStar(start, end, fog) {
    let openSet = []; //array containing unevaluated grid points
    let closedSet = []; //array containing completely evaluated grid points
    let path = [];
    const heuristic = (start, end) =>
        Math.sqrt(Math.pow(Math.abs(end.x - start.x), 2) + Math.pow(Math.abs(end.y - start.y), 2))
    openSet.push(start);

    //A star search implementation
    while (openSet.length > 0) {
        //assumption lowest index is the first one to begin with
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];
        if (current.x === end.x && current.y === end.y) {
            let temp = current;
            path.push(temp);
            while (temp.parent) {
                path.push(temp.parent);
                temp = temp.parent;
            }
            // return the traced path
            return path.reverse();
        }

        //remove current from openSet
        openSet.splice(lowestIndex, 1);
        //add current to closedSet
        closedSet.push(current);

        let neighbours = current.getNeighbours(fog);
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];

            if (!closedSet.includes(neighbour)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(neighbour)) {
                    openSet.push(neighbour);
                } else if (possibleG < neighbour.g) {
                    continue;
                }

                neighbour.g = possibleG;
                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = current;
            }
        }
    }
    //no solution by default
    return [];
}

// game loop
while (true) {
    var inputs = readline().split(' ');
    const fromX = parseInt(inputs[0]); // row where Rick is located.
    const fromY = parseInt(inputs[1]); // column where Rick is located.
    visited[fromX][fromY] = true
    // initialize the grid and read cells
    const grid = Array(R).fill().map(_ => Array(C).fill())
    const debugGrid = Array(R).fill().map(_ => Array(C).fill())
    for (let i = 0; i < R; i++) {
        readline().split("").forEach((c, index) => {
            const x = i,
                y = index,
                canTravel = c === "." ? true : false,
                isFog = c === "?" ? true : false,
                isStart = c === "T" ? true : false,
                isRoom = c === "C" ? true : false,
                f = 0, //total cost of A* search function
                g = 0, //cost function from start to the current grid point
                h = 0, //heuristic estimated cost function from current grid point to the goal
                getNeighbours = (fog) => { // get neighbours at a given pos for map discovry or room acces
                    const neighbours = []
                    for (let i = 0; i < 4; i++) {
                        const nx = x + dx[i];
                        const ny = y + dy[i];
                        if (
                            nx >= 0 &&
                            nx < grid.length &&
                            ny >= 0 &&
                            ny < grid[x].length
                        ) {
                            if (fog) {
                                (grid[nx][ny].canTravel || grid[nx][ny].isStart) ? neighbours.push(grid[nx][ny]) : ""
                            } else {
                                (grid[nx][ny].canTravel || grid[nx][ny].isRoom || grid[nx][ny].isStart) ? neighbours.push(grid[nx][ny]) : ""
                                grid[nx][ny].isRoom ? roomNotReached = false : "";
                            }
                            
                        }
                    }
                    return neighbours;
                };          
            c === "C" ? controlRoom = { x: i, y: index } : " "
            grid[i][index] = { x, y, canTravel, isStart, isRoom, f, g, h, getNeighbours }
        })
    }
    grid[fromX][fromY].isStart ? initialStart = grid[fromX][fromY] : ""
    if (roomNotReached && returnPath.length < 2) {
        // reveal the map by getting the neighbours in fog=true(treats room as wall)
        grid[fromX][fromY].getNeighbours(true).forEach(neighbour => {
            const { x, y } = neighbour
            if (!visited[x][y]) {
                q.push(neighbour)
                visited[x][y] = true
            }
        })
        // DFS to explore map and save gas
        if (q.length > 0) {  
            let dest = q.pop()
            const dist = Math.abs(dest.x - fromX) + Math.abs(dest.y - fromY)
            if (dist > 1) {
                // we need to backtrack to another node to explore all map
                returnPath = aStar(grid[fromX][fromY], dest, true)
                from = returnPath.shift()
                setCourse(from, returnPath[0])
            } else {
                setCourse(grid[fromX][fromY], dest)
            }
        } else {
            // all map is explored go to room, get path to Room
            returnPath = aStar(grid[fromX][fromY], controlRoom, false)           
            from = returnPath.shift()
            setCourse(from, returnPath[0])
        }
    } else if (returnPath.length > 1) {
        // continue moves from A* paths to reach nodes/room/start
        from = returnPath.shift()
        setCourse(from, returnPath[0])
    } else {
        // Room reached get path to initialStart
        returnPath = aStar(grid[fromX][fromY], initialStart, false)
        from = returnPath.shift()
        setCourse(from, returnPath[0])
    }

}