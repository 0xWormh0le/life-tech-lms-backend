import { HardCordedCurriculumBrandRepository } from './HardCordedCurriculumBrandRepository'

describe('HardCordedCurriculumBrandRepository', () => {
  let hardCordedCurriculumBrandRepository: HardCordedCurriculumBrandRepository

  beforeAll(async () => {
    hardCordedCurriculumBrandRepository = new HardCordedCurriculumBrandRepository()
  })

  describe('findAll', () => {
    test('success', async () => {
      const res = await hardCordedCurriculumBrandRepository.findAll()

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual([
        {
          id: 'codeillusion',
          name: 'Codeillusion',
        },
        {
          id: 'cse',
          name: 'Computer Science Essentials',
        },
      ])
    })
  })

  describe('findById', () => {
    test('success', async () => {
      const res = await hardCordedCurriculumBrandRepository.findById('codeillusion')

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        id: 'codeillusion',
        name: 'Codeillusion',
      })
    })

    test('with invalid id', async () => {
      const res = await hardCordedCurriculumBrandRepository.findById('invalidId')

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })
  })
})
