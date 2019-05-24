import {create, elements} from "./utils.js"
import {useState} from "./preact-10.0.0-beta.1/hooks.module.js"
import {playLotteryQuantum, lotteries} from "./lottery-logic.js"
import Lottery from "./Lottery.js"
import NumberOfTickets from "./NumberOfTickets.js"
import Shortcuts from "./Shortcuts.js"
import Ticket from "./Ticket.js"

const {div, button, table} = elements

const App = create(() => {
    let [number, setNumber] = useState(4)
    let [balls, setBalls] = useState(lotteries.euromillions.balls)
    const [tickets, setTickets] = useState([])
    const [custom, setCustom] = useState(false)
    const [loading, setLoading] = useState(false)

    const clearTickets = (fn) => (...args) => {
        setTickets([])
        return fn(...args)
    }

    setNumber = clearTickets(setNumber)
    setBalls = clearTickets(setBalls)

    return div(
        {className: 'App'},
        div(
            {className: 'Entry'},
            "Lottery ", Shortcuts({setBalls, lotteries, setCustom, disabled: loading}),
            Lottery({balls, setBalls, custom, disabled: loading}),
            NumberOfTickets({number, setNumber, disabled: loading}),
            button({
                    onclick: () => {
                        setLoading(true)
                        playLotteryQuantum({balls}, number)
                            .then((tickets) => {
                                setTickets(tickets)
                                setLoading(false)
                            })
                    },
                    disabled: loading
                },
                "Get " + (tickets.length === 0 ? "" : "More ") + "Quantum Tickets"
            )
        ),
        loading ? div({className: 'loader'}) : table(
            {className: 'Tickets'},
            tickets.map((ticket) => Ticket({ticket, balls}))
        )
    )
})

export default App