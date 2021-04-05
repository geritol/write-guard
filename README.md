![Node.js CI](https://github.com/geritol/write-guard/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/geritol/write-guard/branch/master/graph/badge.svg)](https://codecov.io/gh/geritol/write-guard)

# Write-guard

Enforce file level write access for monorepos

## Usage

Write-guard is designed to enforce file level write access for monorepos that have protected `master` branches with

- Restrict push enabled
- Require status checks to pass before merging
  enabled.

:warning: If these are not enforced, file level write access cannot be enforced by write-guard.

### Setup

you will need to define a `write-guard.yaml` in the root of your repository, eg.:

```yaml
roles:
  - edit-all:
    - team/admins
    - permission/admin
    - user/geritol
access:
  **:
    - role/edit-all
  security/**:
    - team/security
```

You need to run `write-guard` on your pull requests eg.:

```yaml
# .github/workflows/write-guard.yaml

name: Pull Request

on:
  pull_request:
    branches: [master]

jobs:
  write-guard:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
        with:
          ref: master # Important!
          # write-guard needs to run on your master branch to prevent
          # the possibility of pr openers self grant edit permissions
          #
          # the action will retrieve files changed in the current pr
          # and validate write access based on the master branches
          # write-guard.yaml
      - name: write-guard
        uses: geritol/write-guard@v0.2.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
