import React, {useState} from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { Container } from "reactstrap";

import TableContainer from './TableContainer';
import {SelectColumnFilter} from './filters';

import "bootstrap/dist/css/bootstrap.min.css";
import {PlaylistPlayRounded, SkipPreviousRounded, SkipNextRounded, StopRounded} from '@material-ui/icons';
import './styles.css';

const App = () => {
    const [inputURL, setInputURL] = useState('');
    const [embedId, setEmbedId] = useState('');
    const [taskId, setTaskId] = useState('');
    const [data, setData] = useState([]);

    // Play All Properties
    let isPlaying = false;
    let isPlayAllSelected = false;
    let timestamp_list = [];
    let currentIndex = 0;


    // Media Player
    const [mediaPlayer, setMediaPlayer] = useState(null);
  
    // Media Player Variables
    // Set Media Player Object
    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        setMediaPlayer(event.target);
      }

    const _onStateChange = (event) => {
        // let playerStatus = ''
        switch(event.data){
            case -1 : 
                // playerStatus = 'unstarted';
                isPlaying = false;
                break;
            case 0 : 
                // playerStatus = 'ended';
                if(isPlaying && isPlayAllSelected) {
                    // console.log("Video Ended...");
                    // console.log(currentIndex);
                    if(currentIndex < timestamp_list.length) {
                        const [startTime, endTime] = timestamp_list[currentIndex++];
                        playSegment(startTime, endTime);
                    } else {
                        isPlayAllSelected = false;
                    }
                }
                
                isPlaying = false;
                break;
            case 1 : 
                // playerStatus = 'playing';
                isPlaying = true;
                break;
            case 2 : 
                // playerStatus = 'paused';
                isPlaying = false;
                break;
            case 3 : 
                // playerStatus = 'buffering';
                break;
            case 5 : 
                // playerStatus = 'video cued';
                break;
            default:
                // playerStatus = 'unknown state'
                isPlaying = false;

        }
        // console.log(playerStatus);
    }

    const opts = {
    height: '390',
    width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const playSegment = (startTime, endTime) => {
        let startTimeTmp = parseFloat(startTime);
        const endTimeTmp = parseFloat(endTime);
        // Add Small Time Value So That Player Can Seek if the Start Time is 0.0
        if(startTimeTmp === 0){startTimeTmp=0.01};
        // console.log("Timestamps: "+startTimeTmp + "," + endTimeTmp)
        mediaPlayer.loadVideoById({'videoId': embedId,
               'startSeconds': startTimeTmp,
               'endSeconds': endTimeTmp});
    }

    const playAllSelected = () => {
        currentIndex = 0;
        // console.log("Selected Length:"+timestamp_list.length);
        if(timestamp_list.length > 0){
            isPlayAllSelected = true;
            
            const [startTime, endTime] = timestamp_list[currentIndex++];
            playSegment(startTime, endTime);
        } else {
            alert("No Section Is Selected...")
        }

    }

    const handleNextTrack = () => {
        console.log("Current Index:", currentIndex);
        console.log("Timestamp List Length:", timestamp_list.length);
        if(timestamp_list.length>currentIndex){
            // currentIndex+=1;
            const [startTime, endTime] = timestamp_list[currentIndex++];
            playSegment(startTime, endTime);
        } else {
            alert("This is the Selected Last Section...")
        }
    }

    const handlePreviousTrack = () => {
        console.log("Current Index:", currentIndex);
        console.log("Timestamp List Length:", timestamp_list.length);
        if(timestamp_list.length>0 && currentIndex>1){
            currentIndex-=2;
            const [startTime, endTime] = timestamp_list[currentIndex++];
            playSegment(startTime, endTime);
        } else {
            currentIndex<=1 ? alert("This is the Selected First Section...") : alert("Select Sections To Play...");
        }
    }
    
    // Backend Calls
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

    // Table Related Variables
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
        Cell: ({value, _, row}) => { return( <div className='start-time-text' onClick={ () => playSegment(row.original.start_time, row.original.end_time) }>{value}</div> ) }        
        },
        {
        Header: 'End Time',
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

    // const sample_data = [
    //     {start_time: "0.0", end_time: "1.62", speaker: "spk_1", section_topic: "Technology", segment_text: "it's optimizing the view.", top_words: [ "optimize", "view" ]},
    //     {start_time: "1.68", end_time: "8.31", speaker: "spk_3", section_topic: "Outdoors", segment_text: "I'm optimizing for shade actually trying to get out of the oh fucking", top_words: ["optimize", "shade", "fuck", "actually", "try", "get"]},
    //     {start_time: "23.98", end_time: "26.85", speaker: "spk_2", section_topic: "Fashion & Beauty", segment_text: "He lathered in his like SPF 500.", top_words: [ "lather", "spf", "like" ]},
    // ];

    const setSelectColData = (selectedRowVals) => {
        timestamp_list = selectedRowVals.map(rw=> [rw.start_time, rw.end_time]);
    }

    // Rendering Function
    return(
        <div className="main-container" align="center">
            <div className="header-container">
                <h1 className="header-text">Podcast Summarizer</h1>
            </div>
          <input 
          className="url-input" 
          value={inputURL} 
          onInput={e => handleUrlFetch(e.target.value)}
          placeholder="URL..."
          />
          <div className='video-player-container'>
          <YouTube videoId={embedId} opts={opts} onReady={_onReady} onStateChange={_onStateChange}/>
          </div>
          <div className='submit-btn-container'>
            <button className='submit-btn' onClick={sendSubmitRequest}>Submit Job</button>
            <button className='submit-btn' onClick={checkJobStatus}>Check Job Status</button>
          </div>
            <div className="player-control-container">
                <SkipPreviousRounded style={{ fontSize: 40 }} onClick={e=>handlePreviousTrack()}/>
                {/* <PlaylistPlayRounded style={{ fontSize: 40 }} onClick={e=>playAllSelected()}/> */}
                <div onClick={e=>playAllSelected()}>Play All Selected</div>
                <StopRounded style={{ fontSize: 40 }} onClick={e=>{isPlayAllSelected=false;currentIndex=0;mediaPlayer.stopVideo()}}/>
                <SkipNextRounded style={{ fontSize: 40 }} onClick={e=>handleNextTrack()}/>
                
                {/* <button onClick={e=>handlePreviousTrack()}> ⏮︎</button>
                <button onClick={e=>playAllSelected()}>Play Selected</button>
                <button onClick={e=>{isPlayAllSelected=false;currentIndex=0;mediaPlayer.stopVideo()}}> ⏹︎</button>
                <button onClick={e=>handleNextTrack()}>⏭︎</button> */}
            </div>
          <div className='main-tbl-container'>
            {/* <button onClick={handlePlayAll}>Play All</button> */}
            <Container style={{ marginTop: 5 }}>
              <TableContainer columns={columns} data={data} setSelectColData={setSelectColData}/>
            </Container>
          </div>
          <div>
            {/* <button onClick={playList}>Play All</button> */}
            {/* <button onClick={e => {currentIndex=0}}>Reset Index</button> */}
            {/* <button onClick={e => {alterVar=true}}>Reset Alter</button> */}
            {/* <button onClick={e => playSegment('1', '2')}>Test BTN 1</button> */}
            {/* <button onClick={e => playAllSelected()}>Play All</button> */}
            {/* <button onClick={e => playAllSelected()}>{isPlayingTest ? "Stop" : "Play"}</button> */}
          </div>
        </div>
      )
    };
    
    export default App;