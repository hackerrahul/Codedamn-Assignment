import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'playgrounds'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('volume_name', 255).notNullable().after('name')
      table.string('volume_path', 255).notNullable().after('container_id')
      table.string('port', 255).notNullable().after('volume_path')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('volume_name')
      table.dropColumn('volume_path')
      table.dropColumn('port')
    })
  }
}
