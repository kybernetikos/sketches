const Vec = {
    from(x, y, into = {x:0, y:0}) {
        into.x = x
        into.y = y
        return into
    },

    sub(v1, v2, into = {x:0, y:0}) {
        into.x = v1.x - v2.x
        into.y = v1.y - v2.y
        return into
    },

    add(v1, v2, into = {x:0, y:0}) {
        into.x = v1.x + v2.x
        into.y = v1.y + v2.y
        return into
    },

    scale(v1, factor, into = {x:0, y:0}) {
        into.x = v1.x * factor
        into.y = v1.y * factor
        return into
    },

    divide(v1, factor, into = {x:0, y:0}) {
        into.x = v1.x / factor
        into.y = v1.y / factor
        return into
    },

    distSq(v1, v2) {
        const dx = v2.x - v1.x
        const dy = v2.y - v1.y
        return dx * dx + dy * dy
    },

    dist(v1, v2) {
        return Math.sqrt(distSq)
    },

    sqMagnitude(v1) {
        return v1.x * v1.x + v1.y * v1.y
    },

    magnitude(v1) {
        return Math.sqrt(Vec.sqMagnitude(v1))
    },

    normalise(v1, into = {x:0, y:0}) {
        Vec.divide(v1, Vec.magnitude(v1), into)
        return into
    },

    direction(v1, v2, into = {x:0, y:0}) {
        Vec.sub(v2, v1, into)
        Vec.normalise(into, into)
        return into
    },

    clamp(v1, min, max, into = {x:0, y:0}) {
        into.x = Math.max(Math.min(v1.x, max.x), min.x)
        into.y = Math.max(Math.min(v1.y, max.y), min.y)
    },

    reverse(v1, into = {x:0, y:0}) {
        into.x = -v1.x
        into.y = -v1.y
        return into
    },

    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y
    },

    cross(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y
    },

    // Normal must be normalised
    reflect(vector, normal, into = {x:0, y:0}) {
        const dotProduct = Vec.dot(normal, vector);
        into.x = vector.x - 2 * dotProduct * normal.x
        into.y = vector.y - 2 * dotProduct * normal.y
        return into;
    }
}
const space = []
const granularity = 5
const display = {x: 100, y: 100}

for (let x = 0; x < Math.floor(display.x/granularity); x++) {
    space[x] = []
    for (let y = 0; y < Math.floor(display.y/granularity); y++) {
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

    const distRight = Vec.distSq(pt, right.space)
    const distDown = Vec.distSq(pt, down.space)

    const other = distRight < distDown ? right : down
    const [u, v, w] = toBarycentric(pt, top.space, opposite.space, other.space)

    const transformed = fromBarycentric(u, v, w, top.subspace, opposite.subspace, other.subspace)

    return transformed
}

console.log(toSubspace(19, 16))

