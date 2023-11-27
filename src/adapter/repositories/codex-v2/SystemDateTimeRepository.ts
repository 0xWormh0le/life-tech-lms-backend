import {
  E,
  Errorable,
  successErrorable,
} from '../../../domain/usecases/shared/Errors'

export default class SystemDateTimeRepository {
  now = async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> =>
    successErrorable(new Date())
}
