class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.g = canvas.getContext("2d")
        this.update = this.update.bind(this)
        this.render = this.render.bind(this)

        this.gameTicksPerSecond = 25
        this.millisPerTick = 1000 / this.gameTicksPerSecond
        this.maxTickSkip = 5
        this.tick = 0
        this.startPerfTime = 0
        this.lastTickComplete = 0

        this.keyMap = {}
        this.inputState = {}

        this.renderables = []
        this.updateables = []
        this.beforeTicks = []
        this.afterTicks = []
        this.beforeFrames = []
        this.afterFrames = []
    }

    add(obj) {
        if (obj.render) {
            this.renderables.push(obj)
        }
        if (obj.update) {
            this.updateables.push(obj)
        }
        if (obj.beforeFrame) {
            this.beforeFrames.push(obj)
        }
        if (obj.beforeTick) {
            this.beforeTicks.push(obj)
        }
        if (obj.afterFrame) {
            this.afterFrames.push(obj)
        }
        if (obj.afterTick) {
            this.afterTicks.push(obj)
        }
    }

    mapKey(key, action) {
        this.keyMap[key] = action
    }

    beforeFrame() {
        for (let obj of this.beforeFrames) {
            obj.beforeFrame()
        }
    }

    afterFrame() {
        for (let obj of this.afterFrames) {
            obj.afterFrame()
        }
    }

    beforeTick() {
        for (let obj of this.beforeTicks) {
            obj.beforeTick()
        }
    }

    afterTick() {
        for (let obj of this.afterTicks) {
            obj.afterTick()
        }
    }

    render() {
        const interpolation = (performance.now() - this.lastTickComplete) / this.millisPerTick
        const g = this.g
        g.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.beforeFrame(g)
        for (let i = 0; i  < this.renderables.length; ++i) {
            this.renderables[i].render(g, interpolation)
        }
        this.afterFrame(g)
        requestAnimationFrame(this.render)
    }

    update() {
        const gameTicksPerSecond = this.gameTicksPerSecond
        const startTime = this.startPerfTime
        const tickLimitThisFrame = this.tick + this.maxTickSkip

        let nextTickTime = startTime + this.tick * gameTicksPerSecond
        let now = 0

        const inputState = this.inputState
        this.inputState = {}

        do {
            this.beforeTick(inputState)
            for (let i = 0; i  < this.updateables.length; ++i) {
                this.updateables[i].update(inputState)
            }
            this.afterTick(inputState)
            this.tick++
            nextTickTime = startTime + this.tick * gameTicksPerSecond
            now = performance.now()
        } while (this.tick <= tickLimitThisFrame && nextTickTime < now)

        this.lastTickComplete = now
        setTimeout(this.update, Math.max(0, nextTickTime - now))
    }

    run() {
        this.initialiseKeyMap()

        this.startPerfTime = performance.now()
        this.lastTickComplete = this.startPerfTime

        setTimeout(this.update, 0)
        requestAnimationFrame(this.render)
    }

    initialiseKeyMap() {
        for (let [key, action] of Object.entries(this.keyMap)) {
            keyboardJS.bind(key, () => this.inputState[action] = true)
        }
    }
}