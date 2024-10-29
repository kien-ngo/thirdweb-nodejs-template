# nodejs-service-template

To install dependencies:

```bash
pnpm install
```

To run:

```bash
pnpm dev
```

or for production

```bash
pnpm build && pnpm start
```

## How to use this template?

1. Create a new repo using this as the repository template
2. Change `name` in `package.json` to your service name
3. Update `CODEOWNERS` file to include your team
4. Update README.md

## What is this template using?

1. pnpm - package manager
2. nodejs - runtime
3. TypeScript / tsc - language / compiler
4. vitest - test runner
5. Hono - web framework for building APIs
6. Winston - structured logging
7. Dotenv - managing environment variables
8. Biome - linting & code formatting
9. Docker - building an image for the service
10. senv - encrypting & decrypting env variables

## Folder structure

`src` - application code
`src/api` - api endpoint handlers
`src/lib` - main code logic, models, etc

`tests` - test files. For unit tests, it ideally follows similar folder structure as `src`

`dist` - application build directory

## Environment variables

Env variables are defined in `.env` and stored as ecrypted values in `.env.encrypted`

When first starting out with a repo:

1. Create a `.env.pass` file with a password to be used for encryption (foo is default for this template): `echo -n "foo" >> .env.pass`
2. Run `pnpm run env:decrypt` to create .env files
3. Create a more secure password and save it in `.env.pass`
4. Save this password in 1password so it's shared with the team
5. Run `pnpm run env:encrypt` to encrypt the variables with the new password
6. Commit the encrypted env files

## OpenAPI

If you follow the example routes, an OpenAPI spec will be auto-generated for you to be used with Swagger or another UI. The spec can be found at `{BASE_URL}/openapi.json` when the app is running.

## Internal Testimonials

<img src="https://github.com/user-attachments/assets/b7bb41b6-7b4a-433d-9ce7-e1d16ab4c741" alt="ez setup over the weekend">
