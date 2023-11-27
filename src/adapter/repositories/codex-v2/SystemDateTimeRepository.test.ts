import SystemDateTimeRepository from './SystemDateTimeRepository'

describe('SystemDateTimeRepository', () => {
  describe('.now()', () => {
    const systemDateTimeRepository = new SystemDateTimeRepository()

    test('success', async () => {
      const nowRes = await systemDateTimeRepository.now()

      expect(nowRes.hasError).toEqual(false)
      expect(nowRes.error).toBeNull()
      expect(nowRes.value).toBeDefined()
    })
  })
})
