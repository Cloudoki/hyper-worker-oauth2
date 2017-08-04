exports.up = function(knex, Promise) {
  return Promise.all([
        knex.schema.createTable('oauth_client', function (table) {
            table.increments('id').primary();
            table.string('client_id').notNullable().unique();
            table.string('client_secret').notNullable();
            table.string('redirect_uri').notNullable();
            table.string('name');
            table.string('description');
            table.string('grant_types');
            table.string('scope');
            table.integer('user_id').unsigned().references('user.id');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {

};
