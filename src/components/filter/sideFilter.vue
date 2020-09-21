<!--
 * @Description: 筛选侧边子组件
 * @Author: zhengyun.chen
 * @Date: 2020-07-30 15:24:07
 * @Last Modified by: zhengyun.chen
 * @Last Modified time: 2020-08-04 20:00:54
 * @FilePath: /website-ssr-mobile/src/components/filter/sideFilter.vue
-->

<template>
  <div class="filter-wrap">
    <div class="filter-content">
      <div class="filter-header">
        <h3>{{$t('product.category.filter')}}</h3>
        <button class="close-filter" aria-label="close the overlay" @click="close">
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="popup-close">
            <line x1="0" y1="0" x2="10" y2="10"></line>
            <line x1="10" y1="0" x2="0" y2="10"></line>
          </svg>
        </button>
      </div>
      <div class="filter-body">
        <template v-for="filter in sortFilters">
          <div v-if="(filter.children && filter.children.length > 0) || (filter.values && filter.values.length > 0) || filter.key === 'Price'" :key="filter.key" class="filter-item" :class="{'expand': expand[filter.key]}">
            <button class="filter-top" @click="expandFliter(filter.key)" type="button" aria-haspopup="true" :aria-expanded="expand[filter.key] ? true : false + ''">
              <h4>
                <template v-if="filter.key === 'Category'">
                  <span class="title">{{$t('product.category.category')}}</span>
                  <span class="filter-string">{{chooseTypeString}}</span>
                </template>
                <template v-else-if="filter.key === 'Price'">
                  <span class="title">{{$t('product.category.price')}}</span>
                  <span class="filter-string">{{selectFilter[`${filter.key}String`]}}</span>
                </template>
                <template v-else>
                  <span class="title">{{filter.name}}</span>
                  <span class="filter-string">{{selectFilter[`${filter.key}String`]}}</span>
                </template>
              </h4>
              <svg width="8" height="4" xmlns="http://www.w3.org/2000/svg" version="1.1" class="arrow-down">
                <polyline points="0,0 4,4 8,0"/>
              </svg>
            </button>
            <div class="filter-item-content" v-show="expand[filter.key]">
              <!-- 季节 款式 性别 风格 筛选项 -->
              <template v-if="filter.key === 'Gender' || filter.key === 'Style' || filter.key === 'Season' || filter.key === 'Occasion'">
                <ul class="filter-list">
                  <li v-for="item in filter.values"
                    :class="{'selected': selectFilter[filter.key].includes(item.id)}"
                    :key="item.id"
                    @click="chooseFilter(item, filter.key)"
                    role="button"
                    :aria-label="selectFilter[filter.key].includes(item.id) ? item.value + ' selected' : 'selected ' + item.value">
                    {{item.value}}
                  </li>
                </ul>
              </template>
              <!-- size 筛选项 -->
              <template v-if="filter.key === 'Size'">
                <ul class="size-list">
                  <template v-for="(size, index) in filter.values">
                    <li v-if="index < showAll[filter.key]"
                      :class="{'selected': selectFilter[filter.key].includes(size.id)}"
                      :key="size.id" @click="chooseFilter(size, filter.key)"
                      role="button"
                      :aria-label="selectFilter[filter.key].includes(size.id) ? size.value + ' selected' : 'selected ' + size.value">
                      {{size.value}}
                    </li>
                  </template>
                  <li role="button" v-if="filter.values.length > showAll[filter.key]" :key="filter.key" class="show-more" @click="showMore(filter)">{{$t('product.detail.show_more')}}</li>
                </ul>
              </template>
              <!-- color 筛选项 -->
              <template v-if="filter.key === 'Color'">
                <ul :class="[isEn ? 'color-list-en' :'color-list']">
                  <template v-for="(color, index) in filter.values">
                    <li v-if="index < showAll[filter.key]"
                      :class="[selectFilter[filter.key].includes(color.id) ? `${color.value_en} selected` : `${color.value_en}`]"
                      :key="color.id"
                      role="button"
                      :aria-label="selectFilter[filter.key].includes(color.id) ? color.value + ' selected' : 'selected ' + color.value"
                      @click="chooseFilter(color, filter.key)">
                      <span class="color"></span><span>{{color.value}}</span>
                    </li>
                  </template>
                  <li v-if="filter.values.length > showAll[filter.key]" :key="filter.key" class="show-more" @click="showMore(filter)">{{$t('product.detail.show_more')}}</li>
                </ul>
              </template>
              <!-- category 筛选项 -->
              <template v-if="filter.key === 'Category'">
                <category-tree :categorys="filter.children" :key='filter.key' :categoryTree="categoryTree" @chooseCategory="chooseCategory" />
              </template>
              <template v-if="filter.key === 'Price'">
                <!-- 价格筛选项 -->
                <div class="price-wrap">
                  <div class="price-range">
                    <span class="min">{{showMinPrice}}</span>
                    <span class="max">{{showMaxPrice}}</span>
                  </div>
                  <div class="slider-wrap">
                    <vue-slider
                      v-model="priceRange"
                      :tooltip="'none'"
                      :max="vueSliderMax"
                      :reverse="vueSliderReverse"
                      :direction="vueSliderReverse ? 'rtl' : 'ltr'"
                      :speed='0'
                      :order="false"
                      :height="2"
                      :dotSize="20"
                      :processStyle="processStyle" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="filter-footer">
        <!-- 重置按钮 -->
        <button class="reset-sort" @click.stop="resetFilter" tabindex="0" role="button">{{$t('product.category.reset')}}</button>
        <!-- 确定按钮 -->
        <button class="apply-sort" @click.stop="apply" tabindex="0" role="button">{{$t('product.category.apply')}}</button>
      </div>
    </div>
    <div class="filter-overlay" @click="close" @touchmove="layerTouceMove"></div>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min'
