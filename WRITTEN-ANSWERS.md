# Written answers

Pick one option in each of the four categories and write your answer under it in this file. Leave the other option in each category blank. Each answer is about 100 to 150 words. Bullets or sketches are fine.

For each option you pick, give your recommendation, its main tradeoff, and one thing that could change your answer. State assumptions where information is missing. Answer only the numbered questions under "Answer these questions".

Commit this file with your code. `pnpm submit` needs a clean working tree.

## A. Design

### A1. Component design and testing

**Situation**

Employees use a small IT support service to report problems such as a broken laptop. The service accepts a request, stores it, and notifies the support team.

**Details**

- Each request needs a nonblank title and a priority of low, normal, or high. An omitted priority defaults to normal. These are the validation rules for this exercise.
- The HTTP handler mixes validation, SQL, and the notification vendor’s SDK.
- A scheduled importer will soon create requests using the same behavior.
- A second application may later need the same validation. Its release schedule is unknown.
- Two engineers have two weeks to deliver a first version.

**Identity and access**

- The company already uses an external authentication system with an OIDC sign-in flow. After sign-in, a trusted integration supplies the user's identity, basic profile, and claims or groups indicating end-user, support, or admin access. Do not design a new login system.
- Unauthenticated users cannot access any tickets.
- Authenticated users can view tickets they filed. Admins can view all tickets.
- Support staff can also view tickets filed by users in their assigned support groups.
- Assume a company directory can supply user group membership and each support person's assigned groups. Explain where the service would obtain and use that information.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. How would you arrange and connect the components? What would stay together, become a library or package, or become a service?
2. Where would ticket-access checks live, and how would they use the supplied identity and group information?
3. How would the application run locally without the real notification provider or company sign-in system?
4. Which fast tests would you write, and what would still need a real integration or smoke test?

**Your answer (fill in only if you pick A1)**

_Write your answer here._

**Assumptions**

- The existing IT service doesn't have any other functions or features other than those stated (handle Request creation HTTP requests, validation, storage in DB, and support notification).
- The existing IT service already has code for using the sign-in integration, so it has access to user identity, groups, etc.
- The company directory has an API for fetching and verifying user groups.
- A Request is the same thing as a Ticket
- The service calling the notification SDK is fire-and-forget
- The Notification SDK allows you to configure the URL it calls to

**Answers**

1. Turn the existing service into the IT Request Service (a microservice-style architecture) that all future applications will call to log support requests. This encapsulates all logic for creation, validation, and storage of the Requests in a single location which can be updated as necessary without impacting other applications. The tradeoff is making the IT Request Service a failure point in the entire system. If it goes down, has network connectivity problems, or any other issue then all other applications are blocked from logging Requests. Having multiple Services running at once in different server locations can maintain availability when services go down or need maintenance. Another tradeoff is causing breaking changes to consumers if the API contract changes. It forces consumers to update their code, but versioning the API can soften that migration and give them time. The alternative, if the Service was a library installed on all Request-generating apps, would be relying on library consumers to update their library versions when contracts changed. That's not always reliable and old libary versions could linger. With a microservice, any consumer would eventually be forced to update their usage or it would break.
2. For the moment, the simplest thing would be to make the IT Request Service also handle accessing/viewing tickets. Future apps would also need to call this Service to access tickets. When an ticket access API call is made, the user indicated in the request is validated against the company directory to make sure they are in the group(s) claimed and then either shown the requested ticket or rejected. The tradeoff is potentially adding lots more read requests to the system than writes. This can cause writes to be delayed or blocked if the service or database get overwhelmed by read requests. That can be mitigated through various levels of caching, such as a Redis cache, and read-only database replicas. Reading an IT ticket does not _absolutely_ require up-to-date information so a few miliseconds of potential lag when the replicas are updated is tolerable.
3. Since notification is done by a vendor, have a dummy cloud service that a local instance of the service can point its SDK to which returns a 200 or even a configurable error to aid in testing. Tradeoff is that it's not super realistic and you could miss catching errors that exist in real world usage. If the vendor has a non-prod instance, that would be preferable. A similar dummy service could be used for the company directory to validate group membership and could be seeded with dummy data for testing.
4. Unit tests for Request validation, database operations, user group validation. Integration tests with the company directory and notification service would still be required.

