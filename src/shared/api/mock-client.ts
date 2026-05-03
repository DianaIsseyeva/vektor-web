import { delay } from "@/shared/api/delay";

export async function mockRequest<TResult>(handler: () => TResult, delayMs = 450): Promise<TResult> {
  await delay(delayMs);
  return handler();
}
