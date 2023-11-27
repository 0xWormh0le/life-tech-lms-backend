export type CsePackage = {
  id: string
  name: string
  headerButtonLink: string | null
  headerButtonText: string | null
  units: {
    id: string
    name: string
    description: string
    lessons: {
      id: string
      isQuizLesson: boolean
    }[]
  }[]
}
