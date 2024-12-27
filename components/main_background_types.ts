import type { Sprite } from 'pixi.js';

export interface Speed {
  x: number;
  y: number;
  rotation: number;
}

export interface Triangle {
  speed: Speed;
  sprite: Sprite;
}
