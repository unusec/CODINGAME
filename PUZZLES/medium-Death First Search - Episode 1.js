const [N,L,E] = readline().split(' ').map(x=>Number(x));
const grid = Array(N).fill().map(_=>Array(N).fill(0))

for (let i = 0; i < L; i++) {
    const [x,y] = readline().split(' ').map(x=>Number(x));
    grid[x][y] = 1
    grid[y][x] = 1
}

let gws = []
for (let i = 0; i < E; i++) {
    gw = parseInt(readline()); // the index of a gateway node
    gws.push(gw)
    grid[gw][gw] = 3
}

// game loop
while (true) {
    const v = parseInt(readline()); // The index of the node on which the Bobnet agent is positioned this turn
    grid[v][v] = 2
    let noCut=true

    gws.forEach(gw=>{
        if (grid[v][gw] == 1) {
            console.log(`${v} ${gw}`)
            noCut=false
        }
    })

    if (noCut) {
        for (let j=0; j<grid[0].length; j++) {
            if (grid[v][j] == 1) {
                console.log(`${v} ${j}`)
                break;
            }
        }
    }
}
