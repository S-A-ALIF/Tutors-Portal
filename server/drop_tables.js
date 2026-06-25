const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '9192631770',
  database: 'tutors-portal'
});

async function dropTables() {
  try {
    await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;');
    console.log('Successfully dropped all tables and recreated public schema.');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await pool.end();
  }
}

dropTables();
