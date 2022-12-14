import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

let initialized = false
let socket: Socket | null = null

export const useSocket = () => {
  const [connected, setConnected] = useState(false)

  const init = async () => {
    initialized = true
    socket = io()
    socket.connect()

    socket.on("connect", () => {
      setConnected(true)
    })

    socket.on("disconnect", () => {
      setConnected(false)
    })

    socket.on("error", (error) => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (!initialized) init()

    return () => {
      socket?.close()
      initialized = false
      socket = null
      console.log("socket closed")
    }
  }, [])

  return { socket, connected }
}
