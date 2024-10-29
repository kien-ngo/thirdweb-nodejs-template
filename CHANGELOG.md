# Change Log

All notable changes to this project will be documented in this file.

## [0.0.13] - Change logger settings

- add service key auth middleware

## [0.0.12] - Change logger settings

- use child loggers to prevent memory leaks
- different settings for localhost and production

## [0.0.11] - Adds OpenAPI spec generation

- adds OpenAPI spec generation with `@hono/zod-openapi`

## [0.0.10] - Use in-memory redis and database for tests

- use ioredis-mock & PGLite for running tests

## [0.0.9] - Add CODEOWNERS file & housekeeping

- default CODEOWNERS file
- readme updates
- remove unnecessary example file `SampleSauce.ts`
- update lock file

## [0.0.8] - Setup Drizzle & Basic TODO Api

- drizzle for postgres setup
- basic todo api added to show off drizzle + zod + hono validations

## [0.0.7] - Restructure API routes etc

- best practices via [hono recommendation](https://hono.dev/docs/guides/best-practices)

## [0.0.6] - Add Redis

- added `ioredis` for Redis integration

## [0.0.5] - Datadog & utils

- added datadog integration
- added utils for logging and error handling

## [0.0.4] - Basic infra setup

- remove unused `Dockerfile`
- add basic infra setup for local development using `docker-compose`

## [0.0.3] - bun -> node

- switch from bun to node.js:
  - [dev] -> `tsx src/index.ts`
  - [build] -> `tsc src/index.ts --outDir dist`
  - [start] -> `node dist/index.js`
  - [test] -> `vitest`
  - pkg manager -> `pnpm`
- simplified `.env` setup (one .env file)
  - `.test.env` does not help if automated tests don't have access to the senv encryption key
- switched indent style to `spaces` (over default `tabs`)
- switched TSconfig to `NodeNext` module and moduleresolution (so that tsc build output is compatible with modern nodejs directly)

## [0.0.2]

- Changed the build command to output an executable, based on the [recommendation](https://bun.sh/docs/bundler/executables#deploying-to-production) in Bun's docs.

## [0.0.1]

Initial version
