export type Package = {
  id: string
  packageCategoryId: 'codeillusion' | 'cse'
  name: string
  level: 'basic' | 'advanced'
  headerButtonLink: string | null
  headerButtonText: string | null
  redirectUrlWhenAllFinished: string | null
}
