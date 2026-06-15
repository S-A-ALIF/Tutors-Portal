const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '9192631770',
  database: 'tutors-portal',
});

async function main() {
  try {
    await pool.query('ALTER TABLE invitations ADD COLUMN roll_no VARCHAR(255);');
    console.log('Added roll_no column.');
  } catch (e) {
    if (e.code === '42701') console.log('roll_no already exists.');
    else console.error(e);
  }
  
  try {
    await pool.query('ALTER TABLE invitations ADD COLUMN monthly_fee NUMERIC;');
    console.log('Added monthly_fee column.');
  } catch (e) {
    if (e.code === '42701') console.log('monthly_fee already exists.');
    else console.error(e);
  }
  
  process.exit(0);
}

main();
