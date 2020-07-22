module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      builderOptions: {
        extraResources: ['src/migrations/']
      },
      externals: ['knex', 'sqlite3']
    }
  }
}