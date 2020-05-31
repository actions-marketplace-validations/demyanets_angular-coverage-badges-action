import {GitHelper} from './git-helper'
import {debug} from '@actions/core'

export async function updateRepository(
  badgesDirectory: string,
  protectedBranches: string[]
): Promise<void> {
  let result = await GitHelper.getCurrentBranch()
  const branch = result[0].trim()
  debug(`Branch: ${branch}`)
  if (!protectedBranches.includes(branch) && !branch.startsWith('pull/')) {
    result = await GitHelper.getDiffs(badgesDirectory)
    const matches = (result[0].match(/\.svg/g) || []).length
    debug(`SVG matches: ${matches}`)
    if (matches > 0) {
      result = await GitHelper.commitAsAction(badgesDirectory)
      result = await GitHelper.push()
    }
  }
}