import 'vue-slider-component/dist-css/vue-slider-component.css'
import 'vue-slider-component/theme/default.css'
import CategoryTree from './categoryTree'
import trackChildren from '@/mixins/trackChildren.js'

export default {
  name: 'SideFilter',
  mixins: [trackChildren],
  components: {
    CategoryTree, vueSlider
  },
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    selectFilter: {
      type: Object,
      default: () => {}
    },
    categoryTree: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 是否英语，英语和非英语样式有区别
    isEn () {
      return this.$store.state.langCode === 'en'
    },
    // 滑块是否需要反向
    vueSliderReverse () {
      return this.$store.state.langCode === 'ar'
    },
    // 价格范围
    priceRange: {
      get: function () {
        const _priceFilter = this.priceFilter
        const _min = _priceFilter.priceRange[0] ? Math.ceil(this.$l10nCurrency.currency.utsExchangeRate * _priceFilter.priceRange[0]) : 0
        let _max = _priceFilter.priceRange[1] ? Math.ceil(this.$l10nCurrency.currency.utsExchangeRate * _priceFilter.priceRange[1]) : this.vueSliderMax
        _max = _max >= this.vueSliderMax ? this.vueSliderMax : _max
        return [_min, _max]
      },
      set: function (nVal) {
        const nPriceRange = [this.$stuo(nVal[0]), this.$stuo(nVal[1]) >= 100 ? 100 : this.$stuo(nVal[1])]
        this.$emit('setPriceRange', nPriceRange)
      }
    },
    sortFilters () {
      const allFilters = JSON.parse(JSON.stringify(this.filters))
      const sortFilters = []
      const _sortKey = ['Gender', 'Color', 'Size', 'Category', 'Style', 'Season', 'Occasion', 'Price']
      _sortKey.forEach(key => {
        const _idx = allFilters.findIndex(codition => {
          return codition.key === key
        })
        if (_idx > -1) {
          sortFilters.push(allFilters[_idx])
        }
      })
      return sortFilters
    },
    // 当前选中分类名称
    chooseTypeString () {
      let _chooseTypeString = ''
      const compare = (x, y) => {
        if (x < y) {
          return -1
        } else if (x > y) {
          return 1
        } else {
          return 0
        }
      }
      let _levels = Object.keys(this.categoryTree)
      _levels = _levels.sort(compare)
      if (_levels.length > 0) {
        _chooseTypeString = this.categoryTree[_levels[_levels.length - 1]].name
      }
      return _chooseTypeString
    },
    priceFilter () {
      const priceFilter = this.sortFilters.filter(filter => {
        return filter.key === 'Price'
      })
      return priceFilter[0]
    },
    // 滑块可用最大值
    vueSliderMax () {
      return Math.ceil(this.$l10nCurrency.currency.utsExchangeRate * 100)
    },
    // 用于展示的当前价格范围最小价格
    showMinPrice () {
      return this.$l10nCurrency.currency.symbolDisplay + Math.ceil(this.priceRange[0])
    },
    // 用于展示的当前价格范围最大价格
    showMaxPrice () {
      return this.$l10nCurrency.currency.symbolDisplay + Math.ceil(this.priceRange[1])
    }
  },
  data () {
    return {
      expand: {
        Gender: true,
        Color: true,
        Size: true,
        Category: false,
        Style: false,
        Season: false,
        Occasion: false,
        Price: false
      },
      showAll: {
        Color: 5,
        Size: 5
      },
      processStyle: {
        background: '#454445'
      }
    }
  },
  methods: {
    // 关闭按钮点击，或者遮罩层点击 关闭筛选侧边
    close () {
      this.$emit('close')
    },
    // 展开筛选项
    expandFliter (key) {
      const name = key
      let trackName = `filter_open_${name}`
      if (this.expand[key]) {
        trackName = `filter_close_${name}`
      }
      this.appendClickTrackData(trackName)
      this.expand[key] = !this.expand[key]
    },
    // size 和 color 的show more点击
    showMore (filter) {
      this.appendClickTrackData(`click_${filter.key}_show_more`)
      this.showAll[filter.key] = filter.values.length
    },
    // 选择category
    chooseCategory (categoryTree) {
      this.$emit('setCategoryTree', categoryTree)
    },
    // 可用筛选项点击
    chooseFilter (filter, type) {
      this.$emit('chooseFilter', type, filter)
    },
    // 重置筛选项按钮点击
    resetFilter () {
      this.appendClickTrackData('filter_reset')
      this.$emit('reset')
    },
    // 筛选项确定按钮点击
    apply () {
      this.appendClickTrackData('filter_apply')
      this.$emit('apply')
    },
    layerTouceMove (e) {
      e.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.filter-wrap {
  .filter-content {
    position: fixed;
    width: 320px;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: 119;
    background: #fff;
    display: flex;
    flex-direction: column;
    .filter-header {
      height: 40px;
      width: 100%;
      border-bottom: 1px solid #F1F3F2;
      position: relative;
      h3 {
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
      }
      .close-filter {
        position: relative;
        &:before { content: ''; position: absolute; top: -5px; left: -5px; right: -5px; bottom: -5px; }
        position: absolute;
        right: 12px;
        top: 12px;
        .popup-close {
          stroke: #000;
          stroke-width: 1px;
        }
      }
    }
    .filter-body {
      flex: 1;
      padding: 10px 14px;
      overflow-y: scroll;
      .filter-item {
        &.expand {
          .arrow-down {
            transform: rotate(180deg);
          }
        }
        .filter-top {
          height: 46px;
          position: relative;
          width: 100%;
          h4 {
            display: flex;
            padding-right: 15px;
            .title {
              line-height: 46px;
              font-size: 16px;
              color: #454545;
              margin-right: 20px;
              font-family: patpat-Bold;
            }
            .filter-string {
              flex: 1;
              color: #F2435B;
              line-height: 46px;
              font-size: 12px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              text-align: right;
            }
          }
          .arrow-down {
            fill: #fff;
            stroke: #454545;
            margin-left: 6px;
            transition: all .2s;
            position: absolute;
            top: 20px;
            right: 0;
          }
      }
        .filter-item-content {
          .size-list {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 30%;
              height: 40px;
              margin-right: 5%;
              line-height: 40px;
              border-radius: 4px;
              background: #FAFBFA;
              margin-bottom: 10px;
              text-align: center;
              color: #444;
              font-size: 12px;
              font-family: 'patpat-Medium';
              &:nth-child(3n + 3) {
                margin-right: 0;
              }
              &.show-more {
                background: #fff;
                border: 1px solid #E8E8E8;
                line-height: 40px;
              }
              &.selected {
                color: #F2435B;
                background: #FFE2E7;
              }
            }
          }
          .color-list-en {
            display: flex;
            flex-wrap: wrap;
            li {
              width: 30%;
              height: 40px;
              margin-right: 5%;
              line-height: 40px;
              border-radius: 4px;
              background: #FAFBFA;
              margin-bottom: 12px;
              text-align: center;
              position: relative;
              color: #444;
              font-size: 12px;
              font-family: 'patpat-Medium';
              .color {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #E8E8E8;
                border-radius: 50%;
                left: 6px;
                top: 15px;
              }
              &.show-more {
                text-align: center;
                background: #fff;
                border: 1px solid #E8E8E8;
                line-height: 40px;
                margin-right: 0;
              }
              &:nth-child(3n + 3) {
                margin-right: 0;
              }
              &.Yellow {
                .color {
                  background: #fefe54;
                }
              }
              &.White {
                .color {
                  background: #fefefe;
                  border: 1px solid #E8E8E8;
                }
              }
              &.Black {
                .color {
                  background: #000;
                }
              }
              &.Red {
                .color {
                  background: #F1435a;
                }
              }
              &.Green {
                .color {
                  background: #377e21;
                }
              }
              &.Blue {
                .color {
                  background: #0000f4;
                }
              }
              &.Orange {
                .color {
                  background: #fa8349;
                }
              }
              &.Gray {
                .color {
                  background: #808080;
                }
              }
              &.Pink {
                .color {
                  background: #f5c2cb;
                }
              }
              &.Purple {
                .color {
                  background: #8a3491;
                }
              }
              &.Brown {
                .color {
                  background: #983430;
                }
              }
              &.Off-white {
                .color {
                  background: #f2f2f2;
                }
              }
              &.Gold {
                .color {
                  background: #f8d849;
                }
              }
              &.Silver {
                .color {
                  background: #cccccc;
                }
              }
              &.Assorted {
                .color {
                  background: #eeeeee;
                }
              }
              &.Navy {
                .color {
                  background: #010078;
                }
              }
              &.Grey {
                .color {
                  background: #808080;
                }
              }
              &.selected {
                span {
                  color: #F2435B;
                }
                background: #FFE2E7;
              }
            }
          }
          .color-list {
            display: flex;
            flex-wrap: wrap;
            li {
              height: 40px;
              margin-right: 10px;
              line-height: 40px;
              border-radius: 4px;
              padding: 0 20px 0 25px;
              background: #FAFBFA;
              margin-bottom: 10px;
              text-align: center;
              position: relative;
              color: #444;
              font-size: 12px;
              font-family: 'patpat-Medium';
              .color {
                position: absolute;
                width: 10px;
                height: 10px;
                background: #E8E8E8;
                border-radius: 50%;
                left: 6px;
                top: 15px;
              }
              &.Yellow {
                .color {
                  background: #fefe54;
                }
              }
              &.White {
                .color {
                  background: #fefefe;
                  border: 1px solid #E8E8E8;
                }
              }
              &.Black {
                .color {
                  background: #000;
                }
              }
              &.Red {
                .color {
                  background: #F1435a;
                }
              }
              &.Green {
                .color {
                  background: #377e21;
                }
              }
              &.Blue {
                .color {
                  background: #0000f4;
                }
              }
              &.Orange {
                .color {
                  background: #fa8349;
                }
              }
              &.Gray {
                .color {
                  background: #808080;
                }
              }
              &.Pink {
                .color {
                  background: #f5c2cb;
                }
              }
              &.Purple {
                .color {
                  background: #8a3491;
                }
              }
              &.Brown {
                .color {
                  background: #983430;
                }
              }
              &.Off-white {
                .color {
                  background: #f2f2f2;
                }
              }
              &.Gold {
                .color {
                  background: #f8d849;
                }
              }
              &.Silver {
                .color {
                  background: #cccccc;
                }
              }
              &.Assorted {
                .color {
                  background: #eeeeee;
                }
              }
              &.Navy {
                .color {
                  background: #010078;
                }
              }
              &.Grey {
                .color {
                  background: #808080;
                }
              }
              &.selected {
                span {
                  color: #F2435B;
                }
                background: #FFE2E7;
              }
              &.show-more {
                padding: 0 10px;
                text-align: center;
                background: #fff;
                border: 1px solid #E8E8E8;
                line-height: 40x;
                margin-right: 0;
              }
            }
          }
          .filter-list {
            display: flex;
            flex-wrap: wrap;
            li {
              height: 40px;
              line-height: 40px;
              border-radius: 4px;
              background: #FAFBFA;
              margin-bottom: 12px;
              text-align: center;
              color: #444;
              font-size: 12px;
              margin-right: 15px;
              padding: 0 20px;
              font-family: 'patpat-Medium';
              min-width: 75px;
              &.selected {
                color: #F2435B;
                background: #FFE2E7;
              }
            }
          }
          .price-wrap {
            .price-range {
              height: 20px;
              span {
                font-size: 12px;
                color: #454545;
                &.min {
                  float: left;
                }
                &.max {
                  float: right;
                }
              }
            }
            .slider-wrap {
              padding: 0 10px;
            }
          }

        }
      }
    }
    .filter-footer {
      height: 65px;
      display: flex;
      padding: 10px 20px;
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, .02);
      .reset-sort {
        flex: 1;
        align-items: center;
        line-height: 45px;
        height: 45px;
        background: #f1f3f2;
        color: #444;
        margin-right: 15px;
        border-radius: 5px;
        font-size: 16px;
      }
      .apply-sort {
        flex: 2;
        line-height: 45px;
        height: 45px;
        background: #ff2556;
        color: #fff;
        border-radius: 5px;
        font-size: 16px;
      }
    }
  }
  .filter-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 118;
    background: rgba(0, 0, 0, .6);
  }
}
#country-ar {
  .filter-content {
    right: auto;
    left: 0;
    .close-filter {
      left: 12px;
      right: auto;
    }
    .filter-item {
      .filter-top {
        h4 {
          padding-right: 0;
          padding-left: 15px;
          .title {
            margin-left: 20px;
            margin-right: 0;
          }
          .filter-string {
            text-align: left;
          }
        }
        .arrow-down {
          left: 0;
          right: auto;
          margin-top: 0;
          margin-right: 6px;
          margin-left: 0;
        }
      }
      .filter-item-content {
        .size-list {
          li {
            margin-right: 0;
            margin-left: 5%;
            &:nth-child(3n + 3) {
              margin-right: 0;
              margin-left: 0;
            }
          }
        }
        .color-list {
          li {
            padding: 0 25px 0 20px;
            margin-left: 10px;
            .color {
              left: auto;
              right: 6px;
            }
            &.show-more {
              padding: 0 15px;
            }
            &.selected {
              &::before {
                left: 5px;
                width: 6px;
                right: auto;
              }
            }
          }
        }
        .price-range {
          .min {
            float: right;
          }
          .max {
            float: left;
          }
        }
      }
    }
  }
  .filter-footer {
    .reset-sort {
      margin-left: 15px;
      margin-right: 0px;
    }
  }
}
</style>
