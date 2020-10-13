const config = {
    type: Phaser.AUTO, // Which renderer to use
    width: 800, // Canvas width in pixels
    height: 600, // Canvas height in pixels
    parent: "game-container", // ID of the DOM element to add the canvas to
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 } // Top down game, so no gravity
        }
    }
};

const game = new Phaser.Game(config);
var player;
var cursors;
var fecalUrgencyBar;
var hungerBar;
var fecalUrgency = 0;
var hunger = 0;

function preload() {
    // Runs once, loads up assets like images and audio
    this.load.image("tiles", "assets/tilesets/basictiles.png");
    this.load.tilemapTiledJSON("map", "assets/tilemaps/world.json");
    this.load.spritesheet('characters', 'assets/tilesets/characters.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('poop', 'assets/tilesets/poop.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
    // Runs once, after all assets in preload are loaded
    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("world-tiles", "tiles");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const groundLayer = map.createStaticLayer("Ground", tileset, 0, 0);
    const groundObjectsLayer = map.createStaticLayer("GroundObjects", tileset, 0, 0);
    groundObjectsLayer.setCollisionByProperty({ collides: true });

    player = this.physics.add.sprite(100, 100, "characters", 1);

    this.physics.add.collider(player, groundObjectsLayer);

    // Create the player's walking animations from the texture atlas. These are stored in the global
    // animation manager so any sprite can access them.
    this.anims.create({
        key: 'walk-left',
        frames: this.anims.generateFrameNumbers('characters', { start: 12, end: 14 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-right',
        frames: this.anims.generateFrameNumbers('characters', { start: 24, end: 26 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-back',
        frames: this.anims.generateFrameNumbers('characters', { start: 36, end: 38 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk-front',
        frames: this.anims.generateFrameNumbers('characters', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'stink',
        frames: 'poop',
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.once("keydown_D", event => {
        // Turn on physics debugging to show player's hitbox
        this.physics.world.createDebugGraphic();

        // Create worldLayer collision graphic above the player, but below the help text
        const graphics = this.add
            .graphics()
            .setAlpha(0.75)
            .setDepth(20);
        groundObjectsLayer.renderDebug(graphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
    });

    var fecalUrgencyOutline = this.add.rectangle(3, 3, 150, 20).setOrigin(0, 0);
    fecalUrgencyOutline.isStroked = true;
    fecalUrgencyOutline.strokeColor = 0xFFFFFF;
    fecalUrgencyOutline.isFilled = false;
    fecalUrgencyBar = this.add.rectangle(4, 4, 148, 18, 0x8B4513).setOrigin(0, 0);
    this.add.text(5, 3, 'Fecal urgency', { fontFamily: 'Verdana' });
    
    var hungerOutline = this.add.rectangle(3, 27, 150, 20).setOrigin(0, 0);
    hungerOutline.isStroked = true;
    hungerOutline.strokeColor = 0xFFFFFF;
    hungerOutline.isFilled = false;

    hungerBar = this.add.rectangle(4, 28, 148, 18, 0xFF0000).setOrigin(0, 0);
    this.add.text(5, 27, 'Hunger', { fontFamily: 'Verdana' });
}


function update(time, delta) {
    // Runs once per frame for the duration of the scene
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown) {
        player.body.setVelocityX(-100);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(100);
    }

    // Vertical movement
    if (cursors.up.isDown) {
        player.body.setVelocityY(-100);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(100);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown) {
        player.anims.play("walk-left", true);
    } else if (cursors.right.isDown) {
        player.anims.play("walk-right", true);
    } else if (cursors.up.isDown) {
        player.anims.play("walk-back", true);
    } else if (cursors.down.isDown) {
        player.anims.play("walk-front", true);
    } else {
        player.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.x < 0) player.setTexture("characters", 13);
        else if (prevVelocity.x > 0) player.setTexture("characters", 25);
        else if (prevVelocity.y < 0) player.setTexture("characters", 37);
        else if (prevVelocity.y > 0) player.setTexture("characters", 1);
    }

    if (this.input.keyboard.checkDown(cursors.space, 500)) {
        var s = this.add.sprite(player.x, player.y, 'poop');
        s.setScale(0.5);
        s.anims.play('stink');
        this.children.bringToTop(player);
    }

    fecalUrgency = Phaser.Math.Clamp(fecalUrgency + 0.25, 0, 100);
    hunger = Phaser.Math.Clamp(hunger + 0.5, 0, 100);

    fecalUrgencyBar.scaleX = fecalUrgency / 100;
    hungerBar.scaleX = hunger / 100;

}

function addEnemy(){

}