<template>
  <div>
    <div>
      <NuxtPage/>
    </div>
  </div>
</template>

<style >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

main {
  position: relative;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100vh;

  gap: 10px;

  background-color: #1f1f1f;
  color: white;
}

h1 {
  font-size: 54px;
}
</style>