# Leonida Field Guide

An unofficial, static platinum trophy companion for Grand Theft Auto VI. Follow a five-phase roadmap, browse all 55 trophies by tier, and open a field note for each one. The strategies are independent guidance; inferred conditions and possible missability are labeled where relevant.

## Features

- Search and filter by tier or earned status, with a spoiler-safe view and individual reveals.
- Track overall and tier progress locally, and export, import, or reset the checklist.
- Explore a story-first roadmap covering cleanup, collectibles, miscellaneous work, and platinum.
- Responsive layout for desktop and mobile.

## Run locally

From this directory, run `bun serve.ts`, then open the local URL printed by the server. The app is static and can also be served from the `app` directory by any HTTP server. Progress is stored in the browser's localStorage on that origin.

## Data integrity

`app/data/trophies.json` is the supplied official list and is kept unchanged. Names and descriptions displayed by the app come directly from that file. Original strategy notes live separately in `app/data/guides.js`; uncertain unlock details are not presented as confirmed facts.

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/gooonamee/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
