<template>
  <div class="login-container">
    <div class="login-box">
      <h2>商城系统登录</h2>
      <form @submit.prevent="login">
        <div class="form-item">
          <label>用户名</label>
          <input v-model="username" required autocomplete="username" />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </div>
        <div class="form-item" style="margin-top:10px;">
          <button type="submit" class="login-btn">登录</button>
        </div>
        <div v-if="errMsg" class="err">{{errMsg}}</div>
      </form>
    </div>
  </div>
</template>

<script>
const USER_KEY = 'userList'
const SESSION_KEY = 'loginUser'

export default {
  data() {
    return {
      username: '',
      password: '',
      errMsg: ''
    }
  },
  methods: {
    login() {
      const users = JSON.parse(localStorage.getItem(USER_KEY) || '[]')
      const user = users.find(
        u => u.username === this.username && u.password === this.password
      )
      if (!user) {
        this.errMsg = '用户名或密码错误'
        return
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      this.errMsg = ''
      this.$router.push('/goods')
    }
  },
  created() {
    const loginUser = localStorage.getItem(SESSION_KEY)
    if (loginUser) {
      this.$router.push('/goods')
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #dbeafe 0%, #f5d0fe 100%);
}
.login-box {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px #a5b4fc60;
  padding: 36px 38px 32px 38px;
  min-width: 340px;
  animation: fadein 1s;
}
@keyframes fadein {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}
h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #374151;
  letter-spacing: 2px;
}
.form-item {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 15px;
  margin-bottom: 4px;
  color: #555;
}
input {
  padding: 8px 12px;
  border: 1px solid #a5b4fc;
  border-radius: 4px;
  font-size: 16px;
  background: #f1f5f9;
  transition: border-color 0.2s;
  outline: none;
}
input:focus {
  border-color: #6366f1;
  background: #fff;
}
.login-btn {
  width: 100%;
  padding: 9px 0;
  background: linear-gradient(90deg, #6366f1 40%, #be185d 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 2px 8px #818cf830;
  transition: background 0.2s, box-shadow 0.2s;
}
.login-btn:hover {
  background: linear-gradient(90deg, #4338ca 40%, #a21caf 100%);
  box-shadow: 0 6px 16px #818cf860;
}
.err {
  color: #e11d48;
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
  letter-spacing: 1px;
}
</style>