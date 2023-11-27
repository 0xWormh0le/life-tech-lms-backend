import { DataSource } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { DistrictAdministrator } from '../../domain/entities/codex/DistrictAdministrator'
import { StudentGroup } from '../../domain/entities/codex/StudentGroup'
import { User } from '../../domain/entities/codex/User'
import { StudentGroupInfo as CreateStudentGroupInfo } from '../../domain/usecases/codex/StudentGroup/CreateStudentGroupUseCase'
import { StudentGroupInfo as UpdateStudentGroupInfo } from '../../domain/usecases/codex/StudentGroup/UpdateStudentGroupUseCase'
import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { OrganizationTypeormEntity } from '../typeorm/entity/Organization'
import { StudentGroupTypeormEntity } from '../typeorm/entity/StudentGroup'
import { AdministratorRepository } from './AdministratorRepository'
import { userRoles } from '../../domain/usecases/shared/Constants'
import { packagesMapById } from '../../adapter/typeorm/hardcoded-data/Pacakges/Packages'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'

const ALLOWED_ROLES: string[] = [
  userRoles.internalOperator,
  userRoles.administrator,
  userRoles.teacher,
]

export class StudentGroupRepository {
  constructor(
    private typeormDataSource: DataSource,
    private administratorRepository: AdministratorRepository,
  ) {}

