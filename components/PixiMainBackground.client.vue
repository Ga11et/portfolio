<template>
  <div ref="block"></div>
</template>

<script setup lang="ts">
import { Application, Assets, Sprite, Ticker, type Renderer } from 'pixi.js';
import type { Speed } from './main_background_types';

const block = ref<HTMLElement | null>(null);
let app: Application<Renderer>;

async function preload_assets() {
  const assets = [{ alias: 'triangle', src: '/pixi/triangle.svg' }];
  await Assets.load(assets);
}

async function init_pixi() {
  app = new Application();
  await app.init({ background: '#000', resizeTo: window });
  app.canvas.style.display = 'block';
  if (block.value) {
    block.value.appendChild(app.canvas);
  }
}

async function add_sprites(amount: number) {
  if (!app) {
    console.error('Can not add sprites, App is empty');
    return;
  }
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      add_sprite();
    }, 100 * i);
  }
}

async function add_sprite() {
  if (!app) {
    console.error('Can not add sprite, App is empty');
    return;
  }
  const triangle = Sprite.from('triangle');
  triangle.eventMode = 'static';
  app.stage.addChild(triangle);
  triangle.anchor.set(0.5, 0.6);
  const random_size = 0.5 + Math.random() / 2;
  triangle.scale.set(random_size);
  const random_x = Math.random() * app.screen.width;
  triangle.x = random_x;
  const random_y = Math.random() * app.screen.height;
  triangle.y = random_y;
  const speed: Speed = {
    x: 0,
    y: 0,
    rotation: Math.random() / 10,
  };
  let is_on_floor = false;
  app.ticker.add((time) => {
    is_on_floor = is_on_floor_check(triangle);
    if (is_on_floor) {
      speed.y = 0;
      return;
    }
    speed.y += 0.6;
    speed.x = Math.abs(speed.x) < 1 ? 0 : speed.x / 1.02;
    triangle_tick_function(time, triangle, speed);
  });
  triangle.on('mouseenter', function (event) {
    if (is_on_floor) {
      const mouse_x = event.global.x;
      const strength_x = event.movement.x;
      triangle.y = app.screen.height - triangle.height * 0.4;
      const isLeft = triangle.x < mouse_x;
      speed.rotation = isLeft ? -0.1 : 0.1;
      const normalized_strength_x = Math.max(-10, Math.min(10, strength_x));
      const final_strength_x =
        Math.abs(normalized_strength_x) < 3 ? Math.sign(normalized_strength_x) * 3 : normalized_strength_x;
      speed.x = 6 * final_strength_x;
      speed.y = -4 * Math.abs(final_strength_x);
    }
  });
}

function is_on_floor_check(triangle: Sprite) {
  return triangle.y > app.screen.height - triangle.height * 0.4;
}

function triangle_tick_function(time: Ticker, triangle: Sprite, speed: Speed) {
  if (triangle.x < 0 || triangle.x > app.screen.width) {
    triangle.x = Math.max(0, Math.min(app.screen.width, triangle.x));
    speed.x = -speed.x;
  }
  triangle.y += speed.y * time.deltaTime;
  triangle.x += speed.x * time.deltaTime;
  triangle.rotation += speed.rotation * time.deltaTime;
}

onMounted(async () => {
  await preload_assets();
  await init_pixi();
  await add_sprites(60);
});
onBeforeUnmount(() => {
  app?.destroy(true);
});
</script>
