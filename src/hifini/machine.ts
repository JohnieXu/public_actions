import { setup, fromPromise, assign } from "xstate"
import * as api from "./api.js"
import { makeMailSender } from "../utils/sendMail.js"
import * as config from "../utils/config.js"

const doCheckin = fromPromise<string, {domain: string, cookie: string }>((a) => api.checkin({
  domain: a.input.domain,
  cookie: a.input.cookie,
}))

const doSendEmail = fromPromise<any, { type: "success" | "error", domain: string, emailTo: string, data: any }>(({ input }) => {
  const mailSender = makeMailSender(input.domain, input.emailTo, "hifiki自动签到")
  const toString = (data: any) => {
    if (typeof data === 'string') return data
    if (data instanceof Error) return data.message
    return JSON.stringify(data, null, 2)
  }
  if (input.type === "error") {
    return mailSender.sendFail(toString(input.data))
  }
  return mailSender.sendSuccess(toString(input.data))
})

export const machine = setup({
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
    | { type: "login" }
    | { type: "checkin" }
    | { type: "sendEmail" }
    | { type: "reset" }
    // guards: {} as
    // | { type: "isLogin" }
  },
  actions: {
  },
  actors: { doCheckin, doSendEmail }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAsCWAzVA7VA6AxsmPgNbYDEEA9lmLtgG5Ul1qY4FGnYKNX4BDAC6oaAbQAMAXUlTEoAA5VYqETXkgAHogCsARgDMuCQA4DANgDsBgwBYDevQCZLAGhABPRE70BOXE5OJiYSOjrmtr5O+gC+Me5s2HiExGRY5GAATplUmbgKADbC6LkAtriJHCncWLxYTIJqWLKyGkoqTRraCPpGphbWdg7Obp6IBk62AU4GOia9oXq2enEJGEmcqdgABLAArvj4cLCUNHR8LBXrVVxpuwdHsLB1DcKizdKtSCDtqu9diBMvhMuF8elCBiBvnM5j0YXcXgQTgk-mGQXMOhsthcOlWIEqyVuO32h2OGWyuXyRSEJUy5QJmxq91JTxe-De4k+0jayj+6m+3SBILBEKhMLhOgR3jCoL0wUsvkhlkmVjxDOqdyyOUyp1o9HqzFY10JWyw2y1uTZjXeLW531+nQFgOBstFvmhsPhYwQDimBgk5gkgyBcuBauNjM1FJ1FryhWKZSu7BNTNjVo5HxkdsUvMdoEFLpFmLFnsl3osEllFhhk39KPDyf1fwEBXIXxzHX+ToQeksOlwff9lnM0P6Bkso0RdksuDmzhRzkcllMDY2SRELfIGuw7Z+ua7+cQvf7g6DI8DZnHk+8MNwthCcPdcp0QT05lXHGotHImTgYCEu4OgeWjOsK4LFu64peoiJh6MYphgr4YSLhithxPEIBYFQEBwBoBI8p2-KHggAC05hSqR-butRNE0SY74YQy66oC2BF8lgAIINiFE2P2Tgji+oT3mYTgfimaRsXmIE+nCVZ2DoyozBMJg8UGuDBCYtjLJYzhIbYlhiZGxIPMcknAd05gmDOsz2LY+gjqOtgUT4M6hL4tgRMEQYzPMhnbmasZmUR0mWdZOi2fZkESE55aBMY4WvkEpjKuFhlfmAQUcd2zgTLghi2Cikz0eY-pOM5MrWH4lj0UGQYDOhMRAA */
  id: "hifini",
  context: ({ input }) => ({
    ...input,
  }),
  initial: "initial",
  states: {
    initial: {
      always: "checkin",

      on: {
        checkin: {
          target: "checkin",
          description: `start checkin`
        }
      }
    },
    checkin: {
      invoke: {
        src: "doCheckin",
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
        onError: "done",
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
        onError: "done",
      },
    },
    done: {
      type: "final",

      on: {
        reset: {
          target: "initial",
          reenter: true,
          description: `reset to initial, need to reset all the context`
        }
      }
    },
  }
})