  async getById(
    id: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError', string>>> {
    try {
      const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
        StudentGroupTypeormEntity,
      )
      const studentGroupsResult = await studentGroupTypeormEntity.find({
        where: {
          id,
        },
        relations: ['organization_id'],
      })

      if (studentGroupsResult.length === 0) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      const studentGroup = studentGroupsResult[0]

      return {
        hasError: false,
        error: null,
        value: {
          id: studentGroup.id,
          organizationId: studentGroup.organization_id.id,
          name: studentGroup.name,
          grade: studentGroup.grade,
          studentGroupLmsId: studentGroup.student_group_lms_id,
          createdUserId: studentGroup.created_user_id,
          updatedUserId: studentGroup.updated_user_id,
          createdDate: studentGroup.created_date.toISOString(),
          updatedDate: studentGroup.updated_date.toISOString(),
        },
      }
    } catch (e) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student group from db by studentGroupId : ${id}`,
        ),
        value: null,
      }
    }
  }

  async getStudentGroups(
    organizationId: string,
  ): Promise<
    Errorable<
      StudentGroup[],
      E<'UnknownRuntimeError'> | E<'OrganizationNotFoundError'>
    >
  > {
    const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    const organizationTypeormEntity = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )

    try {
      const organization = await organizationTypeormEntity.findOneBy({
        id: organizationId,
      })

      if (organization == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationNotFoundError',
            message: `Organization information not found`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get organization from db by organizationId : ${organizationId}`,
        ),
        value: null,
      }
    }

    try {
      const organizationsResult = await studentGroupTypeormEntity
        .createQueryBuilder('student_groups')
        .where('student_groups.organization_id = :id', {
          id: organizationId,
        })
        .getRawMany()

      const studentGroupData: StudentGroup[] = []

      organizationsResult.map(
        (raw: {
          student_groups_id: string
          student_groups_name: string
          student_groups_organization_id: string
          student_groups_package_id: string
          student_groups_grade: string
          student_groups_student_group_lms_id: string
          student_groups_created_user_id: string
          student_groups_created_date: Date
          student_groups_updated_user_id: string
          student_groups_updated_date: Date
        }) => {
          const dto: StudentGroup = {
            id: raw.student_groups_id,
            name: raw.student_groups_name,
            organizationId: raw.student_groups_organization_id,
            grade: raw.student_groups_grade,
            studentGroupLmsId: raw.student_groups_student_group_lms_id,
            createdUserId: raw.student_groups_created_user_id,
            createdDate: raw.student_groups_created_date.toISOString(),
            updatedUserId: raw.student_groups_updated_user_id,
            updatedDate: raw.student_groups_updated_date.toISOString(),
          }

          studentGroupData.push(dto)
        },
      )

      return {
        hasError: false,
        error: null,
        value: studentGroupData,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student groups from db by organizationId : ${organizationId}`,
        ),
        value: null,
      }
    }
  }

  async createStudentGroup(
    user: User,
    studentGroup: CreateStudentGroupInfo,
    organizationId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationInfoNotFound'>
      | E<'PermissionDenied'>
      | E<'AdministratorNotFound'>
    >
  > {
    const organizationTypeormEntity = this.typeormDataSource.getRepository(
      OrganizationTypeormEntity,
    )
    const organizationData = await organizationTypeormEntity.findOneBy({
      id: organizationId,
    })

    try {
      if (organizationData == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationInfoNotFound',
            message: `Organization information not found`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get organization from db by organizationId : ${organizationId}`,
        ),
        value: null,
      }
    }

    if (user.role === userRoles.administrator) {
      try {
        const getAdminisratorResult =
          await this.administratorRepository.getDistrictAdministratorByUserId(
            user.id,
          )

        if (getAdminisratorResult.value == null) {
          return {
            hasError: true,
            error: {
              type: 'AdministratorNotFound',
              message: `no administrator found for user ${user.id}`,
            },
            value: null,
          }
        }

        if (
          getAdminisratorResult.value?.districtId !==
          organizationData.district_id
        ) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message: 'Access Denied',
            },
            value: null,
          }
        }
      } catch (e: unknown) {
        return {
          hasError: true,
          error: fromNativeError(
            'UnknownRuntimeError',
            e as Error,
            `failed to get district administrator by userId ${user.id}`,
          ),
          value: null,
        }
      }
    }

    const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    // try {
    //   let studentGroupData: any[]
    //   if (studentGroup.grade) {
    //     studentGroupData = await studentGroupTypeormEntity
    //       .createQueryBuilder('student_groups')
    //       .where('student_groups.organization_id = :id', { id: organizationId })
    //       .where('student_groups.name = :name', { name: studentGroup.name })
    //       .andWhere('student_groups.grade = :grade', {
    //         grade: studentGroup.grade,
    //       })
    //       .getRawMany()
    //   } else {
    //     studentGroupData = await studentGroupTypeormEntity
    //       .createQueryBuilder('student_groups')
    //       .where('student_groups.organization_id = :id', { id: organizationId })
    //       .where('student_groups.name = :name', { name: studentGroup.name })
    //       .getRawMany()
    //   }

    //   if (studentGroupData.length !== 0) {
    //     return {
    //       hasError: true,
    //       error: {
    //         type: 'AlreadyExistError',
    //         message: `given student group name already exists ${JSON.stringify(
    //           studentGroup,
    //         )}`,
    //       },
    //       value: null,
    //     }
    //   }
    // } catch (e: unknown) {
    //   return {
    //     hasError: true,
    //     error: fromNativeError(
    //       'UnknownRuntimeError',
    //       e as Error,
    //       `failed to get student group from db  ${studentGroup.name}`,
    //     ),
    //     value: null,
    //   }
    // }

    try {
      const data: QueryDeepPartialEntity<{}> = {
        name: studentGroup.name,
        organization_id: organizationId,
        grade: studentGroup.grade,
        student_group_lms_id: studentGroup.studentGroupLmsId ?? null,
        created_user_id: user.id,
      }

      const studentGroupPackageAssignmentTypeormEntity =
        this.typeormDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      const createdStudentGroup = await studentGroupTypeormEntity.save(data)

      if (studentGroup.packageId) {
        const packageCategoryId =
          (packagesMapById[studentGroup.packageId] &&
            packagesMapById[studentGroup.packageId].packageCategoryId) ??
          ''

        if (packageCategoryId) {
          await studentGroupPackageAssignmentTypeormEntity.save({
            package_id: studentGroup.packageId,
            student_group_id: createdStudentGroup.id,
            package_category_id: packageCategoryId,
          })
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to create student group into db by ${JSON.stringify(
            studentGroup,
          )}`,
        ),
        value: null,
      }
    }
  }

  async getDistrictIdByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<string, E<'UnknownRuntimeError'> | E<'StudentGroupNotFound'>>
  > {
    const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    try {
      const result = await studentGroupTypeormEntity
        .createQueryBuilder('student_groups')
        .innerJoin(
          OrganizationTypeormEntity,
          'organizations',
          'organizations.id::VARCHAR = student_groups.organization_id::VARCHAR',
        )
        .select('organizations.district_id', 'district_id')
        .where('student_groups.id = :id', {
          id: studentGroupId,
        })
        .getRawOne()

      if (result) {
        return {
          hasError: false,
          error: null,
          value: result.district_id,
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupNotFound',
            message: `student group not found of student group id: ${studentGroupId}`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get district id by student group id : ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async updateStudentGroup(
    user: User,
    studentGroup: UpdateStudentGroupInfo,
    studentGroupId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'AlreadyExistError'>
      | E<'OrganizationInfoNotFound'>
      | E<'PermissionDenied'>
      | E<'AdministratorNotFound'>
      | E<'StudentGroupInfoNotFound'>
    >
  > {
    const studentGroupTypeormEntityData = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    try {
      //Get student group information by studentGroupId
      const studentGroupData = await studentGroupTypeormEntityData
        .createQueryBuilder('student_groups')
        .where('student_groups.id = :id', {
          id: studentGroupId,
        })
        .getRawOne()

      if (studentGroupData == null) {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupInfoNotFound',
            message: `student group information not found`,
          },
          value: null,
        }
      }

      // Get Organization information by organizationId
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )

      const organizationData = await organizationTypeormEntity
        .createQueryBuilder('organizations')
        .where('organizations.id = :id', {
          id: studentGroupData?.student_groups_organization_id,
        })
        .getOne()

      if (organizationData == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationInfoNotFound',
            message: `Organization information not found`,
          },
          value: null,
        }
      }

      //Check Administrator can not update student group of other district
      if (user.role === userRoles.administrator) {
        const getAdminisratorResult =
          await this.administratorRepository.getDistrictAdministratorByUserId(
            user.id,
          )

        if (!getAdminisratorResult.value) {
          return {
            hasError: true,
            error: {
              type: 'AdministratorNotFound',
              message: `no administrator found for user ${user.id}`,
            },
            value: null,
          }
        }

        if (
          getAdminisratorResult.value?.districtId !==
          organizationData.district_id
        ) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message: 'Access Denied',
            },
            value: null,
          }
        }
      }

      // Check student group name already exists
      const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
        StudentGroupTypeormEntity,
      )
      // let studentGroupData1: any[]
      // if (studentGroup.grade) {
      //   studentGroupData1 = await studentGroupTypeormEntity
      //     .createQueryBuilder('student_groups')
      //     .where('student_groups.id != :id', { id: studentGroupId })
      //     .andWhere('student_groups.name = :name', { name: studentGroup.name })
      //     .andWhere('student_groups.grade = :grade', {
      //       grade: studentGroup.grade,
      //     })
      //     .getRawMany()
      // } else {
      //   studentGroupData1 = await studentGroupTypeormEntity
      //     .createQueryBuilder('student_groups')
      //     .where('student_groups.id != :id', { id: studentGroupId })
      //     .andWhere('student_groups.name = :name', { name: studentGroup.name })
      //     .getRawMany()
      // }

      // if (studentGroupData1.length !== 0) {
      //   return {
      //     hasError: true,
      //     error: {
      //       type: 'AlreadyExistError',
      //       message: `given student group name already exists ${JSON.stringify(
      //         studentGroup,
      //       )}`,
      //     },
      //     value: null,
      //   }
      // }

      // update student group into DB
      const data: QueryDeepPartialEntity<{}> = {
        id: studentGroupId,
        name: studentGroup.name,
        grade: studentGroup.grade,
        student_group_lms_id: studentGroup.studentGroupLmsId
          ? studentGroup.studentGroupLmsId
          : null,
        organization_id:
          studentGroup?.organizationId ??
          studentGroupData?.student_groups_organization_id,
        updated_user_id: user.id,
      }

      await studentGroupTypeormEntity.save(data)

      const studentGroupPackageAssignmentTypeormEntity =
        this.typeormDataSource.getRepository(
          StudentGroupPackageAssignmentTypeormEntity,
        )

      if (studentGroup.packageId) {
        const packageCategoryId =
          (packagesMapById[studentGroup.packageId] &&
            packagesMapById[studentGroup.packageId].packageCategoryId) ??
          ''

        if (packageCategoryId) {
          const findStudentGroupPackageAssignment =
            await studentGroupPackageAssignmentTypeormEntity.findOneBy({
              package_category_id: packageCategoryId,
              student_group_id: studentGroupId,
            })

          if (findStudentGroupPackageAssignment) {
            await studentGroupPackageAssignmentTypeormEntity.update(
              {
                id: findStudentGroupPackageAssignment.id,
              },
              {
                package_id: studentGroup.packageId,
              },
            )
          } else {
            await studentGroupPackageAssignmentTypeormEntity.save({
              package_id: studentGroup.packageId,
              student_group_id: studentGroupId,
              package_category_id: packageCategoryId,
            })
          }
        }
      }

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to edit student group from db by studentGroupId ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async deleteStudentGroup(
    user: User,
    studentGroupId: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'OrganizationInfoNotFound'>
      | E<'PermissionDenied'>
      | E<'AdministratorNotFound'>
      | E<'StudentGroupInfoNotFound'>
    >
  > {
    const studentGroupTypeormEntityData = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    try {
      //Get student group information by studentGroupId
      const studentGroupData = await studentGroupTypeormEntityData
        .createQueryBuilder('student_groups')
        .where('student_groups.id = :id', {
          id: studentGroupId,
        })
        .getRawOne()

      if (studentGroupData == null) {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupInfoNotFound',
            message: `student group information not found`,
          },
          value: null,
        }
      }

      // Get Organization information by organizationId
      const organizationTypeormEntity = this.typeormDataSource.getRepository(
        OrganizationTypeormEntity,
      )

      const organizationData = await organizationTypeormEntity
        .createQueryBuilder('organizations')
        .where('organizations.id = :id', {
          id: studentGroupData?.student_groups_organization_id,
        })
        .getOne()

      if (organizationData == null) {
        return {
          hasError: true,
          error: {
            type: 'OrganizationInfoNotFound',
            message: `Organization information not found`,
          },
          value: null,
        }
      }

      //Check Administrator can not update student group of other district
      if (user.role === userRoles.administrator) {
        const getAdminisratorResult =
          await this.administratorRepository.getDistrictAdministratorByUserId(
            user.id,
          )

        if (getAdminisratorResult.value == null) {
          return {
            hasError: true,
            error: {
              type: 'AdministratorNotFound',
              message: `no administrator found for user ${user.id}`,
            },
            value: null,
          }
        }

        if (
          getAdminisratorResult.value?.districtId !==
          organizationData.district_id
        ) {
          return {
            hasError: true,
            error: {
              type: 'PermissionDenied',
              message: 'Access Denied',
            },
            value: null,
          }
        }
      }

      // Delete student group from DB
      await studentGroupTypeormEntityData.delete({
        id: studentGroupId,
      })

      return {
        hasError: false,
        error: null,
        value: undefined,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to delete student group from db by studentGroupId ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async getStudentGroupById(
    studentGroupId: string,
  ): Promise<Errorable<StudentGroup | undefined, E<'UnknownRuntimeError'>>> {
    const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    try {
      const studentGroupResult = await studentGroupTypeormEntity
        .createQueryBuilder('student_groups')
        .where('student_groups.id = :id', { id: studentGroupId })
        .select('student_groups.id', 'id')
        .addSelect('student_groups.organization_id', 'organizationId')
        .addSelect('student_groups.name', 'name')
        .addSelect('student_groups.grade', 'grade')
        .addSelect('student_groups.student_group_lms_id', 'studentGroupLmsId')
        .addSelect('student_groups.created_user_id', 'createdUserId')
        .addSelect('student_groups.updated_user_id', 'updatedUserId')
        .addSelect('student_groups.created_date', 'createdDate')
        .addSelect('student_groups.updated_date', 'updatedDate')
        .getRawOne()

      return {
        hasError: false,
        error: null,
        value: studentGroupResult,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student-group by student group id : ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }

  async getStudentGroupByStudentGroupLMSId(
    studentGroupLMSId: string,
  ): Promise<Errorable<StudentGroup | null, E<'UnknownRuntimeError'>>> {
    const studentGroupTypeormEntity = this.typeormDataSource.getRepository(
      StudentGroupTypeormEntity,
    )

    try {
      const studentGroupResult = await studentGroupTypeormEntity
        .createQueryBuilder('student_groups')
        .where('student_groups.student_group_lms_id = :studentGroupLMSId', {
          studentGroupLMSId,
        })
        .getRawOne()

      let res: StudentGroup | null = null

      if (studentGroupResult) {
        res = {
          id: studentGroupResult.student_groups_id,
          name: studentGroupResult.student_groups_name,
          organizationId: studentGroupResult.student_groups_organization_id,
          grade: studentGroupResult.student_groups_grade,
          studentGroupLmsId:
            studentGroupResult.student_groups_student_group_lms_id,
          createdUserId: studentGroupResult.student_groups_created_user_id,
          createdDate: studentGroupResult.student_groups_created_date,
          updatedUserId: studentGroupResult.student_groups_updated_user_id,
          updatedDate: studentGroupResult.student_groups_updated_date,
        }
      }

      return {
        hasError: false,
        error: null,
        value: res,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student-group by student grouplMSId : ${studentGroupLMSId}`,
        ),
        value: null,
      }
    }
  }
}
