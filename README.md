# `turbo-affected`

This is a simple GitHub action to check whether a given Turborepo package/scope is affected by a given set of changes.

## Usage

This action assumes that node (specifically `npx`) is available in the environment.

By default, the action will check for changes done in the last commit. You can also specify a different commit range as an input. You can use `nrwl/nx-set-shas` to derive the appropiate commit range (SHAs).

```yaml
build:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - uses: nrwl/nx-set-shas@v4
      id: setSHAs
    - uses: ekojsalim/turbo-affected@v1
      id: affected
      with:
        scope: "api"
        base: ${{ steps.setSHAs.outputs.base }}
        head: ${{ steps.setSHAs.outputs.head }}
    - name: Your Step
      run: echo "api is affected by the changes"
      if: steps.affected.outputs.affected == 'true'
```
