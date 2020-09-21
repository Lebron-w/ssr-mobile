<!--
 * @Description: category 递归组件，支持多层级
 * @Author: 陈正云
 * @Date: 2020-05-27 14:39:52
 * @LastEditors: 陈正云
 * @LastEditTime: 2020-06-04 19:41:40
-->
<template>
  <div :class="{'category-inline': sortCategorys.length === 0}">
    <ul class="category-tree">
      <li role="button" :aria-label="categoryTree[level] && categoryTree[level].id === categorys.id ? categorys.name + ' selected' : 'selected ' + categorys.name">
        <!-- 有子分类，则展示可折叠组件 -->
        <div class="category-title" :class="{'actived': categoryTree[level] && categoryTree[level].id === categorys.id}" v-if="sortCategorys.length > 0" @click="handleExpand(categorys)">
          <span>{{categorys.name}}</span>
          <span class="icon">{{expandNode.id === categorys.id ? '-' : '+'}}</span>
        </div>
        <!-- 无子分类，则直接展示分类名 -->
        <span class="category-node" :class="{'selected': categoryTree[level] && categoryTree[level].id === categorys.id}" v-else
          @click="selectCategory(categorys)">
          <template v-if="level - 1 === categorys.level">{{$t("product.category.view_all")}}</template>
          <template v-else>{{categorys.name}}</template>
        </span>
        <!-- 有子分类，进行组件递归 -->
        <template v-if="sortCategorys.length > 0">
          <template v-for="category in sortCategorys">
            <category-tree-node :level="level + 1" v-show="expandNode.id === categorys.id"
              :key="level + category.id" :categorys="category" :expandNode="currentExpandNode" :categoryTree="categoryTree"
              @chooseCategory="chooseCategory" @nodeExpand="nodeExpand" />
          </template>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategoryTreeNode',
  data () {
    return {
      currentExpandNode: {}
    }
  },
  props: {
    categorys: {
      type: Object,
      default: () => {}
    },
    level: {
      type: Number,
      default: 0
    },
    expandNode: {
      type: Object,
      default: () => {}
    },
    categoryTree: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 没有子分类的需要放前面，所以进行顺序调整
    sortCategorys () {
      const _sortCategorys = JSON.parse(JSON.stringify(this.categorys.children))

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

      return _sortCategorys
    }
  },
  methods: {
    // 层级展开收起点击
    handleExpand (categorys) {
      this.$emit('nodeExpand', categorys)
    },
    // 事件传递触发
    nodeExpand (categorys) {
      if (categorys.id === this.currentExpandNode.id) {
        this.currentExpandNode = {}
        return false
      }
      this.currentExpandNode = categorys
    },
    // category 点击触发
    selectCategory (category) {
      const _categoryTree = {}
      if (!(this.categoryTree[this.level] && this.categoryTree[this.level].id === category.id)) {
        _categoryTree[this.level] = category
      }
      this.$emit('chooseCategory', _categoryTree)
    },
    // 由子组件事件传递触发
    chooseCategory (_categoryTree) {
      if (Object.keys(_categoryTree).length > 0) {
        _categoryTree[this.level] = this.categorys
      }
      this.$emit('chooseCategory', _categoryTree)
    }
  }
}
</script>

<style lang="less" scoped>
.category-inline {
  display: inline-block;
  .category-tree {
    padding-left: 0;
  }
}
.category-tree {
  padding-left: 10px;
  .category-title {
    height: 35px;
    line-height: 35px;
    font-size: 14px;
    color: #454545;
    span {
      font-family: 'patpat-Medium';
    }
    .icon {
      float: right;
      font-size: 20px;
    }
    &.actived {
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #F2425B;
        left: -8px;
        top: 15px;
      }
    }
  }
  .category-node {
    display: inline-block;
    height: 45px;
    padding: 0 15px;
    line-height: 45px;
    background: #fafafa;
    border-radius: 4px;
    margin: 0 15px 12px 0;
    font-size: 12px;
    color: #454545;
    min-width: 75px;
    text-align: center;
    &.selected {
      background: #FEE3E7;
      color: #F2435C;
    }
  }
}

#country-ar {
  .category-title {
    &.actived{
      &::before {
        right: -8px;
        left: auto;
      }
    }
  }
}
</style>
