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

  return (
    <div className="App">
      <audio ref={musRef}
        onEnded={() => {
          setCurrMusicIndex(prev => prev + 1)
        }}
        onLoadedMetadata={() => {
          if (isStartSong) {
            musRef.current.play()
          }
        }} src={`/Music/REJDI_-_${MUSICS.name[currMusicIndex]}.mp3`}></audio>
      <main>

      </main>
      <div className='music-player'>
        <p>{MUSICS.name[currMusicIndex]}</p>
        <div className="play-menu-music">
          <div className='play-menu-buttons'>
            <div onClick={() => {
              if (currMusicIndex == 0) {
                setCurrMusicIndex(MUSICS.name.length - 1)

              } else {
                setCurrMusicIndex(cur => cur - 1)
              }
            }
            }><MdSkipPrevious /></div>
            <div onClick={() => {
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
            }}>{isStartSong ? <FaPause /> : <FaPlay />}</div>
            <div onClick={() => {
              if (currMusicIndex == MUSICS.name.length - 1) {
                setCurrMusicIndex(0)
              } else {
                setCurrMusicIndex(cur => cur + 1)
              }
            }
            }><MdSkipNext /></div>
          </div>
          <div className='menu-play-line'>
            <input type="range" min={0} max={musRef.current.duration} value={musRef.current.currentTime} onChange={(e) => {
              const newTime = parseFloat(e.target.value)
              if (musRef.current) {
                musRef.current.currentTime = newTime
              }
            }} />
            <p>{moment.utc(duration * 1000).format("mm:ss")}</p>
          </div>
        </div>
        <div className='setting_music'>
          <h3>Громкость</h3>
          <input type="range" className='volume' value={musRef.current?.volume || 0} min={0} max={1} step={0.01} onChange={(e) => {
            const newVolume = parseFloat(e.target.value)
            if (musRef.current) {
              musRef.current.volume = newVolume // Изменится громкость аудио
            }
          }} />
        </div>
      </div>
    </div >
  )
}

export default App