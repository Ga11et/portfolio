<template>
  <div ref="block"></div>
</template>

<script setup lang="ts">
import { Application, Assets, Sprite, Ticker, type Renderer } from 'pixi.js';
import type { Speed, Triangle } from './main_background_types';

const block = ref<HTMLElement | null>(null);
let app: Application<Renderer>;
let triangles: Triangle[] = [];
let mouse_point = ref({
  x: 0,
  y: 0,
  strength_x: 0,
});

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
    }, 50 * i);
  }
}

async function add_sprite() {
  if (!app) {
    console.error('Can not add sprite, App is empty');
    return;
  }
  const triangle = Sprite.from('triangle') as Triangle;
  triangle.eventMode = 'static';
  app.stage.addChild(triangle);
  triangle.anchor.set(0.5, 0.6);
  const random_size = 0.3 + Math.random() / 2;
  triangle.scale.set(random_size);
  const random_x = Math.random() * app.screen.width;
  triangle.x = random_x;
  const random_y = Math.random() * app.screen.height;
  triangle.y = random_y;
  triangle.speed = {
    x: 0,
    y: 0,
    rotation: Math.random() / 10,
  };
  triangle.is_on_floor = false;
  triangles.push(triangle);
}

function is_on_floor_check(triangle: Sprite) {
  return triangle.y > app.screen.height - triangle.height * 0.4;
}

function triangle_tick_function(time: Ticker, triangle: Triangle) {
  if (triangle.x < 0 || triangle.x > app.screen.width) {
    triangle.x = Math.max(0, Math.min(app.screen.width, triangle.x));
    triangle.speed.x = -triangle.speed.x;
  }
  triangle.y += triangle.speed.y * time.deltaTime;
  triangle.x += triangle.speed.x * time.deltaTime;
  triangle.rotation += triangle.speed.rotation * time.deltaTime;
}

function handle_triangles(time: Ticker) {
  triangles.forEach((triangle) => {
    const is_on_floor = is_on_floor_check(triangle);

    if (is_on_floor) {
      const is_should_jump = is_mouse_under_sprite(triangle);

      if (is_should_jump) {
        const isLeft = triangle.x < mouse_point.value.x;
        triangle.speed.rotation = isLeft ? -0.1 : 0.1;
        const normalized_strength_x = Math.max(-8, Math.min(8, mouse_point.value.strength_x));
        const final_strength_x =
          Math.abs(normalized_strength_x) < 3 ? Math.sign(normalized_strength_x) * 3 : normalized_strength_x;
        triangle.speed.x = 6 * final_strength_x * get_math_random_more_variable();
        triangle.speed.y = -4 * Math.abs(final_strength_x) * get_math_random_more_variable();
      } else {
        triangle.speed.y = 0;
        triangle.is_on_floor = is_on_floor;
        return;
      }
    }
    triangle.speed.y += 0.6;
    triangle.speed.x = Math.abs(triangle.speed.x) < 1 ? 0 : triangle.speed.x / 1.02;
    triangle_tick_function(time, triangle);
  });
}
function is_mouse_under_sprite(triangle: Triangle) {
  const mouseInSprite =
    mouse_point.value.x > triangle.x - triangle.width / 2 &&
    mouse_point.value.x < triangle.x + triangle.width / 2 &&
    mouse_point.value.y > triangle.y - triangle.height / 2 &&
    mouse_point.value.y < triangle.y + triangle.height / 2;

  return Boolean(mouseInSprite);
}
function get_math_random_more_variable() {
  const random_number = Math.random();
  const random_offset = 0.5;
  return random_number + random_offset;
}

onMounted(async () => {
  await preload_assets();
  await init_pixi();
  await add_sprites(100);

  app.stage.eventMode = 'static';
  app.stage.on('mousemove', (event) => {
    mouse_point.value = { ...event.global, strength_x: event.movement.x };
  });
  app.ticker.add(handle_triangles);
});
onBeforeUnmount(() => {
  app?.destroy(true);
});
</script>
