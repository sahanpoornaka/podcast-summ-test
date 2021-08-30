import React, {createRef, useState} from 'react';
import ReactPlayer from 'react-player/youtube';

const MediaPlayer = ({inputURL}) => {
    const [played, setPlayed] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [seeking, setSeeking] = useState(false);
    const playerComponent = createRef();


    const handleSeekChange = e => {
        setPlayed(parseFloat(e.target.value));
    }

    const handleSeekMouseUp = e => {
        setSeeking(false);
        playerComponent.current.seekTo(parseFloat(e.target.value));
    }

    const handleSeekMouseDown = e => {
        setSeeking(true);
    }

    const handleProgress = prog => {
        // console.log('onProgress: ' + e.played)
        
        // // We only want to update time slider if we are not currently seeking
        if (!seeking) {
            setPlayed(prog.played)
        }
      }

    return(
        <div>
        <ReactPlayer
          ref={playerComponent}
          url={inputURL}
          playing={playing}
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={handleProgress}
        //   onEnded={handleOnEnded}
          />
        <button onClick={() => setPlaying(playing => !playing)}>{playing ? 'Pause' : 'Play'}</button>
            <input
                type='range' min={0} max={0.999999} step='any'
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                />
      </div>
    )
};

export default MediaPlayer;