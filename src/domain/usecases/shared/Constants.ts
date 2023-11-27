const userRoles: Record<string, string> = {
  teacher: 'teacher',
  student: 'student',
  administrator: 'administrator',
  internalOperator: 'internalOperator',
}

enum UserRoles {
  teacher = 'teacher',
  student = 'student',
  administrator = 'administrator',
  internalOperator = 'internalOperator',
}

enum Option {
  In = 'In',
  NotIn = 'NotIn',
}

export { userRoles, UserRoles, Option }
