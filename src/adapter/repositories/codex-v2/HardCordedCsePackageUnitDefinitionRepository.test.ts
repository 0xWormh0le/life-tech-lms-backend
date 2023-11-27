import { HardCordedCsePackageUnitDefinitionRepository } from './HardCordedCsePackageUnitDefinitionRepository'

describe('HardCordedCsePackageUnitDefinitionRepository', () => {
  let hardCordedCsePackageUnitDefinitionRepository: HardCordedCsePackageUnitDefinitionRepository

  beforeAll(async () => {
    hardCordedCsePackageUnitDefinitionRepository = new HardCordedCsePackageUnitDefinitionRepository('http://localhost:3000')
  })

  test('findById', async () => {
    const res = await hardCordedCsePackageUnitDefinitionRepository.findById('unit-cse-5')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      description:
        'In this unit, you will explore and understand the principles and key components of network infrastructure, including LAN and WAN, clients and servers, IP addresses, and computer systems.',
      id: 'unit-cse-5',
      name: 'Network Infrastructure',
    })
  })

  test('findAll', async () => {
    const res = await hardCordedCsePackageUnitDefinitionRepository.findAll()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        description:
          'In this unit, you will explore and understand the components of an information society where using, creating, distributing, manipulating, and integrating information are significant activities.',
        id: 'unit-cse-1',
        name: 'Information Society',
      },
      {
        description:
          'In this unit, you will explore and understand digital information components and features, including analog and digital representation, various units of information, and the expression of numbers.',
        id: 'unit-cse-2',
        name: 'Digital Expression of Information 1',
      },
      {
        description:
          'In this unit, you will continue your exploration and understanding of digital information expression to include arithmetic mechanisms such as logic circuits, characters and character codes, sound and images, and more.',
        id: 'unit-cse-3',
        name: 'Digital Expression of Information 2',
      },
      {
        description:
          'In this unit, you will explore and understand how computers work. Concepts covered include computer behavior, hardware, software, operating systems, memory, processing power, and data compression.',
        id: 'unit-cse-4',
        name: 'How Computers Work',
      },
      {
        description:
          'In this unit, you will explore and understand the principles and key components of network infrastructure, including LAN and WAN, clients and servers, IP addresses, and computer systems.',
        id: 'unit-cse-5',
        name: 'Network Infrastructure',
      },
      {
        description:
          'In this unit, you will explore and understand the key components of internet protocol, including communication protocols, mechanisms, database systems, internet service providers, and more.',
        id: 'unit-cse-6',
        name: 'Internet Protocol',
      },
      {
        description:
          'In this unit, you will explore and understand the principles of network security, including the critical elements of information security, encryption, malware and viruses, filtering, blockchain, and more.',
        id: 'unit-cse-7',
        name: 'Network Security',
      },
    ])
  })

  test('findByIds', async () => {
    const res = await hardCordedCsePackageUnitDefinitionRepository.findByIds(['unit-cse-1', 'unit-cse-7', 'invalid'])

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        description:
          'In this unit, you will explore and understand the components of an information society where using, creating, distributing, manipulating, and integrating information are significant activities.',
        id: 'unit-cse-1',
        name: 'Information Society',
      },
      {
        description:
          'In this unit, you will explore and understand the principles of network security, including the critical elements of information security, encryption, malware and viruses, filtering, blockchain, and more.',
        id: 'unit-cse-7',
        name: 'Network Security',
      },
    ])
  })
})
