import { replacePathParams } from './clever-api-request'

describe('test replacePathParams', () => {
  test('with 1 path parameter', () => {
    const result = replacePathParams('/resource/{resourceId}/sub-resource', {
      resourceId: 'ID-FOR-THIS-RESOURCE',
    })

    expect(result).toEqual('/resource/ID-FOR-THIS-RESOURCE/sub-resource')
  })

  test('with multiple path parameters', () => {
    const result = replacePathParams('/resource/{resourceId}/sub-resource/{subResourceId}/sub-sub-resource', {
      resourceId: 'ID-FOR-THIS-RESOURCE-1',
      subResourceId: 'ID-FOR-THIS-RESOURCE-2',
    })

    expect(result).toEqual('/resource/ID-FOR-THIS-RESOURCE-1/sub-resource/ID-FOR-THIS-RESOURCE-2/sub-sub-resource')
  })

  test('with no path parameter', () => {
    const result = replacePathParams('/resource/sub-resource', {})

    expect(result).toEqual('/resource/sub-resource')
  })
})
