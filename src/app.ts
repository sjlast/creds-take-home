import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import type { Notifier } from "./notifier.ts";
import type { RequestStore } from "./store.ts";
import { SupportRequestSubmission } from "./types.ts";

export interface AppDependencies {
  store: RequestStore;
  notifier: Notifier;
}

export function buildApp(deps: AppDependencies): FastifyInstance {
  const app = Fastify({ logger: false });

  app.get("/health", () => ({ status: "ok" }));

  app.get("/requests", () => deps.store.list());

  app.get<{ Params: { id: string } }>("/requests/:id", (request) => {
    let id: number | undefined = request.params.id
      ? Number(request.params.id)
      : undefined;
    const result = deps.store.getById(id);
    if (!result) {
      return "No support request found with that ID.";
    }
    return result;
  });

  app.post("/requests", async (request) => {
    const result = deps.store.create(request.body as SupportRequestSubmission);
    let supportNotified: boolean = false;
    await deps.notifier
      .send({
        subject: "New support ticket received",
        body: `${result.requester} has submitted a support request: ${result.title}`,
      })
      .then(() => {
        supportNotified = true;
      })
      .catch(() => {
        supportNotified = false;
      });
    return { supportNotified, request: result };
  });

  return app;
}
