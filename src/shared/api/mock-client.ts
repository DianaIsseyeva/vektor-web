import { delay } from "@/shared/api/delay";

function getRandomDelay() {
  return 300 + Math.random() * 500;
}

export async function mockRequest<TResult>(
  handler: () => TResult,
): Promise<TResult> {
  await delay(getRandomDelay());
  if (Math.random() < 0.05) {
    throw new Error("Mock API error. Please retry.");
  }
  return handler();
}
