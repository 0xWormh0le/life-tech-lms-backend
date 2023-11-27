export type MaintenanceUser = {
  role: 'student' | 'teacher' | 'administrator' | 'internalOperator'
}

export type MaintenanceUserWithId = { id: string } & MaintenanceUser
