import {create, elements} from "./utils.js"
import {useState} from "../dependencies/preact-10.0.0-beta.1/hooks.module.js"
import {playLotteryQuantum, lotteries} from "./lottery-logic.js"
import Lottery from "./Lottery.js"
import NumberOfTickets from "./NumberOfTickets.js"
import Shortcuts from "./Shortcuts.js"
import Ticket from "./Ticket.js"

const {p, div, button, table} = elements

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
                `Get ${tickets.length === 0 ? "" : "More "} Quantum Tickets`
            )
        ),
        loading ? div({className: 'loader'}) : table(
            {className: 'Tickets'},
            tickets.map((ticket) => Ticket({ticket, balls}))
        ),
        tickets.length === 0 ? div(
            {className: 'why'},
            p(`This application generates random lottery tickets for various lotteries from a quantum random source.`),
            p(`Why?  Well, one beloved interpretation ('many worlds') of what quantum physics might actually mean,
               involves the entire universe as we know it dividing into multiple universes that try every possible
               outcome whenever a quantum random event occurs.`),
            p(`If this is a good way of understanding things, it means that when you pick your lottery numbers using
               quantum randomness, you are really trying every possible combination of lottery numbers in different
               universes.  You're guaranteed to win!  Although you're not guaranteed to wake up in the universe where
               you did, rather than one of the millions where you didn't....`),
            p(`This app uses random numbers generated in a lab at the Australian National University by measuring the
               fluctuations of the vacuum, and downloaded securely over the internet.`),
            p(`Think of it as a way of transferring money from the universes where you didn't win to the universe where
               you did. A quantum inter-universal money transfer order!`)
        ) : ""
    )
})

export default App