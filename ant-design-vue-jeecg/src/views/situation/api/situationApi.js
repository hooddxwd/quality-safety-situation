// Phase1：返回 mock；Phase2 后端就绪时，将每个函数体改为真实 axios 请求（见注释），组件无需改动。
// 约定：每个函数对应一个后端接口。
import headerMock from '../mock/header'
import qualityMock from '../mock/qualityIndicators'
import riskMock from '../mock/riskList'
import centerMapMock from '../mock/centerMap'
import taskMock from '../mock/taskIndicators'
import disposalMock from '../mock/disposal'
import narrativeMock from '../mock/narrative'
import predictionMock from '../mock/prediction'

// GET /situation/header
export function getSituationHeader () { return Promise.resolve(headerMock) }
// GET /situation/quality-indicators
export function getQualityIndicators () { return Promise.resolve(qualityMock) }
// GET /situation/risks
export function getRiskList () { return Promise.resolve(riskMock) }
// GET /situation/center-map
export function getCenterMap () { return Promise.resolve(centerMapMock) }
// GET /situation/task-indicators
export function getTaskIndicators () { return Promise.resolve(taskMock) }
// GET /situation/disposal
export function getDisposal () { return Promise.resolve(disposalMock) }
// GET /situation/narrative
export function getNarrative () { return Promise.resolve(narrativeMock) }
// GET /situation/prediction
export function getPrediction () { return Promise.resolve(predictionMock) }
