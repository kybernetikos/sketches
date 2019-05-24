import {create, elements} from "./utils.js"
import BallGroup from "./BallGroup.js";

const {div, input} = elements

function updated(oldBalls, index, newBall) {
    const result = oldBalls.slice(0)
    result[index] = newBall
    return result
}

const Lottery = create(({balls, setBalls, custom, disabled}) => div(
    {className: 'Lottery', style: {display: custom ? '' : 'none'}},
    "Groups of Balls", input({
        onchange: (e) => setBalls(balls.slice(0, e.target.value).concat(Array.from({length: e.target.value - balls.length}, () => ({number: 1, from:1, to: 6})))),
        value: balls.length,
        type: 'number',
        min: 1,
        disabled
    }),
    balls.map((ballGroup, index) => BallGroup({disabled, group: ballGroup, setGroup: (defn) => setBalls(updated(balls, index, defn)), index}))
))

export default Lottery
