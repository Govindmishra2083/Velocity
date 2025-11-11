"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Transmission = {
  id: string
  channel: string
  blob: Blob
  createdAt: number
}

export function useWalkie(channel: string) {
  const [isRecording, setIsRecording] = useState(false)
  const [muted, setMuted] = useState(false)
  const [recent, setRecent] = useState<{ id: string; url: string; createdAt: number; channel: string }[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const bcRef = useRef<BroadcastChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Setup BroadcastChannel
  useEffect(() => {
    const bc = new BroadcastChannel("velocity-radio")
    bcRef.current = bc
    const handler = async (ev: MessageEvent) => {
      const data = ev.data as { type: string; payload: any }
      if (data.type === "tx" && data.payload.channel === channel) {
        // Received transmission for this channel
        const arrayBuffer = await (data.payload.blob as Blob).arrayBuffer()
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setRecent((r) => [{ id: data.payload.id, url, createdAt: Date.now(), channel }, ...r].slice(0, 10))
        if (!muted) {
          try {
            if (!audioRef.current) audioRef.current = new Audio()
            audioRef.current.src = url
            await audioRef.current.play()
          } catch {
            // autoplay may fail, user can tap to play from recent list
          }
        }
      }
    }
    bc.addEventListener("message", handler)
    return () => {
      bc.removeEventListener("message", handler)
      bc.close()
    }
  }, [channel, muted])

  const start = useCallback(async () => {
    if (isRecording) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" })
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        // Broadcast to all tabs
        bcRef.current?.postMessage({ type: "tx", payload: { id, channel, blob } })
        // Also loopback to self (so single-tab works)
        bcRef.current?.postMessage({ type: "tx", payload: { id, channel, blob } })
      }
      mediaRecorderRef.current = rec
      rec.start()
      setIsRecording(true)
    } catch (e) {
      alert("Microphone access denied or unavailable.")
      console.error(e)
    }
  }, [isRecording, channel])

  const stop = useCallback(() => {
    if (!isRecording || !mediaRecorderRef.current) return
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
    setIsRecording(false)
  }, [isRecording])

  return { isRecording, start, stop, muted, setMuted, recent }
}
