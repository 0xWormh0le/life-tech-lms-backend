// Defined in Codex Master Data Sheet
// Refer: https://docs.google.com/spreadsheets/d/1hXUeCZgIUyx_liykNu6tlDJVwPu7MLKu_TIOoBwvdTo/edit#gid=495211288

import { CodeillusionPackageChapterDefinition } from '../../../../domain/entities/codex/CodeillusionPackageDefinition'

export const codeillusionPackageChapterDefinitions = (staticFileBaseUrl: string): CodeillusionPackageChapterDefinition[] => {
  const asStaticFileUrl = (path: string) => new URL(path, staticFileBaseUrl).toString()
  return [
    {
      id: 'chapter-codeillusion-1',
      name: 'Chapter 1',
      title: 'Welcome to Technologia',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-1-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-1-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-2',
      name: 'Chapter 2',
      title: 'When You Wish Upon a Magic Festival',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-2-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-2-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-3',
      name: 'Chapter 3',
      title: 'Beyond the Darkness',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-3-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-3-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-4',
      name: 'Chapter 4',
      title: 'Within the Time of Repetition',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-4-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-4-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-5',
      name: 'Chapter 5',
      title: 'A Forecasted Journey',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-5-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-5-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-6',
      name: 'Chapter 6',
      title: 'The Great Misfortune',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-6-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-6-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-7',
      name: 'Chapter 7',
      title: 'Technologia',
      lessonOverViewPdfUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-7-lesson-overview.pdf'),
      lessonNoteSheetsZipUrl: asStaticFileUrl('/teacher-resources/chapter-codeillusion-7-lesson-note-sheets.zip'),
    },
    {
      id: 'chapter-codeillusion-8',
      name: 'Chapter 8',
      title: '',
      lessonOverViewPdfUrl: '',
      lessonNoteSheetsZipUrl: '',
    },
    {
      id: 'chapter-codeillusion-9',
      name: 'Chapter 9',
      title: '',
      lessonOverViewPdfUrl: '',
      lessonNoteSheetsZipUrl: '',
    },
    {
      id: 'chapter-codeillusion-10',
      name: 'Chapter 10',
      title: '',
      lessonOverViewPdfUrl: '',
      lessonNoteSheetsZipUrl: '',
    },
    {
      id: 'chapter-codeillusion-11',
      name: 'Chapter 11',
      title: '',
      lessonOverViewPdfUrl: '',
      lessonNoteSheetsZipUrl: '',
    },
  ]
}
