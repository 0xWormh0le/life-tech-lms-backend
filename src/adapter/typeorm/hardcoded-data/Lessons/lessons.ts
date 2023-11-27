// Defined in Codex Master Data Sheet
// Refer: https://docs.google.com/spreadsheets/d/1hXUeCZgIUyx_liykNu6tlDJVwPu7MLKu_TIOoBwvdTo/edit#gid=0

import { Lesson } from '../../../../domain/entities/codex/Lesson'
import { lessonsIdArray } from './lessonsIdArray'
import { lessonsIndexedMap } from './lessonsIndexedMap'

export const lessons = (lessonPlayerBaseUrl: string, staticFileBaseUrl: string): Lesson[] => {
  return lessonsIdArray.map((id) => lessonsIndexedMap(lessonPlayerBaseUrl, staticFileBaseUrl)[id])
}
