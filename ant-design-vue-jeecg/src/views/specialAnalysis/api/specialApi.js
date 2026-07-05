// Phase1：返回 mock；Phase2 后端就绪时，把每个函数体改为 axios 请求，组件不改。
import overallMock from '../mock/overall'
import specialMock from '../mock/special'
import workplanMock from '../mock/workplan'
import caseMock from '../mock/caseAnalysis'
import patternMock from '../mock/patternSummary'

// GET /special-analysis/overall
export function getOverallData () { return Promise.resolve(overallMock) }
// GET /special-analysis/special
export function getSpecialData () { return Promise.resolve(specialMock) }
// GET /special-analysis/workplan
export function getWorkPlanData () { return Promise.resolve(workplanMock) }
// GET /special-analysis/case
export function getCaseData () { return Promise.resolve(caseMock) }
// GET /special-analysis/pattern
export function getPatternData () { return Promise.resolve(patternMock) }
