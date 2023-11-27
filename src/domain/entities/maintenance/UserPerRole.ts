import { MaintenanceAdministrator } from './Administrator'
import { MaintenanceStudent } from './Student'
import { MaintenanceTeacher } from './Teacher'

export type UserPerRole =
  | ({ role: 'student' } & MaintenanceStudent)
  | ({ role: 'teacher' } & MaintenanceTeacher)
  | ({ role: 'administrator' } & MaintenanceAdministrator)
  | { role: 'internalOperator' }
