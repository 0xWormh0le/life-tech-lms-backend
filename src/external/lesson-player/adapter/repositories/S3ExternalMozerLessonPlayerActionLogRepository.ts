import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../../../domain/usecases/shared/Errors'
import { ExternalMozerLessonPlayerActionLog } from '../../domain/entities/ExternalMozerLessonPlayerActionLog'
import { S3 } from 'aws-sdk'
import { ulid } from 'ulid'
import { Readable } from 'stream'
import dayjs from 'dayjs'

export class S3ExternalMozerLessonPlayerActionLogRepository {
  s3: S3

  bucketName: string

  directory: string

  constructor() {
    this.s3 = new S3({})

    if (
      !process.env.AWS_PROFILE &&
      (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY)
    ) {
      throw new Error()
    }
    this.bucketName = process.env.S3_LOG_BUCKET_NAME ?? `dev-log-codex`
    this.directory = `external/mozerLessonPlayer/actionLog/`
  }

  issueId = async (): Promise<Errorable<string, E<'UnknownRuntimeError'>>> =>
    successErrorable(ulid())

  create = async (
    externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
    try {
      const log = externalMozerLessonPlayerActionLog.log
      const eventName =
        log &&
        typeof log === 'object' &&
        'event_name' in log &&
        typeof log.event_name === 'string'
          ? log.event_name
          : 'other'
      const key = this.createObjectKey(
        eventName,
        externalMozerLessonPlayerActionLog.id,
        externalMozerLessonPlayerActionLog.createdAt,
      )

      await this.s3
        .putObject({
          Bucket: this.bucketName,
          Key: key,
          Body: this.transformToObjectBody(externalMozerLessonPlayerActionLog),
        })
        .promise()

      return successErrorable(undefined)
    } catch (e) {
      return failureErrorable(
        'UnknownRuntimeError',
        `failed to create: ${JSON.stringify(
          externalMozerLessonPlayerActionLog,
        )}`,
        e,
      )
    }
  }

  findByIdAndCreatedAt = async (
    eventName: string,
    id: string,
    createdAt: Date,
  ): Promise<
    Errorable<
      ExternalMozerLessonPlayerActionLog | null,
      E<'UnknownRuntimeError'>
    >
  > => {
    try {
      const file = await this.s3
        .getObject({
          Bucket: this.bucketName,
          Key: this.createObjectKey(eventName, id, createdAt),
        })
        .promise()
      const streamToString = (stream: Readable) =>
        new Promise<string>((resolve, reject) => {
          const chunks: Uint8Array[] = []

          stream.on('data', (chunk: Uint8Array) => chunks.push(chunk))
          stream.on('error', reject)
          stream.on('end', () => resolve(Buffer.concat(chunks).toString()))
        })
      let content: string

      if (file.Body instanceof Readable) {
        content = await streamToString(file.Body)
      } else if (file.Body instanceof Buffer) {
        content = file.Body.toString()
      } else {
        return failureErrorable(
          'UnknownRuntimeError',
          `failed read file.Body. it's not Readable instance.`,
        )
      }

      const externalMozerLessonPlayerActionLog =
        this.transformToDomainEntity(content)

      return successErrorable(externalMozerLessonPlayerActionLog)
    } catch (e) {
      if (
        !!e &&
        typeof e === 'object' &&
        'code' in e &&
        e['code'] === 'NoSuchKey'
      ) {
        return successErrorable(null)
      }

      return failureErrorable(
        'UnknownRuntimeError',
        `failed to get externalMozerLessonPlayerActionLog. id: ${id}`,
        e,
      )
    }
  }

  private transformToDomainEntity = (
    objectBody: string,
  ): ExternalMozerLessonPlayerActionLog => {
    const isExternalMozerLessonPlayerActionLog = (
      parsed: unknown,
    ): parsed is Omit<ExternalMozerLessonPlayerActionLog, 'createdAt'> & {
      createdAt: string
    } => {
      if (!parsed || typeof parsed !== 'object') {
        return false
      }

      if (!('id' in parsed) || typeof parsed.id !== 'string') {
        return false
      }

      if (!('userId' in parsed) || typeof parsed.userId !== 'string') {
        return false
      }

      if (!('log' in parsed) || typeof parsed.log !== 'object') {
        return false
      }

      if (!('createdAt' in parsed) || !(parsed.createdAt !== 'string')) {
        return false
      }

      return true
    }

    const parsed: unknown = JSON.parse(objectBody)

    if (!isExternalMozerLessonPlayerActionLog(parsed)) {
      throw new Error(
        `action log is not type of ExternalMozerLessonPlayer. value: ${objectBody}`,
      )
    }

    const domainEntity: ExternalMozerLessonPlayerActionLog = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    }

    return domainEntity
  }

  private transformToObjectBody = (
    domainEntity: ExternalMozerLessonPlayerActionLog,
  ): string => {
    return JSON.stringify({
      ...domainEntity,
      createdAt: this.convertDateTimeToHiveFormat(domainEntity.createdAt),
    })
  }

  private convertDateTimeToHiveFormat = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss.SSS')
  }

  private convertStringToS3KeySafe = (original: string): string => {
    return original.replace(':', '').replace(' ', '')
  }

  private createObjectKey = (
    eventName: string,
    id: string,
    createdAt: Date,
  ): string => {
    const dateTimeStrS3KeySafe = this.convertStringToS3KeySafe(
      `${createdAt.getUTCFullYear()}${(createdAt.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0')}${createdAt
        .getUTCDate()
        .toString()
        .padStart(2, '0')}`,
    )
    const fileName = this.convertStringToS3KeySafe(
      `action_log_${dateTimeStrS3KeySafe}_${id}.json`,
    )

    return `${this.directory}${eventName}/date=${dateTimeStrS3KeySafe}/${fileName}`
  }
}
