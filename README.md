# Leonida Field Guide

An unofficial, static GTA VI platinum trophy companion for exploring Leonida and tracking all 55 trophies.

- Browse trophies by tier, search names and descriptions, and filter by earned status or the inferred spoiler-sensitive group.
- Open original strategy notes for each trophy and follow a five-stage platinum roadmap.
- Track progress locally, with overall and tier counts and percentages; export, import, reset, or print your checklist.
- Spoiler-safe mode conceals cryptic entries until you reveal them. The supplied list does not identify which trophies are officially hidden, so this grouping is an inference.

## Run locally

With Node.js 22 or later, run `node serve.ts` from this directory and visit <http://localhost:8080>. No build step or external service is needed. Progress is stored in the browser's localStorage; export a backup before clearing browser data or moving devices.

## Data integrity

`app/data/trophies.json` is the official list supplied with the kit and remains untouched. Names and descriptions are displayed directly from that file. The separate field guides and roadmap are original launch-day strategy writing; uncertain triggers and possible missability are identified as inferences, not established facts.

## make.fun

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
