<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <h1 :class="$style.title">
        <span>Сайт-визитка</span><span>Frontend разработчика</span><span>Фёдора Сивкова</span>
      </h1>
    </div>

    <div :class="$style.background">
      <PixiMainBackground />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" module>
.container {
  height: 100dvh;
  width: 100%;

  position: relative;
}

.content {
  position: absolute;
  z-index: $indexDefault;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.background {
  position: absolute;
  z-index: $indexBackground;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.title {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  font: $title-m-42;
  color: white;
}
</style>
