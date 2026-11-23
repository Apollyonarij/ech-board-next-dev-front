import { RequestError, describeError, type Failure } from '../model/errors'

export function failure(error: unknown): Failure {
  if (error instanceof RequestError) {
    console.error('RequestError details:', error.detail)
  } else {
    console.error(error)
  }
  return describeError(error)
}
