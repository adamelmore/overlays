import type { NextPage } from "next"
import Head from "next/head"
import React, { useEffect, useRef } from "react"
import { useEvent, useSocket, useStream, useTwitchEvent } from "../hooks"
import type {
  TwitchChannelRedemptionEvent,
  TwitchChatEvent,
  TwitchEvent,
} from "../lib/twitch"
import { useRouter } from "next/router"
import { getReward } from "../lib/rewards"
import { useLocalStorageValue } from "@react-hookz/web"
import hash from "object-hash"
import { Carousel, AudioSpectrum } from "../components"
import { fadeAudioOut } from "../lib/audio"

const Home: NextPage = () => {
  const [currentTrack, setCurrentTrack] = React.useState<string>()
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (currentTrack) {
      audioRef.current?.play()
    } else if (audioRef.current) {
      fadeAudioOut({ audio: audioRef.current })
    }
  }, [currentTrack])

  const router = useRouter()

  const [topic, setTopic] = useLocalStorageValue<string>("topic", "", {
    initializeWithStorageValue: false,
  })

  const handleTwitchChatEvent = (event: TwitchChatEvent) => {
    console.log(event)
    const isAdmin = event.moderator || event.broadcaster

    if (isAdmin && event.message.startsWith("!topic")) {
      setTopic(event.message.split("!topic")[1].trim())
    }
  }

  const { socket } = useSocket()
  useEvent<TwitchChatEvent>(socket, "twitch-chat-event", handleTwitchChatEvent)
  useEvent<{ track: string }>(socket, "play-audio", ({ track }) => {
    setCurrentTrack(track)
  })
  useEvent(socket, "stop-audio", () => {
    setCurrentTrack(undefined)
  })

  useEffect(() => {
    const timer = setInterval(() => {
      fetch(`/api/ping?id=${router.query.id}`, {
        method: "post",
      })
    }, 1000 * 10)
    return () => clearInterval(timer)
  }, [router.query.id])

  return (
    <div className="relative flex h-[1080px] w-[1920px] flex-col space-y-10">
      <Head>
        <title>Adam&apos;s Twitch Overlay</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {currentTrack && (
        <audio
          loop
          ref={audioRef}
          id="audio-element"
          src={`/media/${currentTrack}`}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-20 bg-mauve-1">
        <Carousel interval={20 * 1000}>
          <div className="flex h-full space-x-10 px-10">
            <div className="relative w-40">
              <Timer />
            </div>
            <div className="relative flex flex-grow items-center text-lg text-mauve-12">
              {topic}
            </div>
            <div className="relative w-40">
              {currentTrack ? (
                <AudioSpectrum
                  audioRef={audioRef}
                  meterCount={8}
                  width={160}
                  height={60}
                />
              ) : (
                <WideBrandDetail />
              )}
            </div>
          </div>
          <div className="flex h-full space-x-10 px-10">
            <div className="relative w-20">
              <BrandMark />
            </div>
            <div className="relative flex flex-grow items-center text-lg text-mauve-12">
              {topic}
            </div>
            <div className="relative w-20">
              {currentTrack ? (
                <AudioSpectrum
                  audioRef={audioRef}
                  meterCount={4}
                  width={80}
                  height={60}
                />
              ) : (
                <BrandDetail />
              )}
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  )
}

export default Home

const Timer = () => {
  const [timer, setTimer] = React.useState<string>()
  const stream = useStream()

  useEffect(() => {
    const actualStart = stream?.current?.actualStart
    if (!stream || !actualStart) return

    const intervalHandle = setInterval(() => {
      const now = new Date()
      const start = new Date(actualStart)
      const diff = now.getTime() - start.getTime()
      const timer = new Date(diff)
      setTimer(timer.toISOString().substring(11, 19))
    }, 1000)

    return () => clearInterval(intervalHandle)
  }, [stream])

  return (
    <div className="absolute inset-0 flex items-center">
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="40" r="8" fill="#25D0AB" />
      </svg>
      <div className="absolute left-[49px] text-2xl text-mauve-12">{timer}</div>
    </div>
  )
}

const BrandMark = () => {
  return (
    <div className="flex justify-end">
      <svg
        width="81"
        height="80"
        viewBox="0 0 81 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M80 20L80 60" stroke="#EDEDEF" />
        <path d="M80 40L56 40" stroke="#EDEDEF" />
        <circle cx="32" cy="40" r="8" fill="#25D0AB" />
      </svg>
    </div>
  )
}

const BrandDetail = () => {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="69" width="2" height="2" fill="#25D0AB" />
      </svg>
    </div>
  )
}

const WideBrandDetail = () => {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="9" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="29" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="49" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="69" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="89" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="89" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="89" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="89" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="109" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="109" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="109" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="109" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="129" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="129" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="129" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="129" y="69" width="2" height="2" fill="#25D0AB" />
        <rect x="149" y="9" width="2" height="2" fill="#25D0AB" />
        <rect x="149" y="29" width="2" height="2" fill="#25D0AB" />
        <rect x="149" y="49" width="2" height="2" fill="#25D0AB" />
        <rect x="149" y="69" width="2" height="2" fill="#25D0AB" />
      </svg>
    </div>
  )
}
