import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { FaPause, FaPlay } from "react-icons/fa"
import { MdSkipNext, MdSkipPrevious } from "react-icons/md"
import './App.css'
import MUSICS from "./music.json"
function App() {
  const [currMusicIndex, setCurrMusicIndex] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isStartSong, setIsStartSong] = useState(false)
  const musRef = useRef('')

  useEffect(() => {
    const Time = setInterval(() => {
      if (musRef.current) {
        setDuration(musRef.current.currentTime)
      }
    }, 500)

    return () => clearInterval(Time)
  }, [])


  const handlePlayPauseAudio = () => {
    if (musRef.current) {
      if (!isStartSong) {
        setIsStartSong(true)
        musRef.current.play()
      }
      else {
        setIsStartSong(false)
        musRef.current.pause()
      }
    }
  }

  const handleChangeNextAudio = () => {
    if (musRef.current) {
      setCurrMusicIndex(cur => cur + 1)
    }
  }

  const handleChangePrevAudio = () => {
    if (currMusicIndex == 0) {
      setCurrMusicIndex(MUSICS.name.length - 1)
    } else {
      setCurrMusicIndex(cur => cur - 1)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    if (musRef.current) {
      musRef.current.volume = newVolume // Изменится громкость аудио
    }
  }
  const handleCurTimeChange = (e) => { // Изменится текущее время музыки
    const newTime = parseFloat(e.target.value)
    if (musRef.current) {
      musRef.current.currentTime = newTime
    }
  }
  const isLoadedMetaData = () => { // если при переключении трека предыдущий играл, то следующий тоже начинает сразу играть
    if (isStartSong) {
      musRef.current.play()
    }
  }

  useEffect(() => {
    if (currMusicIndex === MUSICS.name.length) {
      setIsStartSong(false)
      setCurrMusicIndex(0)
    }
  }, [currMusicIndex])

  useEffect(() => {//управление через наушники
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play' || 'pause', handlePlayPauseAudio)
      navigator.mediaSession.setActionHandler('nexttrack', handleChangeNextAudio)
      navigator.mediaSession.setActionHandler('previoustrack', handleChangePrevAudio)
    }
    return () => {
      if (navigator.mediaSession) {
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
      }
    }
  }, [])

  return (
    <div className="App">
      <audio ref={musRef}
        onPause={(() => setIsStartSong(false))}
        onPlay={(() => setIsStartSong(true))}
        onEnded={handleChangeNextAudio}
        onLoadedMetadata={
          isLoadedMetaData} src={`/Music/${MUSICS.name[currMusicIndex]}.mp3`}></audio>
      <main>

      </main>
      <div className='music-player'>
        <p>{MUSICS.name[currMusicIndex]}</p>
        <div className="play-menu-music">
          <div className='play-menu-buttons'>
            <div onClick={handleChangePrevAudio}>
              <MdSkipPrevious />
            </div>
            <div onClick={handlePlayPauseAudio}>
              {isStartSong ? <FaPause /> : <FaPlay />}
            </div>
            <div onClick={
              handleChangeNextAudio
            }><MdSkipNext /></div>
          </div>
          <div className='menu-play-line'>
            <input type="range" min={0} max={musRef.current.duration} value={musRef.current.currentTime} onChange={handleCurTimeChange} />
            <p>{moment.utc(duration * 1000).format("mm:ss")}</p>
          </div>
        </div>
        <div className='setting_music'>
          <h3>Громкость</h3>
          <input type="range" className='volume' value={musRef.current?.volume || 0} min={0} max={1} step={0.01} onChange={handleVolumeChange} />
        </div>
      </div>
    </div >
  )
}

export default App