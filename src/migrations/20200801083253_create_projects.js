
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists('projects', function (table) {
      table.increments('id')
      table.string('name')
      table.string('si_id')
    })
  };
  
  exports.down = function(knex) {
      return knex.dropTable('projects')
  };
  