import React, {createRef, useState} from 'react';
import axios from 'axios';
// import ReactPlayer from 'react-player/youtube';
import YouTubeVideo from './YTPlayer';
import YouTube from 'react-youtube';
import TableContainer from './TableContainer';
import {SelectColumnFilter} from './filters';
import { Container } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';

const App = () => {
  const [inputURL, setInputURL] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [taskId, setTaskId] = useState('');
  const [data, setData] = useState([]);
  // const [selectColData, setSelectColData] = useState([])
  // const [selData, setSelData] = useState([]);
  let timestamp_list = [];

  // Media Player
  const [played, setPlayed] = useState(0);
  const [playing, setPlaying] = useState(true);
  // const [seeking, setSeeking] = useState(false);
  const [isPlayAll, setIsPlayAll] = useState(false);
  const playerComponent = createRef();

  const [medPlayer, setMedPlayer] = useState(null);

  const YoutubeEmbed = ({ embedId }) => (
    <div className="video-responsive">
      <iframe
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Embedded youtube"
      />
    </div>
  );



  // if (!window.YT) { // If not, load the script asynchronously
  //   const tag = document.createElement('script');
  //   tag.src = 'https://www.youtube.com/iframe_api';

  //   // onYouTubeIframeAPIReady will load the video after the script is loaded
  //   window.onYouTubeIframeAPIReady = this.loadVideo;

  //   const firstScriptTag = document.getElementsByTagName('script')[0];
  //   firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // } else { // If script is already there, load the video directly
  //   this.loadVideo();
  // }

  // const player = YouTube('player', {
  //   height: '390',
  //   width: '640',
  //   videoId: '-HjpL-Ns6_A',
  //   playerVars: {
  //     'start': 159,
  //     'autoplay': 1,
  //     'controls': 1,
  //     'showinfo': 0,
  //     'rel': 0
  //   },
  //   events: {
  //     'onReady': onPlayerReady,
  //     'onStateChange': onPlayerStateChange,
  //   }

  // });

  // const handleSeekChange = e => {
  //     setPlayed(parseFloat(e.target.value));
  // }

  // const handleSeekMouseUp = e => {
  //     setSeeking(false);
  //     playerComponent.current.seekTo(parseFloat(e.target.value));
  // }

  // const handleSeekMouseDown = e => {
  //     setSeeking(true);
  // }

  const setSelectColData = (selectedRowVals) => {
    // timestamp_list = selectedRowVals.map(rw=> [rw.start_time, rw.end_time]);
  }

  const handleProgress = prog => {
      // console.log('onProgress: ' + e.played)
      
      // // We only want to update time slider if we are not currently seeking
      // if (!seeking) {
      //     setPlayed(prog.played)
      // }
      setPlayed(prog.played)
    }

  const handleUrlFetch = (videoUrl) => {
    setInputURL(videoUrl);
    // Extract the Video Id from the URL
    let embedId = videoUrl.split('v=').pop().split('&t=').shift();
    setEmbedId(embedId);
  };

  const sendSubmitRequest = async () => {
    try {
        const resp = await axios.get('http://localhost:5000/youtube/submit-job/'+embedId);
        if (resp.status === 202) {
          setTaskId(resp.data.task_id)
          console.log(resp.data);
          alert("Job Submision Success..")
        } else {
          alert("Job Submision Failed... \nCheck If the Video URL Is Correct")
        }

    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
  };

  const checkJobStatus = async () => {
    try {
        const resp = await axios.get('http://localhost:5000/youtube/get-result/'+taskId);
        if (resp.status !== 102) {
          console.log(resp.data);
          let result = resp.data.result;
          setData(result);
          alert("Data Retrieved Successfully...")
        } else {
          alert("Job Still Runing... \nCheck Back After Few Minutes...")
          console.log(resp.data)
        }
        console.log(data);

    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
  };


  const playSegment = (startTime) => {
    // playerComponent.current.seekTo(Math.round(parseFloat(startTime)));
    // setPlaying(true);
  };

  const handlePlayAll = () => {
    console.log(timestamp_list)
    playSegment(timestamp_list[0][0]);
  };

  const seekToTS = (rowVal) => {
    // console.log(rowVal)
    // console.log(colVal)
    // playerComponent.current.seekTo(Math.round(parseFloat(rowVal.start_time)));
    // console.log(played);
    // setPlaying(true);
    playSegment(rowVal.start_time);
    
    
  }

  const checkElapsedTime = (e) => {
    const duration = e.target.getDuration();
    const currentTime = e.target.getCurrentTime();
    console.log(currentTime);
    // if (currentTime / duration > 0.95) {
    //   setModalIsOpen(true);
    // }
  };

  const seekToYT = () => {

  }

  //useMemo(() => 
  const columns = [
      {
        Header: 'Start Time',
        // accessor: 'start_time',
        accessor: (values) => {
          const startTime = new Date(values.start_time * 1000).toISOString().substr(11, 8);
          return startTime;
        },
        disableFilters: true,
        // Cell: ({ value, column, row }) => (
        //   <button value={value} onClick={seekToTS(row.original)}>
        //     {value}
        //   </button>
        // )
        Cell: ({value, _, row}) => { return( <div className='start-time-text' onClick={ () => seekToTS(row.original) }>{value}</div> ) }
        // Cell: ({value, column, row}) => { return( <div onClick={ () => playerComponent.current.seekTo(Math.round(parseFloat(row.start_time))) }>{value}</div> ) }
        
      },
      {
        Header: 'End Time',
        // accessor: 'end_time',
        accessor: (values) => {
          const endTime = new Date(values.end_time * 1000).toISOString().substr(11, 8);
          return endTime;
        },
        disableFilters: true,
      },
      {
        Header: 'Speaker',
        accessor: 'speaker',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
      {
        Header: 'Segment Text',
        accessor: 'segment_text',
      },
      {
        Header: 'Top Words',
        // accessor: 'top_words',
        accessor: (values) => {
            const words = values.top_words;
            return words.join(', ')
          },
      },
      {
        Header: 'Section Topic',
        accessor: 'section_topic',
        Filter: SelectColumnFilter,
        filter: 'equals',
      },
    ];
    //,[]);

  const sample_data = [
    {start_time: "0.0", end_time: "1.62", speaker: "spk_1", section_topic: "Technology", segment_text: "it's optimizing the view.", top_words: [ "optimize", "view" ]},
    {start_time: "1.68", end_time: "8.31", speaker: "spk_3", section_topic: "Outdoors", segment_text: "I'm optimizing for shade actually trying to get out of the oh fucking", top_words: ["optimize", "shade", "fuck", "actually", "try", "get"]},
    {start_time: "23.98", end_time: "26.85", speaker: "spk_2", section_topic: "Fashion & Beauty", segment_text: "He lathered in his like SPF 500.", top_words: [ "lather", "spf", "like" ]},
  ];

  const testFunc = () => {
    // let new_player = new window.YT.Player('my_player');
    // new_player["id"] = embedId;
    // console.log(new_player);
    console.log(medPlayer);
  }

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  

  return(
    <div className="main-container" align="center">
      <h1>Podcast Summarizer</h1>
      <input 
      className="url-input" 
      value={inputURL} 
      // onInput={e => setInputURL(e.target.value)} 
      onInput={e => handleUrlFetch(e.target.value)}
      placeholder="URL..."
      />
      {/* <div>
        <YouTube
            videoId={embedId}
            onStateChange={(e) => checkElapsedTime(e)}
        />
      </div> */}
      <div>
      <YouTube videoId="2g811Eo7K8U" opts={opts} onReady={_onReady} />
      </div>
      <div>
        {/* <ReactPlayer
          ref={playerComponent}
          url={inputURL}
          playing={playing}
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onProgress={handleProgress}
          /> */}
        {/* <button onClick={() => setPlaying(playing => !playing)}>{playing ? 'Pause' : 'Play'}</button> */}
            {/* <input
                type='range' min={0} max={0.999999} step='any'
                value={played}
                onMouseDown={handleSeekMouseDown}
                onChange={handleSeekChange}
                onMouseUp={handleSeekMouseUp}
                /> */}
      </div>
      <div className='btn-container'>
        <button onClick={sendSubmitRequest}>Submit Job</button>
        <button onClick={checkJobStatus}>Check Job Status</button>
      </div>
      <div className='tbl-container'>
        <button onClick={handlePlayAll}>Play All</button>
        <Container style={{ marginTop: 100 }}>
          <TableContainer columns={columns} data={sample_data} setSelectColData={setSelectColData}/>
        </Container>
      </div>
      <div>
        <button onClick={testFunc}>Display Test Data</button>
        <button onClick={e => medPlayer.seekTo(5)}>Test BTN 2</button>
      </div>

    </div>
  )
};

export default App;