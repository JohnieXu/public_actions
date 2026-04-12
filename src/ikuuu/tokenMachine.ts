import { setup, fromPromise, assign } from "xstate"
import { tokenCheckin } from "./api.js"
import { emailActor } from "@@common/actors/email.js"

// Token 方式直接签到，无需登录步骤
const doTokenCheckin = fromPromise<string, { domain: string, cookie: string }>((a) => tokenCheckin({
  domain: a.input.domain,
  cookie: a.input.cookie,
}))

const doSendEmail = emailActor("ikuuu自动签到（Token方式）", "ikuuu")

export const tokenMachine = setup({
  types: {
    context: {} as {
      domain: string
      cookie: string
      emailTo: string
      result?: string | Object
      error?: Error
    },
    input: {} as {
      domain: string
      cookie: string
      emailTo: string
    },
    events: {} as
    | { type: "checkin" }
    | { type: "sendEmail" }
  },
  actions: {},
  actors: { doTokenCheckin, doSendEmail }
}).createMachine({
  id: "ikuuu-token",
  context: ({ input }) => ({
    ...input,
  }),
  initial: "initial",
  states: {
    initial: {
      invoke: {
        src: "doTokenCheckin",
        input: (a) => ({
          domain: a.context.domain,
          cookie: a.context.cookie,
        }),
        onDone: {
          target: "checkin success",
          actions: assign((a) => ({
            ...a.context,
            result: a.event.output
          }))
        },
        onError: {
          target: "checkin error",
          actions: assign((a) => ({
            ...a.context,
            error: a.event.error as any
          }))
        }
      }
    },
    "checkin success": {
      invoke: {
        src: "doSendEmail",
        input: (a) => ({
          type: "success",
          data: a.context.result,
          domain: a.context.domain,
          emailTo: a.context.emailTo,
        }),
        onDone: "done",
        onError: {
          target: "done",
          actions: (a) => {
            console.error('Email sending failed:', a.event.error);
          }
        },
      },
    },
    "checkin error": {
      invoke: {
        src: "doSendEmail",
        input: (a) => ({
          type: "error",
          data: a.context.error,
          domain: a.context.domain,
          emailTo: a.context.emailTo,
        }),
        onDone: "done",
        onError: {
          target: "done",
          actions: (a) => {
            console.error('Email sending failed:', a.event.error);
          }
        },
      },
    },
    done: {
      type: "final"
    },
  }
})