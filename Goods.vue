<template>
  <div class="panel">
    <h2>商品管理</h2>
    <div style="margin-bottom: 12px;">
      <input v-model="search.name" placeholder="商品名称" style="padding:4px 8px;width:110px;" />
      <input v-model="search.category" placeholder="分类" style="padding:4px 8px;width:90px;" />
      <input v-model="search.brand" placeholder="品牌" style="padding:4px 8px;width:90px;" />
      <input v-model="search.attribute" placeholder="属性" style="padding:4px 8px;width:90px;" />
      <input v-model="search.priceMin" type="number" placeholder="最低价" style="padding:4px 8px;width:70px;" />
      <input v-model="search.priceMax" type="number" placeholder="最高价" style="padding:4px 8px;width:70px;" />
      <button @click="clearSearch" style="margin-left:8px;">清空</button>
      <button @click="openAdd" style="float:right;">添加商品</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>价格</th>
          <th>分类</th>
          <th>品牌</th>
          <th>属性</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredGoods" :key="item.id">
          <td v-if="editId !== item.id">{{ item.name }}</td>
          <td v-else><input v-model="form.name" /></td>

          <td v-if="editId !== item.id">{{ item.price }}</td>
          <td v-else><input v-model="form.price" /></td>

          <td v-if="editId !== item.id">{{ item.category }}</td>
          <td v-else>
            <select v-model="form.category" required>
              <option value="" disabled>请选择分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </td>

          <td v-if="editId !== item.id">{{ item.brand }}</td>
          <td v-else><input v-model="form.brand" /></td>

          <td v-if="editId !== item.id">{{ item.attribute }}</td>
          <td v-else><input v-model="form.attribute" /></td>
          
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
        <tr v-if="filteredGoods.length === 0">
          <td colspan="6" style="text-align:center;color:#888;">无匹配商品</td>
        </tr>
      </tbody>
    </table>
    <!-- 添加商品弹窗 -->
    <div v-if="showForm" class="modal">
      <form @submit.prevent="save">
        <h3>添加商品</h3>
        <input v-model="form.name" placeholder="名称" required />
        <input v-model="form.price" placeholder="价格" required />
        <select v-model="form.category" required>
          <option value="" disabled>请选择分类</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
        </select>
        <input v-model="form.brand" placeholder="品牌" />
        <input v-model="form.attribute" placeholder="属性" />
        <button type="submit">保存</button>
        <button type="button" @click="showForm=false">取消</button>
      </form>
    </div>
  </div>
</template>

<script>
const STORAGE_KEY = 'goodsList'
const CATEGORY_KEY = 'categoryList'

export default {
  data() {
    return {
      goods: [],
      categories: [],
      search: {
        name: '',
        category: '',
        brand: '',
        attribute: '',
        priceMin: '',
        priceMax: ''
      },
      showForm: false,
      form: {},
      editId: null
    }
  },
  computed: {
    filteredGoods() {
      return this.goods.filter(item => {
        if (this.search.name && !item.name.toLowerCase().includes(this.search.name.trim().toLowerCase())) {
          return false
        }
        if (this.search.category && !item.category.toLowerCase().includes(this.search.category.trim().toLowerCase())) {
          return false
        }
        if (this.search.brand && !item.brand.toLowerCase().includes(this.search.brand.trim().toLowerCase())) {
          return false
        }
        if (this.search.attribute && !item.attribute.toLowerCase().includes(this.search.attribute.trim().toLowerCase())) {
          return false
        }
        const price = Number(item.price)
        if (this.search.priceMin !== '' && price < Number(this.search.priceMin)) {
          return false
        }
        if (this.search.priceMax !== '' && price > Number(this.search.priceMax)) {
          return false
        }
        return true
      })
    }
  },
  created() {
    this.loadCategories()
    const local = localStorage.getItem(STORAGE_KEY)
    if (local) {
      this.goods = JSON.parse(local)
    } else {
      this.goods = [
        {id:1, name:'手机', price:1999, category:'电子', brand:'华为', attribute:'5G'},
        {id:2, name:'牛奶', price:19, category:'食品', brand:'蒙牛', attribute:'纯牛奶'}
      ]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.goods))
    }
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.goods))
    },
    loadCategories() {
      const cats = localStorage.getItem(CATEGORY_KEY)
      if (cats) {
        this.categories = JSON.parse(cats)
      } else {
        this.categories = [
          {id:1, name:'电子'},
          {id:2, name:'食品'}
        ]
        localStorage.setItem(CATEGORY_KEY, JSON.stringify(this.categories))
      }
    },
    handleStorageChange(e) {
      // 监听本地存储变化，实现分类和商品管理页面联动
      if (e.key === CATEGORY_KEY) {
        this.loadCategories()
      }
    },
    openAdd() {
      this.form = {}
      this.showForm = true
    },
    openEdit(item) {
      this.editId = item.id
      this.form = {...item}
    },
    save() {
      if (!this.form.category) {
        alert('请选择分类')
        return
      }
      if (this.editId) {
        const idx = this.goods.findIndex(g => g.id === this.editId)
        if (idx !== -1) {
          this.goods[idx] = {...this.form, id: this.editId}
        }
        this.editId = null
        this.form = {}
        this.persist()
      } else {
        this.goods.push({...this.form, id: Date.now()})
        this.showForm = false
        this.form = {}
        this.persist()
      }
    },
    del(id) {
      this.goods = this.goods.filter(g => g.id !== id)
      this.persist()
    },
    cancelEdit() {
      this.editId = null
      this.form = {}
    },
    clearSearch() {
      this.search = {
        name: '',
        category: '',
        brand: '',
        attribute: '',
        priceMin: '',
        priceMax: ''
      }
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