### A2. Typed API contract and code generation

**Situation**

The IT support service has an HTTP API. A web app calls it. The scheduled importer calls it. A second application may call it soon. Each caller defines its own request and response types by hand. The definitions have drifted apart: one caller treats priority as optional, and another sends a value the API does not accept.

**Details**

- The service and its callers are written in TypeScript.
- Each request needs a nonblank title and a priority of low, normal, or high. An omitted priority defaults to normal.
- The callers are released on different schedules.
- Two engineers maintain the service and the callers. They often change fields, and they use AI tools to make many of those changes.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. Where would you define the API contract, and what would you generate from it?
2. How would you roll out a field change, such as a new required field, across callers with different release schedules?
3. What checks would you still run when the service receives a request, and why do types alone not cover them?
4. What compiler or tooling settings would make refactors safer, and what would you skip for now?

**Notes for this option**

State what you would not build yet. One caller may not justify every tool.

**Your answer (fill in only if you pick A2)**

_Write your answer here._

## B. Operations

### B1. Deployment and storage

**Situation**

You need to deploy the IT support application. Staff create and view requests in a browser; the backend stores requests and their history, imports updates, and sends notifications.

**Constraints**

- 200 staff users, primarily during US business hours: weekdays, 8 a.m. Eastern through 6 p.m. Pacific. Occasional off-hours access is needed.
- Peak traffic of 20 reads and 2 writes per second.
- 20 GB of data, growing by about 2 GB per month.
- Two engineers share operations; the pilot is due in two weeks.
- After a disaster, the pilot accepts four hours to recover and fifteen minutes of lost writes.
- Selected records must remain retrievable for seven years; recovery backups need thirty days of history.
- Records require access controls. There is no contractual uptime percentage yet.
- The company has an AWS account containing an existing managed Kubernetes cluster and a shared managed PostgreSQL instance. Available capacity and support need confirmation.

**Possible system configurations**

| Option | Configuration                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------- |
| A      | One VM, using systemd or a container; SQLite with Litestream to object storage                                |
| B      | One application deployment on the existing platform; a separate logical database on shared managed PostgreSQL |
| C      | Separate API and worker deployments; a dedicated managed database                                             |
| D      | Functions, a managed queue, and suitable storage                                                              |
| E      | Application and database in Kubernetes, with persistent storage and a defined recovery process                |

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. Recommend a configuration—or propose another—and defend it against one credible alternative.
2. Name the most important assumptions to verify about cost, recovery, isolation, or support.
3. Give one requirement change that would make you reconsider.

**Notes for this option**

Exact pricing is not needed. Consider engineering time as well as the infrastructure bill.

**Your answer (fill in only if you pick B1)**

_Write your answer here._

**Answers**

1. Assuming there is sufficient capacity on the managed Kubernetes (k8s) cluster and managed PostgreSQL instance, that capacity isn't needed anytime soon for existing applications on those instances, and given the time constraints, deploy the support application onto those existing managed systems. I don't think that's one of the listed options. The database should have its own tenant to keep its data separate from existing data. Not only will this use underutilized resources already being paid for but it will require less developer time to spin up new VMs or cloud deployments since they're already in place. It's likely it will eventually outgrow the capacity of the managed PostgreSQL instance, but the data in the database can be migrated to a different location when it becomes too large. This should be done during a maintenance window during off-ours. A read-only replica can be stood up to handle any incoming read requests during that time. The API app is stateless and could continue on the k8s cluster for as long as is allowed. Option B is a viable alternative. Assuming the "exsting platform" is whatever the existing IT support app is currently running on and it's not the k8s cluster, that's mostly the same as what I propse but you wouldn't enjoy the auto-scaling or recovery that k8s provides.
2. Verify actual usage of the app and compare costs between different options. Assuming you're using a cloud provider, you pay a constant rate for running a VM. Kubernetes and cloud apps only for usage. If the price per use multiplied by the stated usage is lower than running a VM, the latter will be more cost effective. Also validate the recovery time for the deployment meets the requirements. If it becomes unavailable, does it automatically spin up a healthy instance? How long does that take to notice and perform? Are there backups on the database? How far back do they go?
3. Given more time, it would be more maintainable to have a deployment for this app separate from whatever is already on the existing k8s cluster and managed PostgreSQL instance. This separates concerns and prevents accidental impact on the other when doing deploys. Having a separate deployment needs to be cheaper than using exsting underutilized resources. In Azure, at least, you can configure the requirements like disaster recovery, auto scaling, and data retention in a deployment so you could still get those things. I assume those features are similarly available in other cloud providers.

