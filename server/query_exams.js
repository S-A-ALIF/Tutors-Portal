const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '9192631770',
  database: 'tutors-portal'
});

async function queryExams() {
  try {
    const res = await pool.query('SELECT * FROM exams;');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error('Error querying exams:', error);
  } finally {
    await pool.end();
  }
}

queryExams();
