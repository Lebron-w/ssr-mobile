<template>
  <div class="daily-box" v-if="arrList.length>0">
    <div class="font-medium">
      <pat-router-link :to="dailyDailyAllLink" class="index-title-icon" tabindex="0">
        <i class="index-title-ar">{{$t('common.activity.daily_specials')}}</i>
        <span><i></i></span>
      </pat-router-link>
    </div>
    <daily-list
      :daily-list-arr="arrList"
      :position-name='positionName'
      :floor="content.floor"
      :page_position_id="content.page_position_id"
      :hostEnv="hostEnv" >
    </daily-list>
  </div>
</template>

<script>
import { getQueryString } from '@/utils/base'
import { nativeFilter } from '@/utils/native'
import dailyList from './dailyList'

export default {
  components: { dailyList },
  props: {
    content: {
      type: Object,
      default () {
        return {
          items: [],
          page_position_id: '',
          floor: ''
        }
      }
    },
    positionName: String,
    hostEnv: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    arrList () {
      return this.content.daily_specials || []
    },
    dailyDailyAllLink () {
      const fromApp = getQueryString('platform', this.$route.fullPath) === 'app'
      let curUrl = '/dailyspecial/All'
      if (fromApp) {
        const webUrl = `"patpat://?action=webpage&mode=push&url=${curUrl}"`
        curUrl = nativeFilter(curUrl, webUrl, this.hostEnv)
      }
      return curUrl
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  #country-ar .daily-box  .index-title-ar{
    position: relative;
    left: 15px;
  }
  #country-ar {
    .index-title-icon span {
      transform: rotate(180deg);
    }
  }
  .font-medium {
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    font-family: 'patpat-medium', sans-serif;
    font-weight: 400;
    a {
      padding-right: 23px;
      line-height: 45px;
      font-size: 18px;
      font-family: patpat-Medium, sans-serif;
    }
    .index-title-icon {
      position: relative;
      span {
        display: inline-block;
        position: relative;
        width: 18px;
        height: 18px;
        border: 1px solid #444;
        border-radius: 100%;
        top: 2px;
        left: 8px;
        &:after {
          content: "";
          position: absolute;
          background: #444;
          left: 3px;
          top: 7px;
          width: 10px;
          height: 2px;
        }
        i {
          display: block;
          position: absolute;
          top: 4px;
          left: 5px;
          border-top: 2px solid #444;
          border-right: 2px solid #444;
          height: 8px;
          width: 8px;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }
      }
    }
    .daily-title {
      color: #9ba5a7;
      margin-top: -5px;
    }
  }
</style>