### B2. CI feedback loop

**Situation**

The code repository holds a workflow file at `.github/workflows/ci.yml`. It runs install, lint, typecheck, and tests in one job, with no cache. Imagine that the team and its test suite grow, and a run now takes 14 minutes. AI tools double the number of pull requests. These numbers are made up for this question.

**Constraints**

- Engineers wait for CI before they merge. Some rerun a failed job until it passes.
- Runner minutes cost money.
- One engineer maintains the pipeline alongside other work.
- The team wants quick feedback without a large bill or a pipeline nobody can follow.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. What would you measure first?
2. What would you change, in what order, and why?
3. What would you choose not to add, and why?

**Notes for this option**

Exact tool names are not needed. We care about your reasoning and its tradeoffs.

**Your answer (fill in only if you pick B2)**

_Write your answer here._

## C. Performance

### C1. Performance and capacity

**Situation**

Several staff members report that the support-request dashboard loads slowly. It lists requests and their current status, and allows users to export request history. You need to investigate before deciding whether to optimize or add capacity.

The single-vCPU server applies to this question only. It does not limit any other answer you write.

**Observations**

- When you try the dashboard yourself, you notice no apparent slowness. You have not recorded a load time, so this is an impression rather than a measurement.
- Static browser assets are served through a CDN; the API runs on a single-vCPU server. The cause of the reported delay is unknown.
- In a separate API measurement, an uncached request uses 8 ms of CPU and waits 40 ms for the database.
- Many reads repeat. Some responses are public; others depend on the caller’s permissions.
- An export can contain a million records.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. How would you investigate the difference between your experience and staff reports? How would you measure total browser latency from opening the page until it is usable, rather than only API processing time?
2. Separately, what is the API’s rough CPU-only throughput ceiling?
3. Choose two changes you would investigate. Explain what they might improve and what could go wrong.
4. How would you keep export memory use bounded? What evidence would justify changing the framework or language?

**Notes for this option**

The numbers are simplified. We care about your reasoning, not benchmark knowledge.

**Your answer (fill in only if you pick C1)**

_Write your answer here._

### C2. Chatty frontend load

**Situation**

The support dashboard is still changing every week while the product team learns what staff need. For each request in the list, the browser makes separate calls to fetch the requester and the status history. The API runs one database query per call.

**Details**

- A page shows 50 requests, and 200 staff use the dashboard during business hours.
- Some responses depend on who asks, because support staff see only their assigned groups.
- Nobody has measured the load yet. Staff have only said the page feels slow at busy times.
- Two engineers own both the frontend and the backend.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. How would you find where the load comes from?
2. Which option fits now, and why: a batch or include endpoint, a loader that batches queries, a cache, or something else?
3. What evidence would make you change that choice?

**Notes for this option**

We care more about your reasoning on tradeoffs than about the most optimized design. Say what you would leave alone for now.

**Your answer (fill in only if you pick C2)**

_Write your answer here._

**Answers**

