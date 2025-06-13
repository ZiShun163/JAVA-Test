<template>
  <div>
    <nav class="nav">
      <router-link to="/goods">商品管理</router-link>
      <router-link to="/category">商品分类</router-link>
      <router-link to="/user">用户管理</router-link>
      <router-link to="/gallery">图库管理</router-link>
      <router-link to="/login" class="logout">退出登录</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style src="./assets/global.css"></style>