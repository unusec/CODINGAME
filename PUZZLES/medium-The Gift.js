const N = parseInt(readline()); // number of participants
let C = parseInt(readline()); // gift price
const ps = Array(N).fill() //participants budgets
    .map(_=>{
        return {budget: Number(readline())}
    })
    .sort((a,b)=>a.budget-b.budget)

const setContribution = (one,index) => {
    const remainingPersons = N-index
    let medianPrice = Math.floor(C/remainingPersons)
    if (index == N-1) {
        one.contribution = C
    } else if (one.budget>=medianPrice) {
        one.contribution=medianPrice
        C -= one.contribution
    } else {
        one.contribution = one.budget
        C -= one.contribution
    }
}

const totalBudget = ps.reduce((a,b)=>a+b.budget,0)

if (totalBudget<C) {
    console.log('IMPOSSIBLE');
} else {
    ps.forEach((p,index)=>{
        setContribution(p, index)
        console.log(p.contribution)
    })
}