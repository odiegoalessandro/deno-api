import { NextFunction, Request, Response } from 'express';
import requestCheck from "request-check";

interface IRule {
  validator: (value: any) => boolean
  message: string
  isRequired?: boolean
}

export const validateRequest = (
  requiredFields: string[],
  rules: Record<string, IRule>,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rc = requestCheck.default()

    for (const field in rules) {
      rc.addRule(field, {
        ...rules[field],
      })
    }

    const data: Record<string, any> = {}
    requiredFields.forEach(f => {
      data[f] = req[source][f]
    })
    for (const key in rules) {
      data[key] = req[source][key]
    }

    const errors = rc.check(data)

    if (errors) {
      return res.send_badRequest("Invalid fields", errors)
    }

    next()
  }
}
