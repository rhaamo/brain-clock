
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('tasks', function (table) {
    table.increments('id')
    table.timestamp('started')
    table.timestamp('ended')
    table.integer('duration') // seconds
    table.text('title') // what the task was
  })
};

exports.down = function(knex) {
    return knex.dropTable('tasks')
};
