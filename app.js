import express from 'express'
import * as db from './database.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 8088

app.use(express.json())
app.use(express.static(__dirname))

// === API: /szamlak ===
app.get('/szamlak', (req, res) => {
  try {
    const szamlak = db.getSzamlak()
    res.status(200).json(szamlak)
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})

app.get('/szamlak/:id', (req, res) => {
  try {
    const sz = db.getSzamla(req.params.id)
    if (!sz) return res.status(404).json({ message: 'Számla nem található' })
    res.status(200).json(sz)
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})

app.post('/szamlak', (req, res) => {
  try {
    const adat = req.body
    const szükségesMezők = [
      'szamlaszam', 'kiallitonev', 'kiallitocim', 'kiallitoadoszam',
      'vevonev', 'vevocim', 'vevoadoszam',
      'kelt', 'teljesites', 'fizetesiHatarido',
      'vegosszeg', 'afa'
    ]
    if (!szükségesMezők.every(m => adat[m])) {
      return res.status(400).json({ message: 'Hiányzó adat(ok)' })
    }

    const result = db.saveSzamla(adat)
    res.status(201).json({ id: result.lastInsertRowid, ...adat })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})
app.put('/szamlak/:id', (req, res) => {
  try {
    const id = req.params.id
    const adat = req.body

    const szükségesMezők = [
      'szamlaszam', 'kiallitonev', 'kiallitocim', 'kiallitoadoszam',
      'vevonev', 'vevocim', 'vevoadoszam',
      'kelt', 'teljesites', 'fizetesiHatarido',
      'vegosszeg', 'afa'
    ]
    if (!szükségesMezők.every(m => adat[m])) {
      return res.status(400).json({ message: 'Hiányzó adat(ok)' })
    }

    const result = db.updateSzamla(id, adat)
    if (result.changes !== 1) {
      return res.status(404).json({ message: 'Számla nem található vagy nem módosítható' })
    }

    res.status(200).json({ id, ...adat })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})
app.delete('/szamlak/:id', (req, res) => {
  try {
    const result = db.deleteSzamla(req.params.id)
    if (result.changes !== 1) {
      return res.status(404).json({ message: 'Számla nem található vagy nem törölhető' })
    }
    res.status(200).json({ message: 'Törlés sikeres' })
  } catch (error) {
    res.status(500).json({ message: `${error}` })
  }
})

app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`)
})