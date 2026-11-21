# Leonida Field Guide

An unofficial, static GTA VI platinum trophy companion. Browse all 55 trophies by tier, open individual strategy notes, and follow a five-phase roadmap. The guide labels uncertain methods and possible missability as inference where the supplied descriptions do not establish a confirmed route.

Track earned trophies with live overall and tier counts and percentages. Progress and spoiler reveals persist in localStorage; export a JSON backup, import it on another device, or reset the tracker. Filter by tier and status, search the list, and use spoiler-safe mode to blur later entries until revealed.

## Run locally

With Node.js 22 or newer, run `node serve.ts` from this directory and open `http://localhost:8080`. Use `node serve.ts --port 8081` to choose another port. The static app has no build step. The kit entrypoint is `main.ts`.

## Data integrity

`app/data/trophies.json` is the supplied official list and is kept byte-identical to the kit. Displayed trophy names and descriptions are read directly from it. The separately authored `app/data/guides.js` contains the original route notes; uncertain hidden conditions are not represented as confirmed facts.

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
