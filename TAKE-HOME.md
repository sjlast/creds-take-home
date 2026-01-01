# Candidate take-home instructions

## About this take-home

The take-home has two parts. You write short answers to four design questions, and you add a small feature to a sample service. It takes about 90 minutes. You send your work back, and then we meet to talk it through.

We want to see how you think. The questions have no trick answers and no trivia. The code task is small, and it is the kind of work you would do on a normal day here. Take your time, answer thoughtfully, and tell us the tradeoffs you weighed.

## The role

We are building a new platform that makes healthcare credentialing simpler. We want a hands-on engineer who can design, build and run backend systems, and who understands the infrastructure around them.

In this role, you will:

- Build services, libraries and APIs. Each one has a clear job and few dependencies.
- Keep services easy to run and test on your own machine, and use production infrastructure well.
- Choose tools and ways to deploy based on the work, the cost, how reliable it must be and what the team can support.
- Work with product and engineering colleagues when the requirements are not yet complete.
- Ship useful software, explain your decisions and check that the result solves the real problem.

## Who we want

- Your strongest experience is in backend engineering, system design and infrastructure.
- You are willing to help outside your specialty.
- You do not need healthcare experience.

## Our environment

We use TypeScript and NestJS, PostgreSQL, Kubernetes, Istio, REST and GraphQL, and React. You do not need to know every tool we use. Comparable experience is welcome.

We use AI tools. We expect every engineer to understand and check the work they accept from them.

## What you need to do

This take-home has two parts. Do both.

- Plan for about 30 minutes of writing and 60 minutes of coding, about 90 minutes in total. Stop at two hours, even if incomplete. No UI, cloud account, or deployment is needed.
- You do not need AI tools for this. What matters more is that your answers are thoughtful and that you can talk through your thinking when we meet again.
- You may use AI tools to explain concepts and errors, but write the code and the written answers yourself. AI assistants that read this repository's notes in `CLAUDE.md` are set up to decline code requests and to mark any change they make. For the written answers, they only explain the questions and ask about your thinking. They do not suggest or judge answers.
- The scenarios are fictional.

### Part 1: Written answers

Open `WRITTEN-ANSWERS.md`, at the top of this repository, and write your answers in that file. There are four categories: A. Design, B. Operations, C. Performance and D. Delivery. Each category offers two options. Pick one option per category and write your answer under it. Leave the other option blank. The file explains how to answer. Commit it with your code.

### Part 2: Code task

This folder is a git repository with one commit. Read `docs/behavior.md`, then the project sections in `README.md`, to get started. You need Node 24 or later, pnpm 12 and git.

**Implement**

- Add creation of an IT support request and retrieval by ID. A request represents an employee asking for help, such as “Laptop will not charge.”
- Require a nonblank title. Priority is low, normal, or high; default to normal.
- Return a clear not-found result for an unknown ID.
- Store the item and attempt a notification. Decide what the caller sees if storage succeeds but notification fails.
- Keep the creation behavior usable outside HTTP.

NOTE: Build only the items above. OIDC integration and any access model in the written options are for design discussion only. They are not coding requirements. A durable notification system is out of scope.

**Include**

- Tests for the behavior you add.
- Any documentation or other updates that go with your change, such as the README or `docs/behavior.md`.

## How to submit

Commit your work as you go. Commit `WRITTEN-ANSWERS.md` with your code, so your answers and your code travel together.

We need your work by 10:00 p.m. Mountain Time on Sunday, November 15, 2026.

Return it in one of two ways:

1. **As a zip, to the person who sent you this take-home.** Run `pnpm submit`. It writes `submission.zip` in the project root and prints its path. It needs a clean working tree. If it lists files that are not committed, commit them or add them to `.gitignore`, then run it again. Reply to the person who sent you the take-home and attach `submission.zip`.
2. **As a GitHub link, to mary.giles@chghealthcare.com.** Push this repository, with its full history, to your own GitHub account. Either visibility is fine. Send the link to mary.giles@chghealthcare.com.

## What happens next

We will talk about both parts when we meet again. We will review your changes. Be ready to talk about what you did and to show us the changes directly.

We may ask briefly about an option you did not pick, and may use it as a live prompt. You do not need to prepare for that. We will not mark you down for it.

For the follow-up, have your local copy ready. If you can share your screen, we will ask you to start the service, show the feature working, and make an API call using curl, Postman, or your usual tool. You may also show relevant output in a browser. This is a walkthrough of work you have already run locally, not a new live coding assignment. Let us know if screen sharing is not practical so we can arrange another way to review it.
