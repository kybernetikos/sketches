import {create, elements} from "./utils.js"

const {div, input} = elements

const BallGroup = create(({disabled, group: {number, from, to}, setGroup, index}) => div(
    {className: 'BallGroup'},
    "Group ", index + 1, " has ", input({
        onchange: (e) => setGroup({number: e.target.value, from, to}),
        value: number,
        type: 'number',
        min: 1,
        disabled
    }), " balls, from ", input({
        onchange: (e) => setGroup({number, from: e.target.value, to}),
        value: from,
        type: 'number',
        min: 0,
        max: to - 1,
        disabled
    }),
    " to ", input({
        onchange: (e) => setGroup({number, from, to: e.target.value}),
        value: to,
        type: 'number',
        min: Number(from) + 1,
        disabled
    })
))

export default BallGroup