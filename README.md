# Archive tickets from a certain column for an iteration

Automatically archive issues for a given iteration of your [GitHub project](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects) with this [Github Action](https://github.com/features/actions).

## Example

```yaml
on:
  schedule:
    # Runs "at 05:00, only on Monday" (see https://crontab.guru)
    - cron: "0 5 * * 1"

jobs:
  archive-done-tickets:
    name: Archive done tickets
    runs-on: ubuntu-latest

    steps:
      - uses: TimVanMourik/gha-archive-tickets-from-sprint@v0.1.0
        with:
          owner: OrgName
          number: 1
          token: ${{ secrets.PROJECT_PAT }}
          iteration-field: Iteration
          iteration: last
          statuses: "Done"
```

## Inputs

#### owner

The account name of the GitHub organization.

#### number

Project number as you see it in the URL of the project.

#### token

Personal access token or an OAuth token. the `project` scope is required.

#### iteration-field

The name of your iteration field.

#### iteration

Should be `last` or `current`.

#### statuses

Statuses of the issues to archive

## Sources

This action was made possible thanks to https://github.com/gr2m/github-project. This was an adaption from https://github.com/blombard/move-to-next-iteration.
