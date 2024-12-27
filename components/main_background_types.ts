import type { Sprite } from 'pixi.js';

export interface Speed {
  x: number;
  y: number;
  rotation: number;
}

export interface Triangle extends Sprite {
  speed: Speed;
  is_on_floor: boolean;
}
