import Database from 'better-sqlite3'

const db = new Database('./database.sqlite')

db.prepare(`
  CREATE TABLE IF NOT EXISTS szamlak (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    szamlaszam TEXT,
    kiallitonev TEXT,
    kiallitocim TEXT,
    kiallitoadoszam TEXT,
    vevonev TEXT,
    vevocim TEXT,
    vevoadoszam TEXT,
    kelt TEXT,
    teljesites TEXT,
    fizetesiHatarido TEXT,
    vegosszeg REAL,
    afa REAL
  )
`).run()

const count = db.prepare('SELECT COUNT(*) AS cnt FROM szamlak').get().cnt
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO szamlak (
      szamlaszam, kiallitonev, kiallitocim, kiallitoadoszam,
      vevonev, vevocim, vevoadoszam,
      kelt, teljesites, fizetesiHatarido,
      vegosszeg, afa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertMany = db.transaction((szamlak) => {
    for (const sz of szamlak) {
      insert.run(
        sz.szamlaszam, sz.kiallitonev, sz.kiallitocim, sz.kiallitoadoszam,
        sz.vevonev, sz.vevocim, sz.vevoadoszam,
        sz.kelt, sz.teljesites, sz.fizetesiHatarido,
        sz.vegosszeg, sz.afa
      )
    }
  })

  insertMany([
    {
      szamlaszam: 'A001',
      kiallitonev: 'Cég Kft.',
      kiallitocim: 'Budapest, Fő utca 1.',
      kiallitoadoszam: '12345678-1-42',
      vevonev: 'Vevő 1',
      vevocim: 'Pécs, Kossuth tér 3.',
      vevoadoszam: '87654321-1-23',
      kelt: '2024-01-01',
      teljesites: '2024-01-01',
      fizetesiHatarido: '2024-01-15',
      vegosszeg: 127000,
      afa: 27000
    },
    {
      szamlaszam: 'A002',
      kiallitonev: 'Cég Kft.',
      kiallitocim: 'Budapest, Fő utca 1.',
      kiallitoadoszam: '12345678-1-42',
      vevonev: 'Vevő 1',
      vevocim: 'Pécs, Kossuth tér 3.',
      vevoadoszam: '87654321-1-23',
      kelt: '2024-01-10',
      teljesites: '2024-01-10',
      fizetesiHatarido: '2024-01-25',
      vegosszeg: 63500,
      afa: 13500
    },

  ])
}

export const getSzamlak = () =>
  db.prepare('SELECT * FROM szamlak').all()

export const getSzamla = (id) =>
  db.prepare('SELECT * FROM szamlak WHERE id = ?').get(id)

export const saveSzamla = (adat) =>
  db.prepare(`
    INSERT INTO szamlak (
      szamlaszam, kiallitonev, kiallitocim, kiallitoadoszam,
      vevonev, vevocim, vevoadoszam,
      kelt, teljesites, fizetesiHatarido,
      vegosszeg, afa
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    adat.szamlaszam, adat.kiallitonev, adat.kiallitocim, adat.kiallitoadoszam,
    adat.vevonev, adat.vevocim, adat.vevoadoszam,
    adat.kelt, adat.teljesites, adat.fizetesiHatarido,
    adat.vegosszeg, adat.afa
  )
  export const updateSzamla = (id, adat) =>
    db.prepare(`
      UPDATE szamlak SET
        szamlaszam = ?, kiallitonev = ?, kiallitocim = ?, kiallitoadoszam = ?,
        vevonev = ?, vevocim = ?, vevoadoszam = ?,
        kelt = ?, teljesites = ?, fizetesiHatarido = ?,
        vegosszeg = ?, afa = ?
      WHERE id = ?
    `).run(
      adat.szamlaszam, adat.kiallitonev, adat.kiallitocim, adat.kiallitoadoszam,
      adat.vevonev, adat.vevocim, adat.vevoadoszam,
      adat.kelt, adat.teljesites, adat.fizetesiHatarido,
      adat.vegosszeg, adat.afa,
      id
    )
export const deleteSzamla = (id) =>
  db.prepare('DELETE FROM szamlak WHERE id = ?').run(id)