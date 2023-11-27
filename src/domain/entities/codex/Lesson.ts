export type Lesson = {
  id: string
  url: string
  name: string
  course: Course
  lessonEnvironment: LessonEnvironment
  description: string
  theme: string
  skillsLearnedInThisLesson: string
  lessonObjectives: string
  lessonDuration: string
  thumbnailImageUrl: string
  lessonOverViewPdfUrl: string | null
  projectName: string | null
  scenarioName: string | null
  maxStarCount: number
  quizCount: number | null
  hintCount: number | null
  level: Level
}

export type Course = 'basic' | 'webDesign' | 'mediaArt' | 'gameDevelopment' | ''

// We currently only have "LiT Lesson Player" as an Environment, but we will add external project etc. like "Magic Quest" in the future.
export type LessonEnvironment = 'litLessonPlayer'

export type Level = 'basic' | 'advanced' | 'heroic' | 'adventurous'
