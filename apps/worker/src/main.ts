import { QueueEvents, Worker } from "bullmq";

const redisUrl = new URL(process.env.REDIS_URL ?? "redis://localhost:6379");

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || "6379"),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null
};

const queueName = "crm-background-jobs";

const worker = new Worker(
  queueName,
  async (job) => {
    // Placeholder processor for Phase 1.
    // eslint-disable-next-line no-console
    console.log(`[worker] processing job ${job.id} (${job.name})`);
    return { ok: true };
  },
  { connection }
);

const events = new QueueEvents(queueName, { connection });

events.on("completed", ({ jobId }) => {
  // eslint-disable-next-line no-console
  console.log(`[worker] job completed: ${jobId}`);
});

worker.on("failed", (job, error) => {
  // eslint-disable-next-line no-console
  console.error(`[worker] job failed: ${job?.id}`, error);
});

// eslint-disable-next-line no-console
console.log("Worker started");
