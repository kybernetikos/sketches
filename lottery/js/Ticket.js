import {create, elements} from "./utils.js"
import {useState} from "../dependencies/preact-10.0.0-beta.1/hooks.module.js"

const {tr, td} = elements

function getGroup(index, balls) {
    for (let i = 0; i < balls.length; ++i) {
        if (index < balls[i].number) {
            return "group-"+i
        } else {
            index -= balls[i].number
        }
    }
}

const Ticket = create(({ticket, balls}) => {
    const [toggled, setToggled] = useState(false)

    return tr({
            className: 'Ticket ' + (toggled ? 'toggled' : ''),
            onclick: () => setToggled(!toggled)
        },
        ticket.map((value, index) => td({className: 'number ' + getGroup(index, balls)}, " ", value, " "))
    )
})

export default Ticket