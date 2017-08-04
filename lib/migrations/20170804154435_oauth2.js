
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('oauth_access_tokens', function (table) {
      table.increments('id').primary()
      table.string('access_token').notNullable().unique()
      table.string('client_secret').notNullable()
      table.timestamp('expiration_date').notNullable()
      table.string('scope')
      table.integer('client_id').unsigned().references('oauth_client.client_id')
      table.integer('user_id').unsigned().references('user.id')
    }).createTable('oauth_authorization_codes', function (table) {
      table.increments('id').primary()
      table.string('authorization_code').notNullable().unique()
      table.string('redirect_uri')
      table.timestamp('expiration_date').notNullable()
      table.string('scope')
      table.integer('client_id').unsigned().references('oauth_client.client_id')
      table.integer('user_id').unsigned().references('user.id')
    }).createTable('oauth_refresh_tokens', function (table) {
      table.increments('id').primary()
      table.string('refresh_token').notNullable().unique()
      table.timestamp('expiration_date').notNullable()
      table.string('scope')
      table.integer('client_id').unsigned().references('oauth_client.client_id')
      table.integer('user_id').unsigned().references('user.id')
    }).createTable('oauth_login', function (table) {
      table.increments('id').primary()
      table.timestamp('expiration_date').notNullable()
      table.string('token').notNullable()
      table.integer('account_id').unsigned().references('account.id')
      table.integer('user_id').unsigned().references('user.id')
    })
  ])
}

exports.down = function (knex, Promise) {

}
