import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'images'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('docker_image_name', 255).notNullable();
      table.string('template_branch', 255).notNullable();
      table.string('start_command', 255).notNullable();
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('slug')
    })
  }
}
