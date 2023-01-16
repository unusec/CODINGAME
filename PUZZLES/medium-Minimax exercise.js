/**
 Goal
Difficulty: Medium
Topic: Minimax algorithm, Alpha–beta pruning, Zero-sum games, Negamax

We are given a 2-player, zero-sum game, where players alternate turns. The game always lasts D turns, and during its move, every player has to choose from B choices. Thus, D is the game tree depth, B its branching factor, and depending on players' choices, the game has B^D possible outcomes.

Assuming the game tree is small enough, we can check all outcomes and solve the game (i.e. compute the best strategy for every player) using the Minimax algorithm ( https://en.wikipedia.org/wiki/Minimax ).

To make our algorithm more efficient, we can skip some computations using the alpha-beta prunning technique ( https://en.wikipedia.org/wiki/Alpha-beta_pruning ).


Your task is to compute the minimum gain for the first player using Minimax with alpha-beta cutoffs. Moves should be examined in left-to-right order, as provided in the input. 


Input
Line 1: 2 space-separated integers:
D - depth of the game tree (assuming root is depth 0)
B - the branching factor

Line 2: B^D space-separated integers - the leafs of the game tree containing scores of the first (max) player.
Output
Two space-separated numbers:
- the best score that the root player is guaranteed to obtain
- the number of visited tree nodes


Input

3 2
-1 0 2 666 -3 -2 666 666

Output

0 11

 */

const [D, B] = readline().split(' ').map(rows => +rows);
const L = readline().split(" ").map(_ => +_);
let visitedNodes = 1;
let player = 1;

const createNode = (value, isLeaf) => {
  return { value, isLeaf };
};
const createNodes = (D, B, L) => {
  let nodes = Array(B ** D - 1).fill();
  let pos = 0;
  for (let i = 0; i < D; i++) {
    for (let j = 0; j < B ** i; j++) {
      nodes[pos] = createNode(null, false);
      pos++;
    }
  }
  while (L.length > 0) {
    nodes[pos] = createNode(L.shift(), true);
    pos++;
  }
  return nodes;
};

function NegamaxAB(nodeIndex, alpha, beta, player) {
  // get the node we are analizing
  const node = nodes[nodeIndex];

  // if our node is a leaf return its value based on curent player -/+
  if (node.isLeaf) {
    node.visited = true;
    return player * node.value;
  }

  // If not is not leaf then init comparing variable
  let bestScore = -Infinity;

  // For every branch of current node recursevly run NegamaxAB
  for (let i = 1; i <= B; i++) {
    visitedNodes++;
    const nextIndex = B * nodeIndex + i;
    // We negate the recursive function and its parameters, also inverse places for alpha-beta
    const score = -NegamaxAB(nextIndex, -beta, -alpha, -player);
    // Update bestScore and alpha
    bestScore = Math.max(bestScore, score);
    alpha = Math.max(alpha, score);
    // This is possible because we inverse the places of alpha and beta when we run NegamaxAB
    if (alpha >= beta) break;
  }
  return bestScore;
}

const nodes = createNodes(D, B, L);
const res = NegamaxAB(0, -Infinity, Infinity, player);
console.log(res, visitedNodes);