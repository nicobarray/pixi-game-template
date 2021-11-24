import {
  Sprite,
  Application,
  IApplicationOptions,
  Loader,
  IAddOptions,
  Container,
} from "pixi.js";

interface Key {
  value: string; // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
  isDown: boolean;
  isUp: boolean;
  press: () => void;
  release: () => void;
  downHandler: (event: KeyboardEvent) => void;
  upHandler: (event: KeyboardEvent) => void;
  unsubscribe: () => void;
}

function keyboard(value: string) {
  const key: Partial<Key> = {
    value,
    isDown: false,
    isUp: true,
    press: undefined,
    release: undefined,
  };

  key.downHandler = (event) => {
    if (event.key === key.value) {
      if (key.isUp && key.press) {
        key.press();
      }
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  key.upHandler = (event) => {
    if (event.key === key.value) {
      if (key.isDown && key.release) {
        key.release();
      }
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);

  window.addEventListener("keydown", downListener, false);
  window.addEventListener("keyup", upListener, false);

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key as Key;
}

export class Entity extends Container {
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

/**
 * The Game class is an abstract class that is extended by the
 * developper to create a new game using Pixi.js as the rendering engine.
 */
export abstract class Game {
  private _app: Application;
  private _keys: { [key: string]: Key } = {};

  protected isKeyDown(key: string) {
    if (!this._keys[key]) {
      throw new Error("Key " + key + " is not registered");
    }

    return this._keys[key].isDown;
  }

  protected isKeyUp(key: string) {
    if (!this._keys[key]) {
      throw new Error("Key " + key + " is not registered");
    }

    return this._keys[key].isUp;
  }

  protected get s() {
    return this._app.stage;
  }

  protected tex(name: string) {
    return Loader.shared.resources[name].texture;
  }

  protected texFrom(name: string, from: string) {
    return Loader.shared.resources[from].textures[name];
  }

  protected createSprite(textureName: string) {
    return new Sprite(this.tex(textureName));
  }

  protected createSpriteFrom(textureName: string, spritesheetName: string) {
    return new Sprite(this.texFrom(textureName, spritesheetName));
  }

  /**
   * Create a keyboard key listener.
   * @param value KeyValues from https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
   * @returns A Key object (with an "unsubscribe" method to stop listening to the key event)
   */
  protected listenToKey(value: string) {
    if (this._keys[value]) {
      this._keys[value].unsubscribe();
    }

    this._keys[value] = keyboard(value);
    return this._keys[value];
  }

  constructor(
    root: HTMLElement,
    options: IApplicationOptions & { width: number; height: number },
    readonly _resources: (string | IAddOptions)[][]
  ) {
    this._app = new Application({
      backgroundColor: 0x1099bb,
      // resolution: window.devicePixelRatio,
      ...options,
    });

    root.appendChild(this._app.view);
  }

  start() {
    console.log(
      "[game-engine] Loading " + this._resources.length + " resources..."
    );
    for (let resource of this._resources) {
      Loader.shared.add(resource);
    }

    console.log("[game-engine] Waiting for resources to load...");
    Loader.shared.load(() => {
      console.log("[game-engine] Resources loaded.");

      console.log("[game-engine] Initialize the game...");
      this.initialize();
      console.log("[game-engine] Game initialized.");

      console.log("[game-engine] Start the game updates...");
      let elapsed = 0.0;
      this._app.ticker.add((delta) => {
        elapsed += delta;
        this.update(elapsed, delta);
      });
    });
  }

  protected initialize() {
    throw new Error("Implement this");
  }

  protected update(elapsed: number, delta: number) {
    throw new Error("Implement this");
  }
}
