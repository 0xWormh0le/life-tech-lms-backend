import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
  PrimaryColumn,
} from 'typeorm'

export enum CourseTypeormEnum {
  basic = 'basic',
  webDesign = 'webDesign',
  mediaArt = 'mediaArt',
  gameDevelopment = 'gameDevelopment',
}

export enum LessonEnvironmentTypeormEnum {
  litLessonPlayer = 'litLessonPlayer',
}

export enum LessonLevelTypeormEnum {
  basic = 'basic',
  advanced = 'advanced',
}

@Entity({ name: 'lessons' })
@Unique('project_name_scenario_path', ['project_name', 'scenario_path'])
export class LessonTypeormEntity {
  constructor(
    id: string,
    url: string,
    project_name: string,
    scenario_path: string,
    name: string,
    course: CourseTypeormEnum,
    lesson_environment: LessonEnvironmentTypeormEnum,
    description: string,
    lesson_duration: string,
    thumbnail_image_url: string,
    max_star_count: number,
    quiz_count: number | undefined,
    hint_count: number | undefined,
    level: LessonLevelTypeormEnum,
    created_at: Date,
    updated_at: Date,
  ) {
    this.id = id
    this.url = url
    this.project_name = project_name
    this.scenario_path = scenario_path
    this.name = name
    this.course = course
    this.lesson_environment = lesson_environment
    this.description = description
    this.lesson_duration = lesson_duration
    this.thumbnail_image_url = thumbnail_image_url
    this.max_star_count = max_star_count
    this.quiz_count = quiz_count
    this.hint_count = hint_count
    this.level = level
    this.created_at = created_at
    this.updated_at = updated_at
  }
  @PrimaryColumn()
  id: string

  @Column({ type: 'varchar', width: 1024 })
  url: string

  @Column({ type: 'varchar', width: 128 })
  project_name: string

  @Column({ type: 'varchar', width: 128 })
  scenario_path: string

  @Column({ type: 'varchar', width: 128 })
  name: string

  @Column({
    type: 'enum',
    enum: CourseTypeormEnum,
    default: CourseTypeormEnum.basic,
  })
  course: CourseTypeormEnum

  @Column({
    type: 'enum',
    enum: LessonEnvironmentTypeormEnum,
    default: LessonEnvironmentTypeormEnum.litLessonPlayer,
  })
  lesson_environment: LessonEnvironmentTypeormEnum

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'varchar', width: 128 })
  lesson_duration: string

  @Column({ type: 'varchar', width: 128 })
  thumbnail_image_url: string

  @Column()
  max_star_count: number

  @Column({ nullable: true })
  quiz_count?: number

  @Column({ nullable: true })
  hint_count?: number

  @Column({
    type: 'enum',
    enum: LessonLevelTypeormEnum,
    default: LessonLevelTypeormEnum.basic,
  })
  level: LessonLevelTypeormEnum

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date
}
