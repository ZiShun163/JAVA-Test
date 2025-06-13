<template>
  <div class="panel">
    <h2>图库管理</h2>
    <div style="margin-bottom:12px;">
      <input v-model="search.name" placeholder="图片名称" style="padding:4px 8px; width:110px;" />
      <input v-model="search.category" placeholder="类别" style="padding:4px 8px; width:110px;" />
      <button @click="clearSearch" style="margin-left:8px;">清空</button>
      <button @click="openAdd" style="float:right;">上传图片</button>
      <button @click="showCatForm = true;" style="float:right; margin-right:8px;">类别管理</button>
    </div>
    <table>
      <thead>
        <tr>
          <th>图片名</th>
          <th>类别</th>
          <th>图片</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredGallery" :key="item.id">
          <td v-if="editId !== item.id">{{ item.name }}</td>
          <td v-else><input v-model="form.name" /></td>
          <td v-if="editId !== item.id">{{ item.category }}</td>
          <td v-else>
            <select v-model="form.category" required>
              <option value="" disabled>请选择类别</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </td>
          <td>
            <img v-if="item.url" :src="item.url" alt="" style="width:60px" />
            <span v-else style="color:#888;">无图</span>
            <div v-if="editId === item.id" style="margin-top:5px;">
              <input type="file" @change="onFile" />
            </div>
          </td>
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
        <tr v-if="filteredGallery.length === 0">
          <td colspan="4" style="text-align:center;color:#888;">无匹配图片</td>
        </tr>
      </tbody>
    </table>
    <!-- 上传图片弹窗 -->
    <div v-if="showForm" class="modal">
      <form @submit.prevent="save">
        <h3>上传图片</h3>
        <input v-model="form.name" placeholder="图片名" required />
        <select v-model="form.category" required>
          <option value="" disabled>请选择类别</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
        </select>
        <input type="file" @change="onFile" />
        <div v-if="form.url" style="margin:10px 0;">
          <img :src="form.url" alt="" style="width:80px;" />
        </div>
        <button type="submit">保存</button>
        <button type="button" @click="showForm=false">取消</button>
      </form>
    </div>

    <!-- 图片类别管理弹窗 -->
    <div v-if="showCatForm" class="modal">
      <div style="background:#fff;padding:20px;border-radius:8px;min-width:300px;">
        <h3>图片类别管理</h3>
        <input v-model="catSearch" placeholder="查找类别" style="padding:4px 8px; width:110px;" />
        <button @click="catSearch=''" style="margin-left:6px;">清空</button>
        <ul style="margin:10px 0 0 0;padding:0;list-style:none;">
          <li v-for="cat in filteredCategories" :key="cat.id" style="margin-bottom:8px;">
            <template v-if="catEditId !== cat.id">
              {{cat.name}}
              <button style="margin-left:8px;" @click="openCatEdit(cat)">编辑</button>
              <button @click="delCat(cat.id)">删除</button>
            </template>
            <template v-else>
              <input v-model="catForm.name" style="width:90px;" />
              <button @click="saveCat">保存</button>
              <button @click="cancelCatEdit">取消</button>
            </template>
          </li>
        </ul>
        <div style="margin-top:16px;">
          <input v-model="catForm.name" placeholder="新增类别" style="width:120px;" />
          <button @click="addCat">添加</button>
        </div>
        <div style="text-align:right;margin-top:12px;">
          <button @click="showCatForm=false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const GALLERY_KEY = 'galleryList'
const CATEGORY_KEY = 'galleryCategoryList'

