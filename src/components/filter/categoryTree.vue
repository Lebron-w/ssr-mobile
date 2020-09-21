<!--
 * @Description: category筛选项组件
 * @Author: 陈正云
 * @Date: 2020-05-27 14:39:52
 * @LastEditors: 陈正云
 * @LastEditTime: 2020-06-04 19:55:31
-->
<template>
  <div>
    <template v-for="category in sortCategorys">
      <category-tree-node :key="category.id" :level="category.level" :categorys="category"
        :expandNode="currentExpandNode" :categoryTree="categoryTree"
        @nodeExpand="nodeExpand" @chooseCategory="chooseCategory"/>
    </template>
  </div>
</template>

<script>
import CategoryTreeNode from './categoryTreeNode'
export default {
  name: 'CategoryTree',
  components: {
    CategoryTreeNode
  },
  computed: {
    // 没有子分类的需要放前面，所以进行顺序调整
    sortCategorys () {
      let _sortCategorys = JSON.parse(JSON.stringify(this.categorys))
      const _haveChildren = _sortCategorys.filter(category => {
        return category.children.length > 0
      })
      _sortCategorys.forEach(category => {
        const _viewAllCategory = {
          level: category.level,
          id: category.id,
          children: [],
          pid: category.pid,
          name: category.name,
          url_name: category.url_name
        }
        if (category.children.length > 0) {
          if (category.children[0].id !== _viewAllCategory.id) category.children.unshift(_viewAllCategory)
        } else {
          if (_haveChildren.length > 0 && this.level + 1 === category.level) category.children.unshift(_viewAllCategory)
        }
      })
      _sortCategorys = [..._sortCategorys]
      return _sortCategorys
    },
    level () {
      return this.categorys[0].level - 1
    }
  },
  data () {
    return {
      currentExpandNode: {}
    }
  },
  props: {
    categorys: {
      type: Array,
      default: () => []
    },
    categoryTree: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 子分类折叠活展开
    nodeExpand (categorys) {
      if (categorys.id === this.currentExpandNode.id) {
        this.currentExpandNode = {}
        return false
      }
      this.currentExpandNode = categorys
    },
    // 选择 category 触发
    chooseCategory (_categoryTree) {
      this.$emit('chooseCategory', _categoryTree)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
