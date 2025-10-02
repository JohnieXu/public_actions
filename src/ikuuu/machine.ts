import { setup, createActor, fromPromise, assign } from "xstate"
import * as api from "./api.js"
import sendMail from "../utils/sendMail.js"
import { EmailOptions } from "../types/index.js";
import * as config from "../utils/config.js"


/**
 * 发送签到失败邮件
 */
async function sendFailMail(e: Error, domain: string, emailTo: string): Promise<void> {
  const message = e.message;
  const html = `
  <p style="font-size: 16px; color: #f00;">签到失败：</p>
  <code>${message}</code>
  `;

  const emailOptions: EmailOptions = {
    from: domain,
    to: emailTo,
    subject: 'ikuuu自动签到',
    html
  };

  try {
    await sendMail(emailOptions);
    console.log('邮件发送成功');
  } catch (e) {
    console.error(e, '邮件发送失败');
  }
}

/**
 * 发送签到成功邮件
 */
async function sendSuccessMail(message: string, domain: string, emailTo: string): Promise<void> {
  const html = `
  <p style="font-size: 16px; color: #333;">签到成功：</p>
  <code>${message}</code>
  `;

  const emailOptions: EmailOptions = {
    from: domain,
    to: emailTo,
    subject: 'ikuuu自动签到',
    html
  };

  try {
    await sendMail(emailOptions);
    console.log('邮件发送成功');
  } catch (e) {
    console.error(e, '邮件发送失败');
  }
}

const doLoginLogic = fromPromise<{ cookie: string }, {domain: string, userName: string, passWd: string }>((a) => api.login({
  domain: a.input.domain,
  userName: a.input.userName || '',
  passWd: a.input.passWd || ''
}))

const doCheckin = fromPromise<string, {domain: string, cookie: string }>((a) => api.checkin({
  domain: a.input.domain,
  cookie: a.input.cookie,
}))

const doSendEmail = fromPromise<any, { type: "success" | "error", domain: string, emailTo: string, data: any }>(({ input }) => input.type === "error" ? sendFailMail(input.data, input.domain, input.emailTo) : sendSuccessMail(input.data, input.domain, input.emailTo))

export const machine = setup({
  types: {
    context: {} as {
      domain: string
      userName: string
      passWd: string
      cookie: string
      emailTo: string
      result?: string | Object
      error?: Error
    },
    input: {} as {
      domain: string
      userName: string
      passWd: string
      emailTo: string
    },
    events: {} as
    | { type: "login" }
    | { type: "checkin" }
    | { type: "sendEmail" },
    // guards: {} as
    // | { type: "isLogin" }
  },
  actions: {
    doLogin: () => {

    }
  },
  actors: { doLoginLogic, doCheckin, doSendEmail }
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEsDWBXTA6ZA7ZALsgIYA2AxBAPa5g64BuVqdam69hJpCeTAxsSI0A2gAYAuuImJQAByqwuNWSAAeiAEwA2bVgAsAdgCcARk0AOQwFZNxzYYsAaEAE9Ep6wGYs17aYttQ11zC0DtAF8IlzZsPC4ycjAAJ2SqZKw5UiEAM3SAWxwMOPwiMl5GKkFhXGlpVQUlGtUNBB09IzNLGzsHZzdEL1NDLE1raytTMW0xTTExY2somOKOeLKKUiooPHqkEEblXBatXQMTUJ77Rxd3BCmfQy9tL0NNAOuF-WWQWI5+AAWYH4qDwlBorEqLCK7CwgOBoNwFQEQmQokke3kiiOJwQ2nGBle+k0QwsYgsxmmt0QFh8Xn01jepk6+m0xh+fzhQJBYJSaQyWVyBRh2HhPKRfCqqPRUkkDWxzX2rXx1kJhmJpPJlO01PuNiw-jMFmsYleNjekWiv1WXIReAABLB0Px+HBYODaPQmNDOWLEY7na7YLBkVKanU5ftDorQK0pvpTAZjIFzCaKfZNLqzFhjWJ9LT9MT7EFvlbfdz-U6XW6kql0plsgQ8slCuW7bgA9Xg6HqmjahjI1imn3cfHE-pk-4xlqM7rTF4LAb1U9PNp85YlmWbX6HXz0h7Id7WNuK7u68ke9L+7KZFGFSOlR48+PJ6mZ5pMwM2qysPN55YGULY15w5E923tPdklrfkGyFFsRX+U8O0gy9wwHW8hxxR97mfJMU2ndMPznYxjCwYZDHMGYKUsBdLStXAqAgOBVD+eVhxUbCAFodS-TjVRIgTBKErxQNhdZuDYrDY0QYk5zERMLFMYxXjGV4vAmdkt1hHdjjvdjdOkhAGUXEk2S8Yx8TZSlTB4u5Fl8YkTHmZcAm0TRRNFJDOyDeA9Kk9QaTsLAzHxZ4-DGbxbJpRMvA-MxrBIwtpktFZtK8yDJJjAKEAsIKQsi8LxmeOcwgNCdximZk10MDyOGoWhMofQzzH0MQsHU65KWUmz9C8OdWoNZSEocBkKPU0soiAA */
  id: "ikuuu",
  context: ({ input }) => ({
    ...input,
    cookie: "",
  }),
  initial: "initial",
  states: {
    initial: {
      invoke: {
        src: "doLoginLogic",
        input: (a) => ({
          domain: a.context.domain,
          userName: a.context.userName,
          passWd: a.context.passWd,
        }),
        onDone: {
          target: "checkin",
          actions: assign((a) => ({
            ...a.context,
            cookie: a.event.output.cookie
          }))
        },
        onError: {
          target: "checkin error",
          actions: assign((a) => ({
            ...a.context,
            error: a.event.error as any
          }))
        }
      },
      on: {
        // TODO: how to invoke login actor on event call
        login: [
          {
            target: "checkin",
          }
        ]
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
      type: "final"
    },
  }
})
