import postgres from 'postgres';
import cfg from '../config';

const sql = postgres(cfg.db.dbUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default sql;
