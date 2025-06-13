<template>
  <div class="panel">
    <h2>用户管理</h2>
    <div style="margin-bottom: 12px;">
      <input v-model="search.username" placeholder="用户名" style="padding:4px 8px; width:110px;" />
      <input v-model="search.email" placeholder="邮箱" style="padding:4px 8px; width:140px;" />
      <button @click="clearSearch" style="margin-left:8px;">清空</button>
      <button @click="openAdd" style="float:right;">注册用户</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>用户名</th>
          <th>邮箱</th>
          <th>密码</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredUsers" :key="item.id">
          <td v-if="editId !== item.id">{{ item.username }}</td>
          <td v-else><input v-model="form.username" required /></td>
          <td v-if="editId !== item.id">{{ item.email }}</td>
          <td v-else><input v-model="form.email" required /></td>
          <!-- 密码直接显示为明文 -->
          <td v-if="editId !== item.id">{{ item.password }}</td>
          <td v-else>
            <input v-model="form.password" required />
          </td>
          <td>
            <template v-if="editId !== item.id">
              <button @click="openEdit(item)">编辑</button>
              <button @click="del(item.id)">删除</button>
              <button @click="showDetail(item)">查看</button>
              <button @click="openChangePwd(item)">改密码</button>
            </template>
            <template v-else>
              <button @click="save">保存</button>
              <button @click="cancelEdit">取消</button>
            </template>
          </td>
        </tr>
        <tr v-if="filteredUsers.length === 0">
          <td colspan="4" style="text-align:center;color:#888;">无匹配用户</td>
        </tr>
      </tbody>
    </table>

    <!-- 注册/编辑用户弹窗 -->
    <div v-if="showForm" class="modal">
      <form @submit.prevent="save">
        <h3>{{ editId ? '编辑用户' : '注册用户' }}</h3>
        <input v-model="form.username" placeholder="用户名" required />
        <input v-model="form.email" placeholder="邮箱" required type="email" />
        <input v-model="form.password" placeholder="密码" required />
        <button type="submit">保存</button>
        <button type="button" @click="showForm=false">取消</button>
      </form>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPwdForm" class="modal">
      <form @submit.prevent="savePwd">
        <h3>修改密码</h3>
        <input v-model="pwdForm.oldPwd" type="password" placeholder="原密码" required />
        <input v-model="pwdForm.newPwd" type="password" placeholder="新密码" required />
        <button type="submit">保存</button>
        <button type="button" @click="showPwdForm=false">取消</button>
      </form>
    </div>

    <!-- 个人信息弹窗 -->
    <div v-if="showDetailForm" class="modal">
      <div style="background:#fff;padding:20px;border-radius:8px;min-width:250px;">
        <h3>个人信息</h3>
        <p>用户名：{{detailUser.username}}</p>
        <p>邮箱：{{detailUser.email}}</p>
        <p>密码：{{detailUser.password}}</p>
        <button @click="showDetailForm=false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'userList'

export default {
  data() {
    return {
      users: [],
      search: {
        username: '',
        email: ''
      },
      showForm: false,
      form: {},
      editId: null,
      showPwdForm: false,
      pwdForm: {
        id: null,
        oldPwd: '',
        newPwd: ''
      },
      showDetailForm: false,
      detailUser: {}
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(item => {
        if (this.search.username && !item.username.toLowerCase().includes(this.search.username.trim().toLowerCase())) {
          return false
        }
        if (this.search.email && !item.email.toLowerCase().includes(this.search.email.trim().toLowerCase())) {
          return false
        }
        return true
      })
    }
  },
  created() {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      this.users = JSON.parse(local)
    } else {
      this.users = [
        {id:1, username:'admin', email:'admin@mail.com', password:'admin'}
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users))
    }
  },
  methods: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users))
    },
    openAdd() {
      this.form = {}
      this.showForm = true
      this.editId = null
    },
    openEdit(item) {
      this.form = {...item}
      this.editId = item.id
      this.showForm = true
    },
    save() {
      if (!this.form.username || !this.form.email || !this.form.password) {
        alert('用户名、邮箱、密码必填')
        return
      }
      // 检查用户名唯一
      if (this.users.some(u => u.username === this.form.username && (!this.editId || u.id !== this.editId))) {
        alert('用户名已存在')
        return
      }
      if (this.editId) {
        // 编辑
        const idx = this.users.findIndex(u => u.id === this.editId)
        if (idx !== -1) {
          this.users[idx] = {...this.form, id: this.editId}
        }
        this.editId = null
        this.form = {}
        this.showForm = false
        this.persist()
      } else {
        // 新增
        this.users.push({...this.form, id: Date.now()})
        this.showForm = false
        this.form = {}
        this.persist()
      }
    },
    del(id) {
      this.users = this.users.filter(u => u.id !== id)
      this.persist()
    },
    cancelEdit() {
      this.editId = null
      this.form = {}
      this.showForm = false
    },
    clearSearch() {
      this.search = {
        username: '',
        email: ''
      }
    },
    openChangePwd(user) {
      this.pwdForm = {
        id: user.id,
        oldPwd: '',
        newPwd: ''
      }
      this.showPwdForm = true
    },
    savePwd() {
      if (!this.pwdForm.oldPwd || !this.pwdForm.newPwd) {
        alert('请填写完整')
        return
      }
      const user = this.users.find(u => u.id === this.pwdForm.id)
      if (!user) {
        alert('用户不存在')
        return
      }
      if (user.password !== this.pwdForm.oldPwd) {
        alert('原密码错误')
        return
      }
      user.password = this.pwdForm.newPwd
      this.persist()
      this.showPwdForm = false
      this.pwdForm = {id:null, oldPwd:'', newPwd:''}
      alert('密码修改成功')
    },
    showDetail(user) {
      this.detailUser = {...user}
      this.showDetailForm = true
    }
  }
}
</script>

<style>
.panel { padding: 24px; }
table { width: 100%; border-collapse: collapse; margin-top: 10px; }
th, td { border: 1px solid #ccc; padding: 8px; }
button { margin-right: 6px; }
.modal {
  position: fixed; top: 0; left: 0; right:0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal form {
  background: #fff; padding: 20px; border-radius: 8px; min-width: 250px;
}
</style>