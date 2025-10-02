import { Actor, AnyActorLogic, InputFrom, SnapshotFrom, waitFor } from "xstate"
import { createActor } from "xstate"

export type WaitPredicate<TActorRef extends AnyActorLogic = AnyActorLogic> = (emitted: SnapshotFrom<TActorRef>) => boolean

export interface RunOptions<TMachine extends AnyActorLogic> {
  wait: boolean
  waitPredicate: WaitPredicate<TMachine>
  timeout: number
}

const defaultWaitPredicate: WaitPredicate = (state) => state.matches("done")
const defaultTimeout = 60 * 1000

/**
 * create a Runner that hold the singleton instance of Actor
 * call `Runner.run()` to run the machine, which will call `waitFor` to wait machine state match `"done"` by default
 * 
 * @param machine 
 * @param input 
 * @returns 
 * 
 * @example
 * ```ts
 * const runner = singletonRunner(machine, input)
 * runner.run()
 * ```
 */
export function singletonRunner<TMachine extends AnyActorLogic, TInput extends InputFrom<TMachine>> (machine: TMachine, input: TInput) {
  let actor: Actor<any> | null = null
  return {
    async run({ wait = true, waitPredicate = defaultWaitPredicate, timeout = defaultTimeout }: Partial<RunOptions<TMachine>> = {}) {
      actor = actor ?? createActor(machine, { input })
      actor.start()
      if (wait) {
        await waitFor(actor, waitPredicate, { timeout })
      }
      return actor
    },
    async waitFor({ waitPredicate = defaultWaitPredicate, timeout = defaultTimeout }: Partial<Pick<RunOptions<TMachine>, "waitPredicate" | "timeout">> = {}) {
      if (!actor) { return }
      return await waitFor(actor, waitPredicate, { timeout })
    }
  }
}

/**
 * run machine in singleton mode default
 * @param machine 
 * @param input 
 * @returns 
 * 
 * @example
 * ```ts
 * await runMachine(machine, input)
 * ```
 */
export async function runMachine<TMachine extends AnyActorLogic, TInput extends InputFrom<TMachine>> (machine: TMachine, input: TInput) {
  const runner = singletonRunner(machine, input)
  return await runner.run()
}
