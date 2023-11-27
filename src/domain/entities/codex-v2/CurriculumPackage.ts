import { CurriculumBrand } from './CurriculumBrand'

export type CurriculumPackage = {
  id: string
  curriculumBrandId: CurriculumBrand['id']
  name: string
  level: 'basic' | 'advanced'
}
