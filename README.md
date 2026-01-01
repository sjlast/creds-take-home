# Candidate take-home packet

This folder is a candidate take-home packet. Start with `TAKE-HOME.md`. It tells you what to do and how to send your work back.

The rest of this README describes the project in this folder.

## Sample Repo: IT Support Service

A small service for IT support requests. Employees report problems, such as a broken laptop, and the support team handles them.

## What you need

- Node 24 or later
- pnpm 12 (run `corepack enable`, or see <https://pnpm.io/installation>)
- git

A different Node or pnpm version prints a warning. It does not stop you.

## Install

```sh
pnpm install
```

## Run

```sh
pnpm dev
```

The service listens on <http://127.0.0.1:3000>. Set `PORT` to use another port. Check that it works:

```sh
curl http://127.0.0.1:3000/health
```

## Test, lint and typecheck

```sh
pnpm test
pnpm lint
pnpm typecheck
```

## Layout

| Path                | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `src/app.ts`        | The HTTP routes                                 |
| `src/server.ts`     | Starts the service                              |
| `src/store.ts`      | The in-memory store and its sample data         |
| `src/lookup.ts`     | Finds a request by ID                           |
| `src/notifier.ts`   | The local notifier, which logs messages         |
| `test/`             | Tests                                           |
| `docs/behavior.md`  | What the service does, including its settings   |
| `scripts/submit.mjs`| Packages your work for sending                  |
