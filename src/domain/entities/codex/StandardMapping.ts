export type StandardMapping = {
  stateId: string
  stateStandardName: string
  gradeBand: {
    band: string
    standardDomain: {
      standard: string
      domain: string
      description: string
      disneyCodeillusionLesson: string[]
      cse: string[]
    }[]
  }[]
}
