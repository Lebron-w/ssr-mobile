
const abTestConfig = require('../../configs/abTest')
const CRC32 = require('crc-32')
const experiments = require('./experiments')
const DENOMINATOR = 10000

module.exports.experimentAllot = (uuid, query) => {
  const crc32Uid = CRC32.str(uuid)
  const crc32UidAbs = Math.abs(crc32Uid)
  const mod = crc32UidAbs % DENOMINATOR
  const experimentArr = {}
  abTestConfig.forEach(item => {
    if (item.experiment) {
      const experimentSplit = item.experiment.split('.')
      const experimentName = experimentSplit[0]
      let experimentGroup = experimentSplit[1]
      const eit = experiments[experimentName]
      let isInTraffic = item.traffic.from <= mod && mod <= item.traffic.to
      const queryEG = query[`abtest-${eit.id}`]
      if (queryEG) {
        experimentGroup = queryEG
        isInTraffic = true
      }
      if (eit && isInTraffic) {
        const eitTime = eit.time
        const startTime = Date.parse(`${eitTime.start} GMT+8`)
        const endTime = Date.parse(`${eitTime.end} GMT+8`)
        const nowTime = Date.now()
        if (startTime < nowTime && endTime > nowTime && eit.groups.includes(experimentGroup)) {
          experimentArr[eit.id] = `${eit.id}.${experimentGroup}`
        }
      }
    }
  })
  const experimentStr = Object.values(experimentArr).join()
  return experimentStr
}
