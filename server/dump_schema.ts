import { pool } from './src/config/db.config';

async function extractSchema() {
    try {
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        `);

        for (let row of tablesRes.rows) {
            const tableName = row.table_name;
            console.log(`-- Table: ${tableName}`);
            
            const colsRes = await pool.query(`
                SELECT column_name, data_type, character_maximum_length, is_nullable, column_default 
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position
            `, [tableName]);
            
            console.log(`CREATE TABLE ${tableName} (`);
            const cols = colsRes.rows.map(c => {
                let def = `  ${c.column_name} ${c.data_type}`;
                if (c.character_maximum_length) def += `(${c.character_maximum_length})`;
                if (c.is_nullable === 'NO') def += ` NOT NULL`;
                if (c.column_default) def += ` DEFAULT ${c.column_default}`;
                return def;
            });
            console.log(cols.join(',\n'));
            console.log(`);\n`);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
extractSchema();
