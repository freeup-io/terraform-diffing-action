import * as core from '@actions/core'
import * as finder from './finder'

async function run(): Promise<void> {
  try {
    core.debug('Parsing rules in the yaml manifest.')

    var diffFound = false

    if ((await finder.getDiffScripts()).length > 0) {
      diffFound = true
    } else if ((await finder.getDiffEnvs()).length > 0) {
      diffFound = true
    } else if ((await finder.getDiffCommon()).length > 0) {
      diffFound = true
    } else if ((await finder.getDiffComponentEnvs()).length > 0) {
      diffFound = true
    } else if ((await finder.getDiffComponents()).length > 0) {
      diffFound = true
    }

    if (diffFound) {
      core.info('Diffing rule detected changes.')
      core.exportVariable('DIFF_DETECTED', 'true')
    } else {
      core.info('No changes detected.')
      core.exportVariable('DIFF_DETECTED', 'false')
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
