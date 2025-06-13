<template>
    <nav class="navbar">
      <div class="navbar-left">
        <span class="logo">商城管理系统</span>
        <router-link v-if="showLink('/goods')" to="/goods" exact-active-class="active">商品管理</router-link>
        <router-link v-if="showLink('/category')" to="/category" exact-active-class="active">分类管理</router-link>
        <router-link v-if="showLink('/gallery')" to="/gallery" exact-active-class="active">图库管理</router-link>
        <router-link v-if="showLink('/user')" to="/user" exact-active-class="active">用户管理</router-link>
      </div>
      <div class="navbar-right" v-if="loginUser">
        <span class="user-info">你好，{{ loginUser.username }}</span>
        <button @click="logout" class="logout-btn">退出登录</button>
      </div>
    </nav>
  </template>
  
  <script>
  const SESSION_KEY = 'loginUser'
  export default {
    data() {
      return {
        loginUser: null
      }
    },
    created() {
      this.loadUser()
      window.addEventListener('storage', this.loadUser)
    },
    beforeUnmount() {
      window.removeEventListener('storage', this.loadUser)
    },
    methods: {
      loadUser() {
        try {
          this.loginUser = JSON.parse(localStorage.getItem(SESSION_KEY))
        } catch { this.loginUser = null }
      },
      logout() {
        localStorage.removeItem(SESSION_KEY)
        this.loginUser = null
        this.$router.push('/login')
      },
      showLink(path) {
        // 控制哪些页面显示在导航栏（可自定义）
        return ['/goods', '/category', '/gallery', '/user'].includes(path)
      }
    }
  }
  </script>
  
  <style scoped>
  .navbar {
    height: 56px;
    background: linear-gradient(90deg, #6366f1 40%, #be185d 100%);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    font-size: 16px;
    box-shadow: 0 2px 12px #6366f130;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .navbar-left {
    display: flex;
    align-items: center;
  }
  .logo {
    font-size: 20px;
    font-weight: bold;
    margin-right: 24px;
    letter-spacing: 2px;
  }
  .router-link-exact-active, .active {
    background: rgba(255,255,255,0.18);
    border-radius: 6px;
    padding: 6px 16px;
    margin-right: 8px;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    transition: background 0.18s;
  }
  .router-link-exact-active:hover, .active:hover {
    background: rgba(255,255,255,0.32);
  }
  .router-link-exact-active:last-child, .active:last-child {
    margin-right: 0;
  }
  .navbar-right {
    display: flex;
    align-items: center;
  }
  .user-info {
    margin-right: 18px;
    letter-spacing: 1px;
    font-size: 15px;
  }
  .logout-btn {
    background: #fff;
    color: #be185d;
    border: none;
    border-radius: 5px;
    padding: 6px 18px;
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    box-shadow: 0 1px 6px #be185d20;
  }
  .logout-btn:hover {
    background: #be185d;
    color: #fff;
  }
  </style>