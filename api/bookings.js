const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id BIGSERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      service TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await initDB();

    if (req.method === 'GET') {
      const bookings = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
      return res.status(200).json(bookings);
    }

    if (req.method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body;
      const result = await sql`UPDATE bookings SET status = ${status} WHERE id = ${id} RETURNING *`;
      return res.status(200).json({ success: true, booking: result[0] });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM bookings WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
