kaboom()

loadSprite("bird", "sprites/bluebird-downflap.png")
loadSprite("bg", "sprites/background-night.png")
loadSprite("base", "sprites/base.png")
loadSprite("tube", "sprites/pipe-red.png")
loadSprite("gameover", "sprites/gameover.png")
loadSprite("message", "sprites/message.png")
loadSprite("bg2", "sprites/background-day.png")
loadSprite("coin", "sprites/undefined - Imgur.png")



setGravity(2400)

loadBean()

/*========================= Scene du message du debut !  ========================*/
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

/*========================= Scene du jeu  ========================*/

scene("game", () => {

    const game = add([
        timer(),
    ])

    const TUBE_OPEN = 240
    const TUBE_MIN = 60
    const JUMP_FORCE = 800
    const SPEED = 320
    const CEILING = -60

/*l'ajout du background*/
    add([
        sprite("bg", {width: width(), height: height()}),
        "bg"
    ]);
    /*l'ajout de l'oiseau */

    const bird = add([
        sprite("bird", {height: 50}),
        pos(width() / 4, 0),
        area(),
        z(2),
        body(),
    ])
    /*"Parametre de l'oiseau"*/
    bird.onUpdate(() => {
        if (bird.pos.y >= height() || bird.pos.y <= CEILING) {
            go("lose", score)
        }
    })
    /*configuration des touches pour sauter*/

    onKeyPress("space", () => {
        bird.jump(JUMP_FORCE)
    })

    onGamepadButtonPress("south", () => {
        bird.jump(JUMP_FORCE)
    })

    onClick(() => {
        bird.jump(JUMP_FORCE)
    })
    /*Fonction qui fait apparaitre les tube aléatoirement */

    function spawntube() {

        const h1 = rand(TUBE_MIN, height() - TUBE_MIN - TUBE_OPEN)
        const h2 = height() - h1 - TUBE_OPEN

        /*Parametre des tube*/

        add([
            pos(width(), 0),
            rect(64, h1),
            color(0, 127, 255),
            outline(4),
            area(),
            move(LEFT, SPEED),
            z(2),
            offscreen({ destroy: true }),
            "tube",
        ])

        add([
            pos(width(), h1 + TUBE_OPEN),
            rect(64, h2),
            color(0, 127, 255),
            outline(4),
            area(),
            z(2),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
            "tube",
            { passed: false },
        ])

       add([
            sprite("coin", {height: 50}),
            pos(width(), h1 + 90 ),
            area(),
           z(2),
            move(LEFT, SPEED),
            offscreen({ destroy: true }),
           "coin"
        ]);
    }


    bird.onCollide("tube", () => {
        go("lose", score)
        addKaboom(bird.pos)
    })

    bird.onCollide("coin", (c) => {
       addScoreCoin()
        destroy(c)
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





    /*score des pieces =   */
    let scoreCoin = 0

    const scoreCoinLabel = add([

        text(scoreCoin),
        pos(width() / 20, 80),
        fixed(),
        z(100),
    ])
    const CoinLabel = add([
        sprite("coin", {height: 50}),
        pos(width() / 50, 78),
        fixed(),
        z(100),
    ])

    function addScoreCoin() {
        scoreCoin = scoreCoin+2
        scoreCoinLabel.text = scoreCoin


    }

    let curTween = null


    onKeyPress("p", () => {
        game.paused = !game.paused
        if (curTween) curTween.cancel()
        curTween = tween(

            pauseMenu.pos,

            game.paused ? center() : center().add(0, 700),

            0.5,

            (p) => pauseMenu.pos = p,

            easings.easeOutElastic,
        )
        if (game.paused) {
            pauseMenu.hidden = false
            pauseMenu.paused = false
        } else {
            curTween.onEnd(() => {
                pauseMenu.hidden = true
                pauseMenu.paused = true
            })
        }
    })

    const pauseMenu = add([
        rect(300, 400),
        color(255, 255, 255),
        outline(4),
        anchor("center"),
        z(200),
        pos(center().add(0, 700)),
    ])

    pauseMenu.hidden = true
    pauseMenu.paused = true

    onUpdate("bg", (bg) => {
        if (score > 1) {
            destroy(bg)
            add([
                sprite("bg2", {width: width(), height: height()}),
                z(0)
            ]);
        }
    })
})

/*=========================Scene qui affiche le texte quand on perd ========================*/
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
        sprite("coin"),
        pos(width() / 1.90, height() / 2 - -5),
        scale(3),
        anchor("center"),
    ])
    add([
        text(score*2),
        pos(width() / 2, height() / 2 - 0),
        scale(1.25),
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
