# PixiJS game template

[> TEST IT HERE <](https://pixi-game-template.vercel.app/)

See src/index.ts for a simple example or clone this repository to start creating a game !

# How to use

To start coding, just run `yarn start`. It runs parcel in watch mode but without reloading your browser. Why ? Because HMR doesn't work by default with PixiJS (it recreates the canvas, the webgl context and reload all assets everytime). I figured it was easier to just use "CMD + R" to reload the tab once in a while (its a game, not a web app you are building, so it's ok).

The index.ts is the entrypoint of the game. I simply added a Game class around PixiJS basic functions to create the canvas and tick a callback 60 times per seconds (see src/lib/engine.ts).

The rest is up to you ! (I may add more abstractions to simplify gamedev in the long run, like the Entity class, but I mostly want it to stay simple).

Go make games now :)

# Resources

- Great tutorial to grasp the basics of PixiJS : https://github.com/kittykatattack/learningPixi
