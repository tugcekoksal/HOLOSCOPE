// pages/api/admin-signin.js
import { sign } from "jsonwebtoken"
import { serialize } from "cookie"

const SECRET_KEY = process.env.JWT_SECRET
const Password = process.env.password
const Username = process.env.username

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  const { username, password } = req.body

  // In a real application, you would check these credentials against a database
  if (username === Username && password === Password) {
    const token = sign({ username }, SECRET_KEY, { expiresIn: "1h" })
    const serialized = serialize("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    })
    console.log("serialized:", serialized)

    res.setHeader("Set-Cookie", serialized)
    res.status(200).json({ message: "Success" })
  } else {
    res.status(401).json({ message: "Invalid credentials" })
  }
}
