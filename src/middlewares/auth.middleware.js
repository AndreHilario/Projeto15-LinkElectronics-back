import { db } from '../database/database.connection.js'

export async function authValidation(req, res, next) {
  const { authorization } = req.headers

  const token = authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).send('Usuário não autorizado')

  try {
    const session = await db.collection('sessions').findOne({ token })
    if (!session) return res.status(401).send('Usuário não autorizado')

    res.locals.session = session

    next()
  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function authValidationAdmin(req, res, next) {
  const { authorization } = req.headers

  const token = authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).send('Usuário não autorizado')

  try {
    const session = await db.collection('sessions').findOne({ token })
    const { role } = session
    if (!role || role === 'basic') return res.status(401).send('Não autorizado')
    res.locals.session = session

    next()
  } catch (err) {
    res.status(500).send(err.message)
  }
}
