// /home/felipeagx/work/nexus/globals/output/Print.ts
import path from 'node:path'
// @deno-types="npm:@types/node"
import { fileURLToPath } from 'node:url'

export class Print {
  private fileIdentificator: string
  private fixedAlternativePrefix: string

  constructor(fixedAlternativePrefix?: string) {
    this.fixedAlternativePrefix = fixedAlternativePrefix || ''
    this.fileIdentificator = Print.getCallerFileName() || 'UNKNOWN_FILE'
  }

  public success(message: string, content?: unknown): void {
    if (content) {
      message += ':' + Deno.inspect(content, { colors: true, depth: 8 })
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${this.fixedAlternativePrefix}${message}`,
      'green',
    )
  }

  public error(message: string, content?: unknown): void {
    if (content) {
      message += ':' + Deno.inspect(content, { colors: true, depth: 8 })
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${message}`,
      'red',
    )
  }

  public info(message: string, content?: unknown): void {
    if (content) {
      message += ': ' + Deno.inspect(content, { colors: true, depth: 8 })
    }
    this.logWithColor(
      `[${this.fileIdentificator}] ${this.fixedAlternativePrefix} ${message}`,
      'blue',
    )
  }
  private logWithColor(message: string, color: 'green' | 'red' | 'blue'): void {
    const colorCodes = {
      green: '\x1b[32m',
      red: '\x1b[31m',
      blue: '\x1b[34m',
      reset: '\x1b[0m',
    }
    console.log(`${colorCodes[color]}${message}${colorCodes.reset}`)
  }

  private static getCallerFileName(): string | null {
    let potentialFileName: string | undefined = undefined
    try {
      const originalPrepareStackTrace = (Error as any).prepareStackTrace
      ;(Error as any).prepareStackTrace = (_: any, stack: NodeJS.CallSite[]) => stack
      const err = new Error()
      const stack = err.stack as unknown as NodeJS.CallSite[]
      ;(Error as any).prepareStackTrace = originalPrepareStackTrace

      const callerIndex = 2
      if (stack && stack.length > callerIndex) {
        potentialFileName = stack[callerIndex]?.getFileName() ?? undefined
      }
    } catch (e) {
      console.warn(
        '[Print] Failed to use structured stack trace, falling back to string parsing.',
        e,
      )

      const err = new Error()
      console.log('--- DEBUG: String Stack Trace ---')
      console.log(err.stack)
      console.log('--- END DEBUG ---')
    }

    if (!potentialFileName) {
      try {
        const err = new Error()
        const stackLines = err.stack?.split('\n')

        console.log('--- DEBUG: String Stack Lines ---')
        stackLines?.forEach((line, index) => console.log(`[${index}] ${line}`))
        console.log('--- END DEBUG ---')

        const callerIndex = 3 
        if (stackLines && stackLines.length > callerIndex) {
          const callerLine = stackLines[callerIndex]
          const match = callerLine?.match(
            /(?:at |@)?(?:file:\/\/\/|\()([^):]+)/,
          )
          if (match && match[1]) {
            potentialFileName = match[1].trim()
          }
        }
      } catch (parseError) {
        console.error('[Print] Error parsing stack trace string:', parseError)
        return null
      }
    }

    if (!potentialFileName) {
      console.warn(
        '[Print] Could not determine caller filename from stack trace.',
      )
      return null
    }

    try {
      let filePath = potentialFileName
      if (filePath.startsWith('file:///')) {
        filePath = fileURLToPath(filePath)
      }
      const fileNameWithExt = path.basename(filePath)
      const ext = path.extname(fileNameWithExt)
      const fileNameWithoutExt = fileNameWithExt.slice(
        0,
        ext ? -ext.length : undefined,
      )
      return fileNameWithoutExt.toUpperCase()
    } catch (pathError) {
      console.error(
        '[Print] Error processing potential filename:',
        potentialFileName,
        pathError,
      )
      return path.basename(potentialFileName).toUpperCase()
    }
  }
}