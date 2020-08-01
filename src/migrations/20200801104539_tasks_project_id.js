
exports.up = function(knex) {
  return knex.schema.table('tasks', table => {
      table.integer('project_id').unsigned()
      table.foreign('project_id').references('items.id')
  })
};

exports.down = function(knex) {
  return knex.schema.table('tasks', table => {
      table.dropColumn('project_id')
  })
};