export default {
  data() {
    return {
      gallery: [],
      categories: [],
      search: {
        name: '',
        category: ''
      },
      showForm: false,
      form: {},
      editId: null,
      showCatForm: false,
      catForm: { name: '' },
      catEditId: null,
      catSearch: ''
    }
  },
  computed: {
    filteredGallery() {
      return this.gallery.filter(item => {
        if (this.search.name && !item.name.toLowerCase().includes(this.search.name.trim().toLowerCase())) {
          return false
        }
        if (this.search.category && !item.category.toLowerCase().includes(this.search.category.trim().toLowerCase())) {
          return false
        }
        return true
      })
    },
    filteredCategories() {
      if (!this.catSearch.trim()) return this.categories
      const kw = this.catSearch.trim().toLowerCase()
      return this.categories.filter(c => c.name.toLowerCase().includes(kw))
    }
  },
  created() {
    this.loadCategories()
    const local = localStorage.getItem(GALLERY_KEY)
    if (local) {
      this.gallery = JSON.parse(local)
    } else {
      this.gallery = [
        {id:1, name:'商品图例', category:'手机', url:''}
      ]
      localStorage.setItem(GALLERY_KEY, JSON.stringify(this.gallery))
    }
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    persist() {
      localStorage.setItem(GALLERY_KEY, JSON.stringify(this.gallery))
    },
    loadCategories() {
      const cats = localStorage.getItem(CATEGORY_KEY)
      if (cats) {
        this.categories = JSON.parse(cats)
      } else {
        this.categories = [
          {id:1, name:'手机'},
          {id:2, name:'食品'}
        ]
        localStorage.setItem(CATEGORY_KEY, JSON.stringify(this.categories))
      }
    },
    handleStorageChange(e) {
      if (e.key === CATEGORY_KEY) {
        this.loadCategories()
      }
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
      if (!this.form.name || !this.form.category) {
        alert('请填写完整信息')
        return
      }
      if (this.editId) {
        const idx = this.gallery.findIndex(g => g.id === this.editId)
        if (idx !== -1) {
          this.gallery[idx] = {...this.form, id: this.editId}
        }
        this.editId = null
        this.form = {}
        this.persist()
      } else {
        this.gallery.push({...this.form, id: Date.now()})
        this.showForm = false
        this.form = {}
        this.persist()
      }
    },
    del(id) {
      this.gallery = this.gallery.filter(g => g.id !== id)
      this.persist()
    },
    cancelEdit() {
      this.editId = null
      this.form = {}
    },
    clearSearch() {
      this.search = { name: '', category: '' }
    },
    onFile(e) {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (ev) => {
          this.form.url = ev.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    // 类别管理
    openCatEdit(cat) {
      this.catEditId = cat.id
      this.catForm = {...cat}
    },
    saveCat() {
      if (!this.catForm.name || !this.catForm.name.trim()) {
        alert('类别名不能为空')
        return
      }
      // 重名检查
      if (this.categories.some(c => c.name === this.catForm.name && (this.catEditId ? c.id !== this.catEditId : true))) {
        alert('类别名已存在')
        return
      }
      if (this.catEditId) {
        const idx = this.categories.findIndex(c => c.id === this.catEditId)
        if (idx !== -1) {
          const oldName = this.categories[idx].name
          this.categories[idx] = {...this.catForm, id: this.catEditId}
          // 同步修改图片类别
          this.gallery.forEach(g => {
            if (g.category === oldName) {
              g.category = this.catForm.name
            }
          })
          this.persist()
        }
        this.catEditId = null
        this.catForm = {name: ''}
        this.saveCategories()
      }
    },
    addCat() {
      if (!this.catForm.name || !this.catForm.name.trim()) {
        alert('类别名不能为空')
        return
      }
      if (this.categories.some(c => c.name === this.catForm.name)) {
        alert('类别名已存在')
        return
      }
      this.categories.push({id: Date.now(), name: this.catForm.name})
      this.saveCategories()
      this.catForm = {name: ''}
    },
    delCat(id) {
      const cat = this.categories.find(c => c.id === id)
      if (!cat) return
      // 删除该类别下图片的类别字段
      this.gallery.forEach(g => {
        if (g.category === cat.name) g.category = ''
      })
      this.categories = this.categories.filter(c => c.id !== id)
      this.saveCategories()
      this.persist()
    },
    saveCategories() {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(this.categories))
      // 通知其它页面更新
      window.dispatchEvent(new Event('storage'))
    },
    cancelCatEdit() {
      this.catEditId = null
      this.catForm = {name: ''}
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