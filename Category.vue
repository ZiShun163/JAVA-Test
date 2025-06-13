<template>
  <div class="panel">
    <h2>商品分类管理</h2>
    <div style="margin-bottom: 12px;">
      <input v-model="searchName" placeholder="分类名搜索" style="padding:4px 8px; width:120px;" />
      <button @click="clearSearch" style="margin-left:8px;">清空</button>
      <button @click="openAdd" style="float:right;">添加分类</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>分类名</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredCategories" :key="item.id">
          <td v-if="editId !== item.id">{{ item.name }}</td>
          <td v-else><input v-model="form.name" required /></td>
          <td>
            <template v-if="editId !== item.id">
              <button @click="openEdit(item)">编辑</button>
              <button @click="del(item.id)">删除</button>
            </template>
            <template v-else>
              <button @click="save">保存</button>
              <button @click="cancelEdit">取消</button>
            </template>
          </td>
        </tr>
        <tr v-if="filteredCategories.length === 0">
          <td colspan="2" style="text-align:center;color:#888;">无匹配分类</td>
        </tr>
      </tbody>
    </table>
    <!-- 添加分类弹窗 -->
    <div v-if="showForm" class="modal">
      <form @submit.prevent="save">
        <h3>添加分类</h3>
        <input v-model="form.name" placeholder="分类名" required />
        <button type="submit">保存</button>
        <button type="button" @click="showForm=false">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'categoryList'

// 同步商品分类到商品管理页面
function syncCategoryToGoods(categories) {
  // goodsList 也要跟分类同步
  const goodsKey = 'goodsList'
  let goods = []
  try {
    goods = JSON.parse(localStorage.getItem(goodsKey) || '[]')
  } catch (e) {}
  // 清理不存在的分类
  goods.forEach(g => {
    if (g.category && !categories.find(c => c.name === g.category)) {
      g.category = ''
    }
  })
  localStorage.setItem(goodsKey, JSON.stringify(goods))
}

export default {
  data() {
    return {
      categories: [],
      searchName: '',
      showForm: false,
      form: {},
      editId: null
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchName.trim()) return this.categories
      const kw = this.searchName.trim().toLowerCase()
      return this.categories.filter(item => item.name.toLowerCase().includes(kw))
    }
  },
  created() {
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      this.categories = JSON.parse(local)
    } else {
      this.categories = [
        {id:1, name:'电子'},
        {id:2, name:'食品'}
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories))
    }
    syncCategoryToGoods(this.categories)
  },
  methods: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.categories))
      syncCategoryToGoods(this.categories)
    },
    openAdd() {
      this.form = {}
      this.showForm = true
      this.editId = null
    },
    openEdit(item) {
      this.form = {...item}
      this.editId = item.id
    },
    save() {
      if (!this.form.name || !this.form.name.trim()) {
        alert('分类名不能为空')
        return
      }
      // 检查重名
      if (
        this.categories.some(
          c =>
            c.name === this.form.name &&
            (this.editId ? c.id !== this.editId : true)
        )
      ) {
        alert('分类名已存在')
        return
      }
      if (this.editId) {
        // 编辑
        const idx = this.categories.findIndex(c => c.id === this.editId)
        if (idx !== -1) {
          this.categories[idx] = {...this.form, id: this.editId}
        }
        this.editId = null
        this.form = {}
        this.persist()
      } else {
        // 新增
        this.categories.push({...this.form, id: Date.now()})
        this.showForm = false
        this.form = {}
        this.persist()
      }
    },
    del(id) {
      // 删除时同步将goods中属于该分类的商品分类字段置空
      const cate = this.categories.find(c => c.id === id)
      this.categories = this.categories.filter(c => c.id !== id)
      this.persist()
      if (cate) {
        const goodsKey = 'goodsList'
        let goods = []
        try {
          goods = JSON.parse(localStorage.getItem(goodsKey) || '[]')
        } catch (e) {}
        goods.forEach(g => {
          if (g.category === cate.name) {
            g.category = ''
          }
        })
        localStorage.setItem(goodsKey, JSON.stringify(goods))
      }
    },
    cancelEdit() {
      this.editId = null
      this.form = {}
    },
    clearSearch() {
      this.searchName = ''
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
}
.modal form {
  background: #fff; padding: 20px; border-radius: 8px; min-width: 250px;
}
</style>