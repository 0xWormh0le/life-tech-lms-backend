export interface Lesson {
  id: string
  url: string
  name: string
  course: 'basic' | 'webDesign' | 'mediaArt' | 'gameDevelopment' | ''
  lessonEnvironment: 'litLessonPlayer'
  description: string
  theme: string
  skillsLearnedInThisLesson: string
  lessonDuration: string
  lessonOverViewPdfUrl: string
  thumbnailImageUrl: string
  projectName: string | null
  scenarioName: string | null
  maxStarCount: number
  quizCount: number | null
  hintCount: number | null
  level: 'basic' | 'advanced' | 'heroic' | 'adventurous'
}