1. Coallate request logs by time and user. Compare results to find how many users are on their dashboard in a given space of time, how long a request takes, and look for which kinds of requests take the longest. Also check if the request times increase with number of users making requests. From there, dive into the long running request code and database queries. Determine where the bottleneck is there. You could also use SQL profiling tools to find out which part of slow SQL queries are the cause of slowness. The tradeoff is searching logs could take a while to do by hand if your logging tools don't already let you slice and dice the gathered log metrics.
2. Batch or include endpoint. Time spent making the request and handling the response on the client side, traveling over the network, and going out to the database on the server side adds up at 50 calls per page. Worst case scenario of all 200 staff checking the dashboard simultaneously at 50 calls per page is 10,000 API calls at once. Reducing overall I/O time with a single API call would save a lot of time. One tradeoff would be leaving the database to handle all the requests, but it should be able to handle 200 calls in a short window.
3. If evidence showed the database was getting bogged down by heavy simultaneous load, a cache would be the right answer. A lot of the data in a dashboard about support tickets isn't going to be changing second by second, so storing that data in memory would make reads much faster.

## D. Delivery

### D1. Delivery under uncertainty

**Situation**

Some support requests are handled by an outside supplier. The team wants its status updates reflected in our application. A colleague asks us to “keep the systems in sync,” with a pilot due Friday.

**Additional context**

- The dashboard can lag ten minutes. A separate escalation workflow may need every status transition in order, but that requirement is unclear.
- The supplier has a current-state API and webhooks. We have not checked webhook coverage, retries, or replay.
- One colleague prefers polling; another prefers events.
- Product approves the happy-path demo and asks whether the feature is done.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. What would you clarify or inspect first? What would polling and events each do here?
2. Propose a first delivery. How would it handle missed or duplicate information?
3. What would establish that it is useful? How would you handle a deadline that requires a narrower scope?

**Your answer (fill in only if you pick D1)**

_Write your answer here._

**Assumptions**

- The dashboard doesn't show external ticket status. What it does show is our internal ticket which is logically linked to the external ticket. In other words, the status of the internal ticket should be updated as the external ticket is, which is then reflected on the dashboard.

**Answers**

1. Whether to implement with polling or webhooks hinges on whether every status transition needs to be shown in order. That is the first thing I would clarify. If it is required, polling won't be enough. Polling might lose quick state transitions if multiple happen in between poll calls. So following that confirmation I would check on the supplier's webhook coverage, retry, and replay capabilities. The tradeoff of webhooks is if our service is down when the webhook comes in we can miss the status change without the webhook retrying. That would lead to tickets stuck in an old state and potentially never getting udpated again. That could be resolved with a periodic, perhaps nightly, poll job that updated tickets handled by the supplier using their current-state API.
2. Polling is faster and easier to implement than webhooks so for a first delivery I would use polling. Webhooks could be added later. This has the potential to miss state changes, as described in answer 1. Assuming integration with the separate escalation workflow isn't needed for the pilot due on Friday, missing state changes won't be an issue. A potential tradeoff of implementing with polling is getting rate limited by the supplier's API. Adding some exponential backoff with jitter to the polling logic could alleviate that. Also, if the polling process dies for some reason, that ticket won't get updated anymore. The periodic status update job mentioned in answer 1 could help with that. It could be tailored to only update tickets that are in an incomplete status to finish quicker.
3. This change would be useful if it it saved money in some way such as reducing the amount of work support requires to close one of these external tickets. Another indicator of success would be raising awareness of staff on the status of their support tickets. If the deadline was such that we had to narrow the scope, I'd focus on only the absolutely necessary and spelled out requirements.

### D2. Prototype, then refine or re-spec

**Situation**

Product asks for automatic routing of support requests to support groups. An engineer builds a one-day prototype with AI tools. It works on happy-path sample data. In the demo, the team learns that the routing rules are messier than anyone said.

**Details**

- Product wants to know by Friday whether the idea is worth building.
- Nobody has written a spec yet.
- Two engineers are available, and other work continues.

**Answer these questions**

Give a recommendation, its main tradeoff, and one thing that could change it. State your assumptions.

1. How would you scope the prototype, and what should it prove?
2. After the demo, how would you decide whether to refine the prototype or write a better spec?
3. What would you keep, what would you throw away, and why?

**Notes for this option**

Prefer the simplest approach that meets the need, and say what evidence would justify more complexity.

**Your answer (fill in only if you pick D2)**

_Write your answer here._
