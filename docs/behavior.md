# Behavior notes

This page describes what the service does today.

## IDs

- A request ID is a whole number.
- Zero is a valid ID, like any other number.
- A lookup for an ID that does not exist finds nothing.

## Title

- Titles cannot be blank.

## Priority

- Priority must be one of 'low', 'normal', or 'high'. Requests made without a priority will default to 'normal.'

## Endpoints

| Method | Path              | Result                                                             |
| ------ | ----------------- | ------------------------------------------------------------------ |
| GET    | `/health`         | Status 200 with `{ "status": "ok" }`                               |
| GET    | `/requests`       | Status 200 with all support requests as a JSON list                |
| GET    | `/requests/{:id}` | Status 200 with the request having the ID, or nothing if not found |
| POST   | `/requests`       | Status 200 with the created request                                |

A support request has an `id`, a `title`, a `priority` (`low`, `normal` or `high`), a `requester` and a `createdAt` time.

## Storage

Requests live in memory. The service starts with three sample requests, and a restart brings back the same three.

## Notifications

The service ships a local notifier. It writes each message to the console and sends nothing.

| Setting              | Effect                                                  |
| -------------------- | ------------------------------------------------------- |
| `NOTIFIER_FAIL=true` | Every send fails with an error. Any other value is off. |
| (not set)            | Every send is written to the console and succeeds.      |

## Settings

| Setting         | Default | Effect                     |
| --------------- | ------- | -------------------------- |
| `PORT`          | `3000`  | The port the service uses. |
| `NOTIFIER_FAIL` | off     | See Notifications above.   |
