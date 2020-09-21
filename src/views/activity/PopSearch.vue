<template>
  <div class="pop-search">
    <div class="search-input">
      <form id="form">
        <input type="text" autocomplete="off" :placeholder="$t('common.looking')" @input="getSearchKeyword" v-model="inputWord" />
      </form>
      <a href="javscript: void(0)" @click="cancel">{{$t('common.cancel')}}</a>
    </div>
    <div class="search-keyword">
      <i v-if="inputWord === ''">{{$t('common.searches')}}</i>
      <PatRouterLink tabindex="0" v-for="(name, key) in keywords" :key="key" :to="`/search?keyword=${name}`">{{name}}</PatRouterLink>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import trackMerge from '@/mixins/trackMerge'
import { ModalHelper } from '@/utils/dom.js'
import { setLocalStore, getLocalStore } from '../../utils/storage'

export default {
  name: 'pop-search',
  mixins: [trackMerge],
  data () {
    return {
      keywords: [],
      inputWord: ''
    }
  },
  computed: {
    ...mapState({
      prevRouter: state => state.route.from
    }),
    ...mapGetters({
      patpatAPI: 'patpatAPI',
      lastUrl: 'lastUrl'
    })
  },
  methods: {
    ...mapMutations({
      changeTopFree: 'CHANGE_TOP_FREE',
      changeTopIcon: 'CHANGE_TOP_ICON'
    }),
    getSearchKeyword () {
      const param = {
        words: this.inputWord
      }
      this.patpatAPI.searchKeyword(param).then(data => {
        this.keywords = data.hot_words
      }).catch(err => {
        console.log('error pop search api get:', err)
      })
    },
    cancel () {
      this.$router.push(getLocalStore('search-callback-url'))
    }
  },
  mounted () {
    this.changeTopIcon('se')
    this.changeTopFree(false)
    this.getSearchKeyword()
    ModalHelper.afterOpen()
    setLocalStore('search-callback-url', this.prevRouter.fullPath)
    const _this = this
    const form = document.getElementById('form')
    const lang = this.$route.params.lang
    // const query = this.$route.query
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      // query.keyword = _this.inputWord
      // _this.$router.push({
      //   path: 'search',
      //   query: query
      // })
      let uri = `/search?keyword=${_this.inputWord}`
      if (lang) {
        uri = `/${lang}/search?keyword=${_this.inputWord}`
      }
      window.location.href = uri
    })
  },
  destroyed () {
    ModalHelper.beforeClose()
    this.changeTopIcon('')
    this.changeTopFree(true)
  }
}
</script>
<style scoped lang="less">
.pop-search {
  position: fixed;
  z-index: 9;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  background: #f1f3f2;
}
.search-input {
  display: flex;
  -webkit-box-align: center;
  form {
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #cdd2d3;
    border-radius: 5px;
    background: #fff;
    input {
      width: 100%;
      height: 20px;
      font-size: 16px;
      border: none;
      &::-webkit-input-placeholder {
        color: #cdd2d3;
        font-size: 12px;
      }
    }
  }
  a {
    width: 88px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    font-size: 16px;
    font-family: 'patpat-Medium';
  }
}
.search-keyword {
  padding: 15px 15px 0;
  i {
    display: block;
    font-size: 13px;
    color: #9ba5a7;
    padding-bottom: 5px;
  }
  a {
    display: block;
    margin-bottom: 3px;
    line-height: 26px;
  }
}

</style>
