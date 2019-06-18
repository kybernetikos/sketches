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
        return Math.sqrt(this.distSq(v1, v2))
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
