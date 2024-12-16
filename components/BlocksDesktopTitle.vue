<template>
  <div :class="$style.container">
    <h1 :class="$style.title">
      <span>Сайт-визитка</span><span>Frontend разработчика</span><span>Фёдора Сивкова</span>
    </h1>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" module>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100%;
  background-color: black;
}

.title {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  font: $title-m-42;
  color: white;
}
</style>
