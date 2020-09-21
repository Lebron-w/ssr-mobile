<template>
  <div>
    <position-layout :faceContent="pageFaceData" class="layout-div" positionPrefix="activities-" v-show="!pageLoading"></position-layout>
    <div class="loading-div" v-if="pageLoading">
      <loading type="chase" />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import activityStoreModule from '@/store/modules/activity'
import { seoPatPatTdk } from '@/assets/js/common.js'
import positionLayout from '@/components/positionLayout'

import trackMerge from '@/mixins/trackMerge'
const { mapState, mapActions } = createNamespacedHelpers('activity')

export default {
  serverPrefetch () {
    const siteAbb = this.$ssrContext.siteInfo.siteAbb
    this.$ssrContext.title = this.$t('common.activity.activities_mate_title', { name: this.activityName, tdk: seoPatPatTdk(siteAbb) })
    this.$ssrContext.description = this.$t('common.activity.activities_mate_description', { name: this.activityName })
  },
  components: { positionLayout },
  mixins: [trackMerge],
  data () {
    return {
      pageLoading: false
    }
  },
  computed: {
    ...mapState({
      pageFaceData: state => {
        return state.activityData[0] ? state.activityData[0].floor : []
      },
      pageContentEndAt: state => {
        return state.activityData[0] ? state.activityData[0].end_at : ''
      },
      activityName: 'activityName'
    })
  },
  created () {
    if (!this.$isServer) {
      const alreadyIncremented = !!this.$ppUtils.safe(this.$store.state, 'activity.activityData.0.floor.length', false)
      const curFid = this.$ppUtils.safe(this.$route, 'query.id', '')
      const lastFid = this.$ppUtils.safe(this.$store.state, 'activity.activityData.0.face_schedule_id', '')
      if (!this.$store.hasModule('activity')) {
        this.$store.registerModule('activity', activityStoreModule, { preserveState: alreadyIncremented })
      }
      if (!alreadyIncremented || +curFid !== lastFid) {
        this.pageLoading = true
        this.getData().then(() => {
          this.pageLoading = false
        }).catch(() => {
          this.pageLoading = false
        })
      }
    } else {
      this.$ssrContext.pageContentEndAt = this.pageContentEndAt
    }
  },
  methods: {
    ...mapActions({
      getData: 'getPageData'
    })
  }
}
</script>

<style lang="less" scoped>
.layout-div {
  margin: 0 10px;
}
.loading-div {
  width: 100%;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}
</style>
