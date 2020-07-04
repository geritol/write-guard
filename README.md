![Node.js CI](https://github.com/geritol/write-guard/workflows/Node.js%20CI/badge.svg)

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
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: write-guard
        uses: geritol/write-guard@v0.1.0
```
