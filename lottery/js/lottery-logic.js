const lotteries = {
    euromillions: {
        balls: [
            {number: 5, from:1, to: 50},
            {number: 2, from:1, to: 12}
        ]
    },
    lotto: {
        balls: [
            {number: 6, from:1, to: 59}
        ]
    },
    megamillions: {
        balls: [
            {number: 5, from: 1, to: 70},
            {number: 1, from: 1, to: 25}
        ]
    },
    custom: {
        balls: [
            {number: 5, from:1, to: 50},
            {number: 2, from:1, to: 12}
        ]
    }
}

async function asyncReduce(collection, fn, initial) {
    if (initial === undefined) {
        initial = collection.shift()
    }
    let result = initial
    for (let item of collection) {
        result = await fn(result, item)
    }
    return result
}

async function asyncMap(collection, fn) {
    const result = []
    for (let item of collection) {
        result.push(await fn(item))
    }
    return result;
}

const base = 'https://qrng.anu.edu.au/API/jsonI.php?type=uint8&length='

async function requestRandomHexOctets(num) {
    const url = base + String(num)
    console.debug('fetching', num, 'random numbers from', url);
    const controller = new AbortController();
    const signal = controller.signal;
    setTimeout(() => controller.abort(), 4000);

    return fetch(url, {signal})
        .then((response) => response.json())
        .then((body) => body.data.map((a) => parseInt(a, 16)))
        .catch( (err) => {
            console.error(err)
            alert(`Unable to get the quantum random numbers.\nPerhaps https://qrng.anu.edu.au is down.\nPlease try again another time.`)
        })
}

function makeRandomSource() {
    const len = 100;
    let buffer = []

    const drawByte = async () => {
        if (buffer.length === 0) {
            buffer = await requestRandomHexOctets(len)
        }
        return buffer.pop()
    }

    return async (from, to) => {
        const width = to - from + 1 // inclusive
        if (width > 256) {
            throw new Error("We're just using bytes here, one at a time. Maximum width of range is 256.")
        }
        const max = Math.floor(256/width) * width
        let value = max
        while (value >= max) {
            value = await drawByte()
        }
        return (value % width) + from
    }
}

// select n integers from the range [from, to] (inclusive at both sides),
// taking random values from the randomSource as needed
async function randomNumbersWithoutReplacement(n, from, to, randomSource) {
    const possibilities = Array.from({length: to - from + 1}, (_, i) => i + from);
    const result = []

    for (let i = 0; i < n; ++i) {
        const index = await randomSource(0, possibilities.length - 1)
        result.push(...possibilities.splice(index, 1))
    }

    // sorted for beauty
    result.sort((a, b) => a - b)
    return result
}

async function randomResult(lottery, randomSource) {
    return asyncReduce(lottery.balls, async (result, {number, from, to}) => [...result, ...(await randomNumbersWithoutReplacement(Number(number), Number(from), Number(to), randomSource))], [])
}

function tickets(lottery, number, randomSource) {
    return asyncMap(Array.from({length:number}), async () => randomResult(lottery, randomSource))
}

const globalRnd = makeRandomSource();

function playLotteryQuantum(lottery, number, rnd = globalRnd) {
    return tickets(lottery, number, rnd);
}

export {playLotteryQuantum, lotteries}