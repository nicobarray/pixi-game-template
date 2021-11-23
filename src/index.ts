import { Sprite, Container } from "pixi.js";
import { Game } from "./lib/engine";

class Entity extends Container {
  private sprite_: Sprite;
  public vx: number;
  public vy: number;

  constructor(sprite: Sprite) {
    super();

    this.sprite_ = sprite;
    this.sprite_.anchor.set(0.5);

    this.vx = 0;
    this.vy = 0;

    this.addChild(this.sprite_);
  }

  public update(delta: number) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }
}

class MyGame extends Game {
  private player: Entity;
  private cat: Entity;
  private gameScene: Container;

  constructor() {
    super(
      document.querySelector("#root"),
      {
        width: 600,
        height: (9 / 16) * 600,
        backgroundColor: 0x008888,
      },
      [
        [{ name: "cat", url: "img/cat.png" }],
        [{ name: "spritesheet", url: "img/spritesheet.json" }],
      ]
    );
  }

  initialize() {
    // Create a player with a sprite and set its position and sprite origin.
    this.player = new Entity(
      this.createSpriteFrom("explorer.png", "spritesheet")
    );
    this.player.x = 64;
    this.player.y = 128;

    // Prepare the keys to listen to.
    this.listenToKey("ArrowLeft");
    this.listenToKey("ArrowUp");
    this.listenToKey("ArrowRight");
    this.listenToKey("ArrowDown");

    this.cat = new Entity(this.createSprite("cat"));

    this.gameScene = new Container();
    this.gameScene.addChild(this.player);
    this.gameScene.addChild(this.cat);

    this.s.addChild(this.gameScene);
  }

  update(elapsed: number, delta: number) {
    this.cat.x = 128.0 + Math.cos(elapsed / 50.0) * 100.0;
    this.cat.rotation = elapsed / 50.0;

    this.player.vx = 0;
    this.player.vy = 0;

    if (this.isKeyDown("ArrowLeft")) {
      this.player.vx = -5;
    }
    if (this.isKeyDown("ArrowUp")) {
      this.player.vy = -5;
    }
    if (this.isKeyDown("ArrowRight")) {
      this.player.vx = 5;
    }
    if (this.isKeyDown("ArrowDown")) {
      this.player.vy = 5;
    }

    this.player.update(delta);
    this.cat.update(delta);
  }
}

new MyGame().start();
