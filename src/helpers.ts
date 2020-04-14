/** Works out working tree root directory */
export const getRootDir = (): string => {
  const rootDir = process.env['GITHUB_WORKSPACE'] || process.env.PWD

  if (!rootDir) {
    throw new Error('Either GITHUB_WORKSPACE or PWD must be set')
  }

  return rootDir
}
