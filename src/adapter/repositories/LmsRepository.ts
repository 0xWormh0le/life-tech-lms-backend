import { DataSource } from 'typeorm'
import { Lms } from '../../domain/entities/codex/Lms'

import { Errorable, E } from '../../domain/usecases/shared/Errors'

const LMSInfo: { [key in Lms['id']]: Lms } = {
  google: { id: 'google', name: 'Google' },
  clever: { id: 'clever', name: 'Clever' },
  classlink: { id: 'classlink', name: 'Classlink' },
}

export class LmsRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getLmsInfoById(
    id: string,
  ): Promise<Errorable<Lms, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
    const Lms = LMSInfo[id]

    if (!Lms) {
      return {
        hasError: true,
        error: {
          type: 'NotFoundError',
          message: `given Lms id ${id} not exist`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: Lms,
    }
  }
}
