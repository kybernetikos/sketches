const display = Vec.from(1000, 500)
const origin = Vec.from(0, 0)

// class SubspaceRBush extends rbush {
//     toBBox([x, y]) { return {minX: x, minY: y, maxX: x, maxY: y}; }
//     compareMinX(a, b) { return a.subspace.x - b.subspace.x; }
//     compareMinY(a, b) { return a.subspace.y - b.subspace.y; }
// }
//
// const subspace = new SubspaceRBush()

const space = []
const granularity = 50

for (let x = -1; x <= Math.floor(display.x/granularity) + 2; x++) {
    space[x] = []
    for (let y = -1; y <= Math.floor(display.y/granularity) + 2; y++) {
        const [dx, dy] = [x*granularity, y*granularity]
        space[x][y] = {cell: {x, y}, subspace: {x:dx, y:dy}, space: {x:dx, y:dy}}
    }
}

function getPoint(x, y) {
    const xPart = space[Math.floor(x / granularity)]
    if (xPart) {
        return xPart[Math.floor(y / granularity)]
    }
}

function areaOfTri(p1, p2, p3) {
    const a = Vec.distSq(p1, p2)
    const b = Vec.distSq(p2, p3)
    const c = Vec.distSq(p3, p1)

    const sum = a + b + c
    const sumSq = a*a + b*b + c*c

    return 0.25 * Math.sqrt(sum*sum - 2 * sumSq)
}

function toBarycentric(p, t1, t2, t3) {
    const triArea = areaOfTri(t1, t2, t3)
    const u = areaOfTri(p, t2, t3) / triArea
    const v = areaOfTri(t1, p, t3) / triArea
    const w = areaOfTri(t1, t2, p) / triArea
    return [u, v, w]
}

function fromBarycentric(u, v, w, t1, t2, t3) {
    const result = Vec.scale(t1, u)
    Vec.add(result, Vec.scale(t2, v), result)
    Vec.add(result, Vec.scale(t3, w), result)
    return result
}

function toSubspace(x, y) {
    const pt = Vec.from(x, y)

    const top = getPoint(x, y)
    const right = getPoint(x + granularity, y)
    const down = getPoint(x, y + granularity)
    const opposite = getPoint(x + granularity, y + granularity)

    const distRight = right ? Vec.distSq(pt, right.space) : Number.MAX_VALUE
    const distDown = down ? Vec.distSq(pt, down.space) : Number.MAX_VALUE

    const other = distRight > distDown ? down : right
    const [u, v, w] = toBarycentric(pt, top.space, opposite.space, other.space)

    const transformed = fromBarycentric(u, v, w, top.subspace, opposite.subspace, other.subspace)

    return transformed
}

function movePoint(pt, dsx, dsy) {
//    subspace.remove(pt)
    pt.subspace.x = pt.subspace.x + dsx
    pt.subspace.y = pt.subspace.y + dsy
//    subspace.insert(pt)
}

function warpSpaceRandomly(warpFactor) {
    for (let x = 0; x < space.length; ++x) {
        for (let y = 0; y < space[x].length; y++) {
            movePoint(space[x][y], Math.random() * warpFactor, Math.random() * warpFactor)
        }
    }
}

warpSpaceRandomly(30)

function renderCell({subspace:{x, y}, cell:{x:cellX, y:cellY}}, g, interpolation) {
    const neighbours = [
        cellX > 0 ? space[cellX - 1][cellY] : undefined,
        cellX < space.length - 1 ? space[cellX + 1][cellY] : undefined,
        space[cellX][cellY - 1],
        space[cellX][cellY + 1]
    ]
    g.strokeStyle = 'rgb(200, 200, 200)'
    g.beginPath()
    for (pt of neighbours) {
        if (pt) {
            g.moveTo(x, y)
            g.lineTo(pt.subspace.x, pt.subspace.y)
        }
    }
    g.stroke()
}

const drawSubspace = {
    render(g, interpolation) {
        // find just the cells in view
        for (let x = 0; x < space.length; ++x) {
            for (let y = 0; y < space[x].length; ++y) {
                renderCell(space[x][y], g, interpolation)
            }
        }
    }
}

function applyForce(obj, force) {
    // a = f / m
    Vec.add(obj.velocity, Vec.divide(force, obj.mass), obj.velocity)
}

function renderCircle(obj, g, interpolation) {
    g.fillStyle = obj.colour
    const position = toSubspace(obj.position.x, obj.position.y)

    g.beginPath();
    g.arc(position.x + obj.velocity.x * interpolation, position.y + obj.velocity.y * interpolation, obj.radius, 0, 2 * Math.PI);
    g.fill();
}

function reflect(obj, axis) {
    obj.velocity[axis] = -obj.velocity[axis]
}

function valueIn(value, min, max) {
    return value >= min && value <= max
}

function valueOut(value, min, max) {
    return value < min || value > max
}

function constrainedUpdate(obj) {
    if (valueOut(obj.position.x, 0, display.x)) {
        reflect(obj, 'x')
    }
    if (valueOut(obj.position.y, 0, display.y)) {
        reflect(obj, 'y')
    }
    Vec.clamp(obj.position, origin, display, obj.position)
    Vec.clamp(obj.velocity, Vec.from(-10, -10), Vec.from(10, 10), obj.velocity)
    Vec.add(obj.position, obj.velocity, obj.position)
}

function handlePlayerInput(obj, input) {
    if (input['player-up']) {
        obj.velocity.y -= 1
    } else if (input['player-down']) {
        obj.velocity.y += 1
    } else if (input['player-left']) {
        obj.velocity.x -= 1
    } else if (input['player-right']) {
        obj.velocity.x += 1
    }
}

const game = new Game(document.getElementById('display'));

game.mapKey('up', 'player-up')
game.mapKey('down', 'player-down')
game.mapKey('left', 'player-left')
game.mapKey('right', 'player-right')
game.mapKey('ctrl', 'player-fire')

const player = {
    position: {x: 100, y: 100},
    velocity: {x: 5, y: 0},
    radius: 10, mass: 50,
    colour: 'blue',
    render(g, interpolation) { renderCircle(this, g, interpolation)},
    update(input) {
        handlePlayerInput(this, input)
        constrainedUpdate(this)
    }
}

const sun = {
    position: {x: 200, y: 200},
    velocity: {x: 1, y: 1},
    mass: 300, radius: 50,
    colour: 'red',
    render(g, interpolation) { renderCircle(this, g, interpolation)},
    update(input) { constrainedUpdate(this) }
}

const gravity = 9

const simpleGravity = {
    beforeTick() {
        const between = Vec.sub(sun.position, player.position)
        const sqDist = Vec.sqMagnitude(between)
        const dist = Math.max(Math.sqrt(sqDist), sun.radius + player.radius)
        const direction = Vec.divide(between, dist)
        const minApproach = sun.radius + player.radius + 2
        const force = gravity * sun.mass * player.mass / sqDist

        if (dist <= minApproach) {
            // Collision
            Vec.reflect(player.velocity, direction, player.velocity)
            Vec.scale(direction, minApproach, direction)
            Vec.sub(sun.position, direction, player.position)
        } else if (force > 0.5) {
            // Apply gravity
            Vec.scale(direction, force, direction)
            applyForce(player, direction)
        }
    }
}

game.add(drawSubspace)
game.add(player)
game.add(sun)
game.add(simpleGravity)

game.run()