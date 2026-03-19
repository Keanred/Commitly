import { migrate } from './migrate';
import sql from './connection';

migrate()
  .then(() => {
    console.log('Done');
    return sql.end();
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
