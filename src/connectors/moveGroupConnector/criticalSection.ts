import { Mutex, MutexInterface, withTimeout } from "async-mutex";
import MutexTimeoutError from "../../errors/mutexTimeoutError";

const CRITICAL_SECTION_TIMEOUT_MS = 12_000;
export default (callback: MutexInterface.Worker<unknown>) => {
  return withTimeout(
    new Mutex(),
    CRITICAL_SECTION_TIMEOUT_MS,
    new MutexTimeoutError(CRITICAL_SECTION_TIMEOUT_MS)
  ).runExclusive(() => callback());
};
