import {create, elements} from "./utils.js"

const {div, input} = elements

const NumberOfTickets = create(({number, setNumber, disabled}) => div(
    {className: 'NumberOfTickets'},
    "How many tickets? ",
    input({
        onchange: (e) => setNumber(e.target.value),
        value: number,
        type: 'number',
        min: 1,
        disabled
    })
))

export default NumberOfTickets