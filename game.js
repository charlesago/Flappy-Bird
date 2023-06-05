kaboom()

loadSprite("bird", "sprites/bluebird-downflap.png")
loadSprite("bg", "sprites/background-night.png")
loadSprite("base", "sprites/base.png")
loadSprite("tube", "sprites/pipe-red.png")
loadSprite("gameover", "sprites/gameover.png")
loadSprite("message", "sprites/message.png")


setGravity(2400)

loadBean()


scene("message", ()=> {


    add([
        sprite("bg", {width: width(), height: height()}),

    ]);
    add([
        sprite("message"),
        pos(width() / 2, height() / 2 - 108),
        scale(3),
        anchor("center"),
    ]);




    onKeyPress("space", () => go("game"))
    onClick(() => go("game"))

})

go("message")

scene("game", () => {

    const PIPE_OPEN = 240
    const PIPE_MIN = 60
    const JUMP_FORCE = 800
    const SPEED = 320
    const CEILING = -60

    add([
        sprite("bg", {width: width(), height: height()}),

    ]);
    const bird = add([
        sprite("bird", {height: 50}),
        pos(width() / 4, 0),
        area(),
        body(),
    ])


    bird.onUpdate(() => {
        if (bird.pos.y >= height() || bird.pos.y <= CEILING) {
            go("lose", score)
        }
    })


    onKeyPress("space", () => {
        bird.jump(JUMP_FORCE)

    })

    onGamepadButtonPress("south", () => {
        bird.jump(JUMP_FORCE)

    })


    onClick(() => {
        bird.jump(JUMP_FORCE)

    })

    function spawntube() {

        const h1 = rand(PIPE_MIN, height() - PIPE_MIN - PIPE_OPEN)
        const h2 = height() - h1 - PIPE_OPEN

        add([
            pos(width(), 0),
            rect(64, h1),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),

            "tube",
        ])

        add([
            pos(width(), h1 + PIPE_OPEN),
            rect(64, h2),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),

            "tube",

            { passed: false },
        ])

    }


    bird.onCollide("tube", () => {
        go("lose", score)
        addKaboom(bird.pos)
    })

    onUpdate("tube", (p) => {
        if (p.pos.x + p.width <= bird.pos.x && p.passed === false) {
            addScore()
            p.passed = true
        }
    })

    loop(1, () => {
        spawntube()
    })

    let score = 0

    const scoreLabel = add([
        text(score),
        pos(width() / 2, 80),
        fixed(),
        z(100),
    ])

    function addScore() {
        score++
        scoreLabel.text = score


    }

})

scene("lose", (score) => {


    add([
        sprite("bg", {width: width(), height: height()}),

    ]);
    add([
        sprite("gameover"),
        pos(width() / 2, height() / 2 - 300),
        scale(3),
        anchor("center"),

    ]);
    add([
        sprite("bird"),
        pos(width() / 2, height() / 2 - 108),
        scale(3),
        anchor("center"),
    ])

    add([
        text(score),
        pos(width() / 2, height() / 2 + 108),
        scale(3),
        anchor("center"),
    ])

    onKeyPress("space", () => go("game"))
    onClick(() => go("game"))

})

go("game")
go("message")
