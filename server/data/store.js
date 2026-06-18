
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      isAdmin BOOLEAN DEFAULT FALSE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS houses (
      id VARCHAR(36) PRIMARY KEY,
      title TEXT NOT NULL,
      link TEXT NULL,
      imagePath TEXT NULL,
      location TEXT NOT NULL,
      type TEXT NOT NULL,
      price DOUBLE,
      rooms INT,
      bathrooms INT,
      ibiPrice DOUBLE DEFAULT 0,
      communityFee DOUBLE DEFAULT 0,
      visited BOOLEAN DEFAULT FALSE,
      description TEXT NULL,
      pros TEXT NULL,
      cons TEXT NULL,
      agentName TEXT NULL,
      agentPhone TEXT NULL
    )
  `);
}
await init();

const uuid = () => crypto.randomUUID();

export async function countUsers() {
  const [r] = await pool.query('SELECT COUNT(*) c FROM users');
  return r[0].c;
}
export async function findUserByUsername(username) {
  const [r] = await pool.query('SELECT * FROM users WHERE username=?',[username]);
  return r[0] || null;
}
export async function getAllUsers() {
  const [r] = await pool.query('SELECT * FROM users');
  return r;
}
export async function createUser(username,password,isAdmin=false) {
  const existing = await findUserByUsername(username);
  if(existing) throw new Error('User already exists');
  const hash = await bcrypt.hash(password,10);
  const id = uuid();
  await pool.query('INSERT INTO users(id,username,password,isAdmin) VALUES (?,?,?,?)',[id,username,hash,isAdmin]);
  return {id,username,password:hash,isAdmin};
}
export const createDefaultUser=createUser;

export async function getAllHouses(){ const [r]=await pool.query('SELECT * FROM houses'); return r; }
export async function filterHouses(){ return getAllHouses(); }
export async function getHouseById(id){ const [r]=await pool.query('SELECT * FROM houses WHERE id=?',[id]); return r[0]||null; }
export async function createHouse(h) {
  const id = uuid();

  await pool.query(
    `INSERT INTO houses(
      id,
      title,
      link,
      imagePath,
      location,
      type,
      price,
      rooms,
      bathrooms,
      ibiPrice,
      communityFee,
      visited,
      description,
      pros,
      cons,
      agentName,
      agentPhone
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      h.title,
      h.link,
      h.imagePath,
      h.location,
      h.type,
      h.price,
      h.rooms,
      h.bathrooms,
      h.ibiPrice || 0,
      h.communityFee || 0,
      0, // default: not visited
      h.description,
      h.pros,
      h.cons,
      h.agentName,
      h.agentPhone
    ]
  );

  return {
    id,
    ...h,
    visited: false
  };
}

export async function updateHouse(id, changes) {
  const current = await getHouseById(id);

  if (!current) {
    return null;
  }

  const h = {
    ...current,
    ...Object.fromEntries(
      Object.entries(changes).filter(
        ([, v]) => v !== undefined && v !== null && v !== ''
      )
    )
  };

  const visited =
    h.visited === true ||
    h.visited === 1 ||
    h.visited === '1' ||
    h.visited === 'true';

  await pool.query(
    `UPDATE houses SET
      title=?,
      link=?,
      imagePath=?,
      location=?,
      type=?,
      price=?,
      rooms=?,
      bathrooms=?,
      ibiPrice=?,
      communityFee=?,
      visited=?,
      description=?,
      pros=?,
      cons=?,
      agentName=?,
      agentPhone=?
     WHERE id=?`,
    [
      h.title,
      h.link,
      h.imagePath,
      h.location,
      h.type,
      h.price,
      h.rooms,
      h.bathrooms,
      h.ibiPrice || 0,
      h.communityFee || 0,
      visited ? 1 : 0,
      h.description,
      h.pros,
      h.cons,
      h.agentName,
      h.agentPhone,
      id
    ]
  );

  return getHouseById(id);
}
export async function deleteHouse(id){ const old=await getHouseById(id); await pool.query('DELETE FROM houses WHERE id=?',[id]); return old; }
