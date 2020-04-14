import * as helpers from '../src/helpers'
import * as finder from '../src/finder'

import fs from 'fs'

// would be good to mock that
const ENV = process.env.ENV

beforeAll(() => {
  return initGitData()
})

afterAll(() => {
  return clearGitData()
})

test('getDiffScripts', async () => {
  const diffedFiles = await finder.getDiffScripts()
  expect(diffedFiles).toContainEqual('scripts/test')
  expect(diffedFiles).toContainEqual('.github/dummy')
})

test('getDiffEnvs', async () => {
  const diffedFiles = await finder.getDiffEnvs()
  expect(diffedFiles).toContainEqual(`terraform/envs/${ENV}.tfvars`)
})

test('getDiffCommon', async () => {
  const diffedFiles = await finder.getDiffCommon()
  expect(diffedFiles).toContainEqual(`terraform/common/dummy-file`)
})

test('getDiffComponentEnvs', async () => {
  const diffedFiles = await finder.getDiffComponentEnvs()
  expect(diffedFiles).toContainEqual(
    `terraform/components/route53/envs/${ENV}.tfvars`
  )
})

test('getDiffComponents', async () => {
  const diffedFiles = await finder.getDiffComponents()
  expect(diffedFiles).toContainEqual('dynamodb')
})

const initGitData = async () => {
  console.log('create fixtures')
  fs.mkdirSync(`${finder.ROOT_DIR}/scripts`)
  fs.closeSync(fs.openSync(`${finder.ROOT_DIR}/scripts/test`, 'w'))
  fs.appendFileSync(`${finder.ROOT_DIR}/.github/dummy`, '#test')

  fs.mkdirSync(`${finder.ROOT_DIR}/terraform/envs`, {recursive: true})
  fs.closeSync(
    fs.openSync(`${finder.ROOT_DIR}/terraform/envs/${ENV}.tfvars`, 'w')
  )

  fs.mkdirSync(`${finder.ROOT_DIR}/terraform/common`, {recursive: true})
  fs.closeSync(
    fs.openSync(`${finder.ROOT_DIR}/terraform/common/dummy-file`, 'w')
  )

  fs.mkdirSync(`${finder.ROOT_DIR}/terraform/components/route53/envs`, {
    recursive: true
  })
  fs.closeSync(
    fs.openSync(
      `${finder.ROOT_DIR}/terraform/components/route53/envs/${ENV}.tfvars`,
      'w'
    )
  )

  fs.mkdirSync(`${finder.ROOT_DIR}/terraform/components/dynamodb/envs`, {
    recursive: true
  })
  fs.appendFileSync(
    `${finder.ROOT_DIR}/terraform/components/dynamodb/test`,
    '# test'
  )
  fs.closeSync(
    fs.openSync(
      `${finder.ROOT_DIR}/terraform/components/dynamodb/envs/${ENV}.tfvars`,
      'w'
    )
  )

  await finder.git.add('.')
  await finder.git.commit('dummy commit')
}

const clearGitData = async () => {
  console.log('clean up fixtures')
  var lastCommitID: string = await finder.git.revparse(['--short', 'HEAD'])
  await finder.git.revert(lastCommitID, ['--soft'])
}
