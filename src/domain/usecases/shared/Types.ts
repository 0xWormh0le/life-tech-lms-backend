export type UnwrapNull<T> = T extends null ? never : T

export type UnwrapUndefined<T extends string | undefined> = T extends undefined
  ? never
  : T

export type MakeOptional<Type, Key extends keyof Type> = Omit<Type, Key> &
  Partial<Pick<Type, Key>>

export type MakeNullable<Type, Key extends keyof Type> = Omit<Type, Key> & {
  [P in Key]: Type[P] | null
}

export type MakeNonNullable<Type, Key extends keyof Type> = Omit<Type, Key> & {
  [P in Key]: NonNullable<Type[P]>
}

export type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T
