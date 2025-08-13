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
  /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgNwBdd0AbAYggHtCz8A3RgazBLSz0KlyVWggIdM6KswDaABgC68hYlAAHRrEq5mqkAA9EAJgBsAVhImAjAGYjAdjNyALFfsmTcmwBoQAT0QrM2cSAE57Z08bAA57GPt7aOcAX2TfPhwCYlZtWjowACcCxgKSNRopADMS1F4MTMEckRoxdkZJaXxlZT0NLU69QwRTC2s7Rxc3Dy9fAOHooxIzaLlQ52XnOTNQ6OjU9PqBbOFqehpGKAIepBA+7V0boZHLWwcnV3co2cCtkitnUJyJKhJxGMH2Kz7EAZI6kHBgTCcAgMZg8cRcHgwrJw7AIpH4VoSKQ6LqKa7qTT3fCDRDmRZGUJrGyhIw2MxWNbRb4IJJLGxbULWVyRORGPZpaGHbEkeGI5GFYqlcpVGp1fjS2X4wntYmyMmKXqUgaPWlmemM5zM1nszncqZhBz2IwA1mOQWpCX4RgQOB6LGCQ39Ek0hAAWhM3NDFkZMdjcZsUP9x3wuRogapIecRm5Rm2JAZos2Kw8plZialjU1BHTxtAQ3WFjMJnciXcZmZgrtNnsYU8ziSNhsQWiZjM5fVjSYhBrwZNPNzJG7rOb8TkQNC3OiVkXYNCHJ2jP5JgTEqTpAVJRnDzriAWFiXNhXsTX0Q3-mMx7CLjNYtcTjWY4ekAA */
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
          target: "error",
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
          target: "done",
          actions: assign((a) => ({
            ...a.context,
            result: a.event.output
          }))
        },
        onError: {
          target: "error"
        }
      }
    },
    done: {
      invoke: {
        src: "doSendEmail",
        input: (a) => ({
          type: "success",
          data: a.context.result,
          domain: a.context.domain,
          emailTo: a.context.emailTo,
        })
      },
      type: "final"
    },
    error: {
      invoke: {
        src: "doSendEmail",
        input: (a) => ({
          type: "error",
          data: a.context.error,
          domain: a.context.domain,
          emailTo: a.context.emailTo,
        })
      },
      type: "final"
    }
  }
})

let actor: ReturnType<typeof createActor> | null = null

export const getActor = (input: {
  domain: string,
  userName: string,
  passWd: string,
  emailTo: string,
}) => {
  if (actor === null) {
    actor = createActor(machine, { input })
  }
  return actor
}
