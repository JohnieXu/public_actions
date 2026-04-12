import { fromPromise } from "xstate";
import { makeMailSender } from "@@utils/sendMail.js";
import config from "@@utils/config.js"

const emailConfig = config.email();

/**
 * Send email by invoking xstate actor
 * @param subject the email subject
 * @param actionName action name for loading instructions (optional)
 * @returns
 */
export const emailActor = (
  subject: string,
  actionName?: string
) => fromPromise<any, {
  type: "success" | "error",
  domain: string,
  emailTo: string,
  data: any
}>(({ input }) => {
  const mailSender = makeMailSender(
    emailConfig.user,
    emailConfig.pass,
    input.domain,
    input.emailTo,
    subject,
    actionName
  )
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
