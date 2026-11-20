# Leonida Field Guide

An unofficial, static GTA VI platinum companion for planning a trip through all 55 trophies.

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

## Features

- Tier-grouped checklist and original field notes for every trophy, with cautious, explicitly inferred missability flags.
- A five-phase platinum roadmap, live overall and tier progress, and local browser persistence.
- Search, tier and status filters, plus a spoiler-safe mode with individual reveals.
- JSON progress export, validated import and reset. Progress is stored locally, not synced to PlayStation.

The supplied list has no hidden-trophy field, so spoiler-safe mode treats the most cryptic entries as potentially sensitive. Some descriptions do not reveal exact unlock conditions; those guide notes are labelled as uncertain leads rather than confirmed solutions.

## Run locally

With Node.js 22 or newer, run `node serve.ts` from this directory and visit <http://localhost:8080>. The app is static and needs no build step or network assets. Use `node serve.ts --port 8081` to choose another port.

The kit entrypoint `node main.ts` copies the app and screenshots to `/output` and creates the make.fun dossier. Set `MAKEFUN_OUTPUT_DIR` to another destination when needed.

## Data integrity

`app/data/trophies.json` is the unchanged official starter list. Names and descriptions are displayed directly from that file; original strategies are keyed by ID in `app/data/guides.js`. The supplied JSON has MD5 `0e71542c4d9c2786e01cf959ccc969dd`, matching the starter copy.
