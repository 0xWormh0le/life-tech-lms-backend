import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { StudentGroupRepository } from './repositories/StudentGroupRepository'
import { AdministratorRepository } from './repositories/AdministratorRepository'
import { TeacherRepository } from './repositories/TeacherRepository'
import { StudentRepository } from './repositories/StudentRepository'
import { StudentStudentGroupAffiliationRepository } from './repositories/StudentStudentGroupAffiliationRepository'
import { TeacherOrganizationAffiliationRepository } from './repositories/TeacherOrganizationAffiliatioRepository'
import { User } from '../../../entities/codex-v2/User'
import { shouldBeNever } from '../../../../_shared/utils'
import { OrganizationRepository } from './repositories/OrganizationRepository'

export const findDistrictIdByAdministratorsUserId = async (
  administratorsUserId: string,
  administratorRepository: Pick<AdministratorRepository, 'findByUserId'>,
): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
  const resAdmin = await administratorRepository.findByUserId(
    administratorsUserId,
  )

  if (resAdmin.hasError) {
    return resAdmin
  } else if (!resAdmin.value) {
    return failureErrorable(
      'UnknownRuntimeError',
      `administrator is not found. userId: ${administratorsUserId}`,
    )
  }

  return successErrorable(resAdmin.value.districtId)
}

export const findDistrictIdsByTeachersUserId = async (
  teacherUserId: string,
  teacherRepository: Pick<TeacherRepository, 'findByUserId'>,
  teacherOrganizationAffiliationRepository: Pick<
    TeacherOrganizationAffiliationRepository,
    'findByTeacherId'
  >,
  organizationRepository: Pick<
    OrganizationRepository,
    'findById' | 'findByIds'
  >,
): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> => {
  const resTeacher = await teacherRepository.findByUserId(teacherUserId)

  if (resTeacher.hasError) {
    return resTeacher
  } else if (!resTeacher.value) {
    return failureErrorable(
      'UnknownRuntimeError',
      `teacher is not found. userId: ${teacherUserId}`,
    )
  }

  const resTeacherOrganizationAffiliation =
    await teacherOrganizationAffiliationRepository.findByTeacherId(
      resTeacher.value.id,
    )

  if (resTeacherOrganizationAffiliation.hasError) {
    return resTeacherOrganizationAffiliation
  }

  return await findDistrictIdsByOrganizationIds(
    resTeacherOrganizationAffiliation.value.map((e) => e.organizationId),
    organizationRepository,
  )
}

export const findDistrictIdsByOrganizationIds = async (
  organizationIds: string[],
  organizationRepository: Pick<
    OrganizationRepository,
    'findById' | 'findByIds'
  >,
): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> => {
  const resOrganizations = await organizationRepository.findByIds(
    organizationIds,
  )

  if (resOrganizations.hasError) {
    return resOrganizations
  }

  return successErrorable(resOrganizations.value.map((e) => e.districtId))
}

export const findDistrictIdsByStudentsUserId = async (
  studentsUserId: string,
  studentRepository: Pick<StudentRepository, 'findByUserId'>,
  studentGroupRepository: Pick<
    StudentGroupRepository,
    'findById' | 'findByIds'
  >,
  studentStudentGroupAffiliationRepository: Pick<
    StudentStudentGroupAffiliationRepository,
    'findByStudentId'
  >,
  organizationRepository: Pick<
    OrganizationRepository,
    'findById' | 'findByIds'
  >,
): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> => {
  const resStudent = await studentRepository.findByUserId(studentsUserId)

  if (resStudent.hasError) {
    return resStudent
  } else if (!resStudent.value) {
    return failureErrorable(
      'UnknownRuntimeError',
      `student is not found. userId: ${studentsUserId}`,
    )
  }

  const resStudentGroupAffiliation =
    await studentStudentGroupAffiliationRepository.findByStudentId(
      resStudent.value.id,
    )

  if (resStudentGroupAffiliation.hasError) {
    return resStudentGroupAffiliation
  }

  const resStudentGroups = await studentGroupRepository.findByIds(
    resStudentGroupAffiliation.value.map((e) => e.studentGroupId),
  )

  if (resStudentGroups.hasError) {
    return resStudentGroups
  }

  return findDistrictIdsByOrganizationIds(
    resStudentGroups.value.map((e) => e.organizationId),
    organizationRepository,
  )
}

export const findDistrictIdByStudentGroupId = async (
  studentGroupId: string,
  organizationRepository: Pick<
    OrganizationRepository,
    'findById' | 'findByIds'
  >,
  studentGroupRepository: Pick<
    StudentGroupRepository,
    'findById' | 'findByIds'
  >,
): Promise<Errorable<string, E<'UnknownRuntimeError'>>> => {
  const resStudentGroup = await studentGroupRepository.findById(studentGroupId)

  if (resStudentGroup.hasError) {
    return resStudentGroup
  } else if (!resStudentGroup.value) {
    return failureErrorable(
      'UnknownRuntimeError',
      `studentGroup is not found. studentGroupId: ${studentGroupId}`,
    )
  }

  const resOrganization = await organizationRepository.findById(
    resStudentGroup.value.organizationId,
  )

  if (resOrganization.hasError) {
    return resOrganization
  } else if (!resOrganization.value) {
    return failureErrorable(
      'UnknownRuntimeError',
      `organization is not found. organizationId: ${resStudentGroup.value.organizationId}, studentGroupId: ${studentGroupId}`,
    )
  }

  return successErrorable(resOrganization.value.districtId)
}

export const findDistrictIdsByAuthenticatedUser = async (
  authenticatedUser: User,
  administratorRepository: Pick<AdministratorRepository, 'findByUserId'>,
  organizationRepository: Pick<
    OrganizationRepository,
    'findById' | 'findByIds'
  >,
  teacherRepository: Pick<TeacherRepository, 'findByUserId'>,
  teacherOrganizationAffiliationRepository: Pick<
    TeacherOrganizationAffiliationRepository,
    'findByTeacherId'
  >,
  studentGroupRepository: Pick<
    StudentGroupRepository,
    'findById' | 'findByIds'
  >,
  studentRepository: Pick<StudentRepository, 'findByUserId'>,
  studentStudentGroupAffiliationRepository: Pick<
    StudentStudentGroupAffiliationRepository,
    'findByStudentId'
  >,
): Promise<Errorable<string[], E<'UnknownRuntimeError'>>> => {
  switch (authenticatedUser.role) {
    case 'internalOperator':
      return successErrorable([])
    case 'administrator': {
      const res = await findDistrictIdByAdministratorsUserId(
        authenticatedUser.id,
        administratorRepository,
      )

      if (res.hasError) {
        return res
      }

      return successErrorable([res.value])
    }

    case 'teacher':
      return await findDistrictIdsByTeachersUserId(
        authenticatedUser.id,
        teacherRepository,
        teacherOrganizationAffiliationRepository,
        organizationRepository,
      )
    case 'student':
      return await findDistrictIdsByStudentsUserId(
        authenticatedUser.id,
        studentRepository,
        studentGroupRepository,
        studentStudentGroupAffiliationRepository,
        organizationRepository,
      )

    default:
      return shouldBeNever(authenticatedUser.role)
  }
}
