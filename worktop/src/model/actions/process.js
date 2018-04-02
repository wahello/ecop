/* global App */
import { jsonrpc } from 'homemaster-jslib'

export const PROCESS_RECEIVED = 'PROCESS_RECEIVED'

export const searchProcess = () => dispatch => {
  jsonrpc({
    method: 'bpmn.process.list',
    params: [App.processKey, {}]
  }).then(processes => {
    dispatch({ type: PROCESS_RECEIVED, processes })
  })
}
