import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Image from './image.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Playground extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare image_id_fk: number

  @column()
  declare name: string

  @column()
  declare volume_name: string

  @column()
  declare container_id: string

  @column()
  declare volume_path: string

  @column()
  declare port: number


  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Image, {
    localKey: 'id',
    foreignKey: 'image_id_fk', // Specify the foreign key here
  })
  declare image: BelongsTo<typeof Image>
}
