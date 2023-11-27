import { MaintenanceDistrict } from '../../../../src/domain/entities/maintenance/District'
import { MaintenanceOrganization } from '../../../../src/domain/entities/maintenance/Organization'
import { MaintenanceStudentGroup } from '../../../../src/domain/entities/maintenance/StudentGroup'
import { MakeOptional } from '../../../../src/domain/usecases/shared/Types'
import { request, SuceessResponseData } from '../../api/codex-api-request'
import {
  appDataSource,
  setupEnvironment,
  teardownEnvironment,
} from '../../utilities'

beforeAll(setupEnvironment)

afterAll(teardownEnvironment)

test('Maintenace Districts/Organizations/StudentGroups API should work correctly', async () => {
  if (!appDataSource) {
    throw new Error('appDataSource is not ready')
  }

  // Get Districts (which should be empty)
  const getDistrictsResponse1 = await request({
    url: '/maintenance/districts',
    method: 'get',
  })

  expect(getDistrictsResponse1.hasError).toEqual(false)
  expect(getDistrictsResponse1.value).toEqual<
    typeof getDistrictsResponse1.value
  >({ districts: [] })

  // Get Organizations (which should be empty)
  const getOrganizationsResponse1 = await request({
    url: '/maintenance/organizations',
    method: 'get',
  })

  expect(getOrganizationsResponse1.hasError).toEqual(false)
  expect(getOrganizationsResponse1.value).toEqual<
    typeof getOrganizationsResponse1.value
  >({ organizations: [] })

  // Get StudentGroups (which should be empty)
  const getStudentGroupsResponse1 = await request({
    url: '/maintenance/studentGroups',
    method: 'get',
  })

  expect(getStudentGroupsResponse1.hasError).toEqual(false)
  expect(getStudentGroupsResponse1.value).toEqual<
    typeof getStudentGroupsResponse1.value
  >({ studentGroups: [] })

  // Create Districts
  const createDistrictsResponse1 = await request({
    url: '/maintenance/districts',
    method: 'put',
    data: {
      districts: [
        {
          name: 'District-1',
          stateId: 'AL',
          lmsId: 'clever',
          enableRosterSync: true,
          districtLmsId: 'district-lms-id-1',
        },
        {
          name: 'District-2',
          stateId: 'WV',
        },
      ],
    },
  })

  if (!createDistrictsResponse1.value) {
    throw new Error(
      `PUT /maintenance/districts failed ${JSON.stringify(
        createDistrictsResponse1.error,
      )}`,
    )
  }

  // Check Districts created correctly
  const getDistrictsResponse2 = await request({
    url: '/maintenance/districts',
    method: 'get',
  })

  if (!getDistrictsResponse2.value) {
    throw new Error(
      `GET /maintenance/districts failed ${JSON.stringify(
        getDistrictsResponse2.error,
      )}`,
    )
  }
  type ResponseDistrict = SuceessResponseData<
    '/maintenance/districts',
    'get'
  >['districts'][0]
  expect(
    getDistrictsResponse2.value.districts.map((e) => ({
      name: e.name,
      stateId: e.stateId,
      lmsId: e.lmsId,
      enableRosterSync: e.enableRosterSync,
      districtLmsId: e.districtLmsId,
    })),
  ).toEqual<Omit<ResponseDistrict, 'id'>[]>([
    {
      name: 'District-1',
      stateId: 'AL',
      lmsId: 'clever',
      enableRosterSync: true,
      districtLmsId: 'district-lms-id-1',
    },
    {
      name: 'District-2',
      stateId: 'WV',
      lmsId: undefined,
      enableRosterSync: false,
      districtLmsId: undefined,
    },
  ])

  // Create Organizations
  const createOrganizationsResponse1 = await request({
    url: '/maintenance/organizations',
    method: 'put',
    data: {
      organizations: [
        {
          districtId: getDistrictsResponse2.value.districts[0].id,
          name: 'Organization-1',
          stateId: 'AL',
          organizationLmsId: 'organization-lms-id',
        },
        {
          districtId: getDistrictsResponse2.value.districts[0].id,
          name: 'Organization-2',
          stateId: 'GA',
        },
        {
          districtId: getDistrictsResponse2.value.districts[1].id,
          name: 'Organization-3',
          stateId: 'WV',
        },
      ],
    },
  })

  if (!createOrganizationsResponse1.value) {
    throw new Error(
      `PUT /maintenance/organizations failed ${JSON.stringify(
        createOrganizationsResponse1.error,
      )}`,
    )
  }

  // Check Organizations created correctly
  const getOrganizationsResponse2 = await request({
    url: '/maintenance/organizations',
    method: 'get',
  })

  if (!getOrganizationsResponse2.value) {
    throw new Error(
      `GET /maintenance/organizations failed ${JSON.stringify(
        getOrganizationsResponse2.error,
      )}`,
    )
  }
  type ResponseOrganization = SuceessResponseData<
    '/maintenance/organizations',
    'get'
  >['organizations'][0]
  expect(
    getOrganizationsResponse2.value.organizations.map<
      Omit<ResponseOrganization, 'id'>
    >((o) => ({
      districtId: o.districtId,
      name: o.name,
      stateId: o.stateId,
      organizationLmsId: o.organizationLmsId,
    })),
  ).toEqual<Omit<ResponseOrganization, 'id'>[]>([
    {
      districtId: getDistrictsResponse2.value.districts[0].id,
      name: 'Organization-1',
      stateId: 'AL',
      organizationLmsId: 'organization-lms-id',
    },
    {
      districtId: getDistrictsResponse2.value.districts[0].id,
      name: 'Organization-2',
      stateId: 'GA',
      organizationLmsId: undefined,
    },
    {
      districtId: getDistrictsResponse2.value.districts[1].id,
      name: 'Organization-3',
      stateId: 'WV',
      organizationLmsId: undefined,
    },
  ])

  // Create StudentGroups
  const createStudentGroupsResponse1 = await request({
    url: '/maintenance/studentGroups',
    method: 'put',
    data: {
      studentGroups: [
        {
          organizationId: getOrganizationsResponse2.value.organizations[0].id,
          grade: '1',
          name: 'StudentGroup-1',
          codeillusionPackageId: 'codeillusion-package-basic-full-standard',
          studentGroupLmsId: 'student-group-lms-id-1',
        },
        {
          organizationId: getOrganizationsResponse2.value.organizations[0].id,
          grade: '2',
          name: 'StudentGroup-2',
          codeillusionPackageId:
            'codeillusion-package-basic-full-premium-adventurous',
          studentGroupLmsId: undefined,
        },
        {
          organizationId: getOrganizationsResponse2.value.organizations[1].id,
          grade: '3',
          name: 'StudentGroup-3',
          codeillusionPackageId:
            'codeillusion-package-basic-half-premium-heroic',
          studentGroupLmsId: undefined,
        },
      ],
    },
  })

  if (!createStudentGroupsResponse1.value) {
    throw new Error(
      `PUT /maintenance/studentGroups failed ${JSON.stringify(
        createStudentGroupsResponse1.error,
      )}`,
    )
  }

  // Check StudentGroups created correctly
  const getStudentGroupsResponse2 = await request({
    url: '/maintenance/studentGroups',
    method: 'get',
  })

  if (!getStudentGroupsResponse2.value) {
    throw new Error(
      `GET /maintenance/studentGroups failed ${JSON.stringify(
        getStudentGroupsResponse2.error,
      )}`,
    )
  }
  type ResponseStudentGroup = SuceessResponseData<
    '/maintenance/studentGroups',
    'get'
  >['studentGroups'][0]
  expect(
    getStudentGroupsResponse2.value.studentGroups.map<
      Omit<ResponseStudentGroup, 'id'>
    >((o) => {
      // compare without ids
      const withoutId = { ...o }

      delete (withoutId as MakeOptional<ResponseStudentGroup, 'id'>).id

      return withoutId
    }),
  ).toEqual<Omit<ResponseStudentGroup, 'id'>[]>([
    {
      organizationId: getOrganizationsResponse2.value.organizations[0].id,
      grade: '1',
      name: 'StudentGroup-1',
      codeillusionPackageId: 'codeillusion-package-basic-full-standard',
      csePackageId: '',
      studentGroupLmsId: 'student-group-lms-id-1',
    },
    {
      organizationId: getOrganizationsResponse2.value.organizations[0].id,
      grade: '2',
      name: 'StudentGroup-2',
      codeillusionPackageId:
        'codeillusion-package-basic-full-premium-adventurous',
      csePackageId: '',
    },
    {
      organizationId: getOrganizationsResponse2.value.organizations[1].id,
      grade: '3',
      name: 'StudentGroup-3',
      codeillusionPackageId: 'codeillusion-package-basic-half-premium-heroic',
      csePackageId: '',
    },
  ])

  // Update StudentGroups
  const createStudentGroupsResponse2 = await request({
    url: '/maintenance/studentGroups',
    method: 'put',
    data: {
      studentGroups: [
        {
          id: getStudentGroupsResponse2.value.studentGroups[2].id,
          organizationId: getOrganizationsResponse2.value.organizations[1].id,
          grade: '3',
          name: 'StudentGroup-3',
          codeillusionPackageId: 'codeillusion-package-basic-1-standard',
          studentGroupLmsId: 'student-group-lms-id-3',
        },
      ],
    },
  })

  if (!createStudentGroupsResponse2.value) {
    throw new Error(
      `PUT /maintenance/studentGroups failed ${JSON.stringify(
        createStudentGroupsResponse2.error,
      )}`,
    )
  }

  // Check StudentGroups created correctly
  const getStudentGroupsResponse3 = await request({
    url: '/maintenance/studentGroups',
    method: 'get',
  })

  if (!getStudentGroupsResponse3.value) {
    throw new Error(
      `GET /maintenance/studentGroups failed ${JSON.stringify(
        getStudentGroupsResponse3.error,
      )}`,
    )
  }
  expect(getStudentGroupsResponse3.value.studentGroups).toEqual<
    ResponseStudentGroup[]
  >([
    {
      id: getStudentGroupsResponse2.value.studentGroups[0].id,
      organizationId: getOrganizationsResponse2.value.organizations[0].id,
      grade: '1',
      name: 'StudentGroup-1',
      codeillusionPackageId: 'codeillusion-package-basic-full-standard',
      studentGroupLmsId: 'student-group-lms-id-1',
      csePackageId: '',
    },
    {
      id: getStudentGroupsResponse2.value.studentGroups[1].id,
      organizationId: getOrganizationsResponse2.value.organizations[0].id,
      grade: '2',
      name: 'StudentGroup-2',
      codeillusionPackageId:
        'codeillusion-package-basic-full-premium-adventurous',
      csePackageId: '',
    },
    {
      id: getStudentGroupsResponse2.value.studentGroups[2].id,
      organizationId: getOrganizationsResponse2.value.organizations[1].id,
      grade: '3',
      name: 'StudentGroup-3',
      codeillusionPackageId: 'codeillusion-package-basic-1-standard',
      studentGroupLmsId: 'student-group-lms-id-3',
      csePackageId: '',
    },
  ])
})
