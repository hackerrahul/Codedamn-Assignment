import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'playgrounds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('image_id_fk')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('images')
        .onDelete('CASCADE')

      table.string('name').notNullable();
      table.string('container_id').nullable();

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
