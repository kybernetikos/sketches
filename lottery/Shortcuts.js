import {create, elements} from "./utils.js"

const {select, option} = elements

const Shortcuts = create(({disabled, setBalls, lotteries, setCustom}) => {
    return select({
            className: 'Shortcuts',
            onchange: (e) => {
                const lotteryName = e.target.value
                setCustom(lotteryName === 'custom')
                setBalls(lotteries[lotteryName].balls)
            },
            disabled
        },
        Object.keys(lotteries).map((lotteryName) =>
            option({value: lotteryName}, lotteryName)
        )
    )
})
export default Shortcuts