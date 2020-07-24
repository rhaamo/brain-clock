
exports.up = function(knex) {
  return knex.schema.table('tasks', table => {
      table.dropColumn('ended')
  })
};

exports.down = function(knex) {
  
};
