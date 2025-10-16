import { fromPromise } from "xstate";
import { makeMailSender } from "@@utils/sendMail.js";

/**
 * Send email by invoking xstate actor
 * @param subject the email subject
 * @returns 
 */
export const emailActor = (subject: string) => fromPromise<any, { type: "success" | "error", domain: string, emailTo: string, data: any }>(({ input }) => {
  const mailSender = makeMailSender(input.domain, input.emailTo, subject)
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
