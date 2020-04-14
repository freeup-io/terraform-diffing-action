import * as core from '@actions/core'
import * as finder from './finder'

async function run(): Promise<void> {
  try {
    core.debug('Parsing rules in the yaml manifest.')

    if (
      finder.getDiffScripts() ||
      finder.getDiffEnvs() ||
      finder.getDiffCommon() ||
      finder.getDiffComponentEnvs() ||
      finder.getDiffComponents()
    ) {
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
