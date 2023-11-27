import { HardCordedCurriculumPackageRepository } from './HardCordedCurriculumPackageRepository'

describe('HardCordedCurriculumPackageRepository', () => {
  let hardCordedCurriculumPackageRepository: HardCordedCurriculumPackageRepository

  beforeAll(async () => {
    hardCordedCurriculumPackageRepository = new HardCordedCurriculumPackageRepository()
  })

  test('findById', async () => {
    const res = await hardCordedCurriculumPackageRepository.findById('codeillusion-package-basic-full-premium-heroic')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      id: 'codeillusion-package-basic-full-premium-heroic',
      curriculumBrandId: 'codeillusion',
      name: 'Full Book - Premium (Hero)',
      level: 'basic',
    })
  })

  test('findByIds', async () => {
    const res = await hardCordedCurriculumPackageRepository.findByIds([
      'codeillusion-package-basic-full-premium-heroic',
      'codeillusion-package-basic-full-standard',
      'invalid',
    ])

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        id: 'codeillusion-package-basic-full-premium-heroic',
        curriculumBrandId: 'codeillusion',
        name: 'Full Book - Premium (Hero)',
        level: 'basic',
      },
      {
        id: 'codeillusion-package-basic-full-standard',
        curriculumBrandId: 'codeillusion',
        name: 'Full Book - Standard',
        level: 'basic',
      },
    ])
  })

  test('findAllByPackageCategoryId', async () => {
    const res = await hardCordedCurriculumPackageRepository.findAllByPackageCategoryId('cse')

    if (res.hasError) {
      throw new Error(res.error.message)
    }

    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        id: 'cse-package-full-standard',
        curriculumBrandId: 'cse',
        name: 'Computer Science Essentials',
        level: 'basic',
      },
    ])
  })
})
