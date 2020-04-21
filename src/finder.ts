import * as core from '@actions/core'
import fs from 'fs'

import gitP, {SimpleGit} from 'simple-git/promise'
import {DiffResult, ListLogSummary} from 'simple-git/typings/response'

import {getRootDir} from './helpers'

export const ROOT_DIR = getRootDir()
export const ENV = process.env.ENV

export const git: SimpleGit = gitP(ROOT_DIR)

/** Performs diffing based on the rules from the manifest */
export async function getDiff(extraOptions: string[]): Promise<DiffResult> {
  const baseOptions = [
    '--no-color',
    'origin/master...'
  ]
  const diff = await git.diffSummary([...baseOptions, ...extraOptions])
  return diff
}

export const getStatus = async (): Promise<ListLogSummary> => {
  const commit = await git.log(['-1'])
  return commit
}

export const getRevision = async (): Promise<string> => {
  const rev = await git.revparse(['--short', 'HEAD'])
  return rev
}

export const getDiffScripts = async (): Promise<string[]> => {
  const cmdOptions = [
    '--',
    `${ROOT_DIR}/.git*`,
    `${ROOT_DIR}/scripts`
  ]
  const diff = await getDiff(cmdOptions)
  const diffedFiles = diff.files.map(elem => elem.file)

  printDiffResults(cmdOptions, diffedFiles)

  return diffedFiles
}

export const getDiffEnvs = async (): Promise<string[]> => {
  const cmdOptions = [
    '--',
    `${ROOT_DIR}/terraform/envs/${ENV}.tfvars`
  ]
  const diff = await getDiff(cmdOptions)
  const diffedFiles = diff.files.map(elem => elem.file)

  printDiffResults(cmdOptions, diffedFiles)

  return diffedFiles
}

export const getDiffCommon = async (): Promise<string[]> => {
  const cmdOptions = [
    '--',
    `${ROOT_DIR}/terraform`,
    ':!terraform/envs',
    ':!terraform/components'
  ]
  const diff = await getDiff(cmdOptions)
  const diffedFiles = diff.files.map(elem => elem.file)

  printDiffResults(cmdOptions, diffedFiles)

  return diffedFiles
}

export const getDiffComponentEnvs = async (): Promise<string[]> => {
  const cmdOptions = [
    '--',
    `${ROOT_DIR}/terraform/components/*/envs/*`
  ]
  const diff = await getDiff(cmdOptions)
  const diffedFiles = diff.files.map(elem => elem.file)

  printDiffResults(cmdOptions, diffedFiles)

  return diffedFiles.filter(file => file.endsWith(`${ENV}.tfvars`))
}

export const getDiffComponents = async (): Promise<string[]> => {
  const cmdOptions = [
    '--',
    `${ROOT_DIR}/terraform/components`,
    ':!*/envs/*'
  ]
  const diff = await getDiff(cmdOptions)
  const components = diff.files.map(elem => getComponentName(elem.file))

  const uniqueComponents = [...new Set(components)]
  const filteredComponents = uniqueComponents.filter(elem => isEnvInComponent(elem))

  printDiffResults(cmdOptions, filteredComponents)

  return filteredComponents
}

function printDiffResults(diffOptions: string[], diffResults: string[]): void {
  core.info(`  -> diff options: ${diffOptions.join(' ')}`)
  core.info(`  -> diff results: ${diffResults.join(' ')}`)
}

export function getComponentName(path: string): string {
  return path.includes('/') ? path.split('/')[2] : path
}

export function isEnvInComponent(component: string): boolean {
  const path = `${ROOT_DIR}/terraform/components/${component}/envs/${ENV}.tfvars`
  return fs.existsSync(path)
}
