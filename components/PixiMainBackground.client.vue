<template>
  <div ref="block"></div>
</template>

<script setup lang="ts">
import { Application, Assets, Sprite } from 'pixi.js';

const block = ref(null);
let app = null;

async function preload_assets() {
  const assets = [{ alias: 'triangle', src: '/pixi/triangle.svg' }];
  await Assets.load(assets);
}

async function init_pixi() {
  app = new Application();
  await app.init({ background: '#000', resizeTo: window });
  app.canvas.style.display = 'block';
  block.value?.appendChild(app.canvas);
}

async function add_sprites(amount) {
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
  const random_size = Math.random();
  triangle.scale.set(random_size);

  const random_x = Math.random() * app.screen.width;
  triangle.x = random_x;
  const random_y = Math.random() * app.screen.height;
  triangle.y = random_y;

  let speed = 0;
  let is_on_floor = false;

  app.ticker.add((time) => {
    is_on_floor = is_on_floor_check(triangle);
    if (is_on_floor) {
      speed = 0;
      return;
    }
    speed += 0.3;
    triangle_tick_function(time, triangle, speed);
  });

  triangle.on('mouseenter', function (event) {
    if (is_on_floor) {
      triangle.y = app.screen.height - triangle.height * 0.4;
      speed = -20;
    }
  });
}

function is_on_floor_check(triangle) {
  return triangle.y > app.screen.height - triangle.height * 0.4;
}

function triangle_tick_function(time, triangle, speed = 0) {
  triangle.y += speed * time.deltaTime;
  const random_rotation = Math.random() / 10;
  triangle.rotation += random_rotation * time.deltaTime;
}

onMounted(async () => {
  await preload_assets();
  await init_pixi();
  await add_sprites(40);
});
onBeforeUnmount(() => {
  app?.destroy(true);
  app = null;
});
</script>

<style module></style>
