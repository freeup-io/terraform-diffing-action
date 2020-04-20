# terraform-diffing-action

![build-test](https://github.com/freeup-io/terraform-diffing-action/workflows/build-test/badge.svg?branch=master)

This action is a fork of [https://github.com/lostick/conditional-diffing-action/](https://github.com/lostick/conditional-diffing-action/) that adds extra logic to handle terraform deployments based on components and environments.

Example workflow
```
steps:

# git check out
- uses: actions/checkout@v2

# fetch all branches
- run: git fetch --no-tags --prune --depth=1 origin +refs/heads/master:refs/remotes/origin/master

# exports DIFF_DETECTED, based on whether the diff commands
# outputs paths that have been modified or not
- uses: freeup-io/terraform-diffing-action@master

# only run this step if DIFF_DETECTED is set as true
- name: Build project
  if: env.DIFF_DETECTED
  run: |
    echo "change detected, project needs to be rebuilt"
```
