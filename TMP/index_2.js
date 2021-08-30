import React, {useState} from 'react';
import Axios from'axios';
import ReactDOM from 'react-dom';
// import ReactTable from "react-table";  
import App from './App'

import "./styles.css";
import YoutubeEmbed from "./YoutubeEmbed";



function UrlFetchComponents() {
    // https://www.youtube.com/watch?v=rokGy0huYEA
    const [input, setInput] = useState(''); // '' is the initial state value
    const [embedId, setEmbedId] = useState('')
    const [data, setData] = useState([])
    const [taskId, setTaskId] = useState('')
    // const [submitJobStarted, setSubmitJobStarted] = useState(false)
    // const [submitJobFinished, setSubmitJobFinished] = useState(true)
    // const [responseData, setResponseData] = useState(null)


    function handleUrlFetch(videoUrl) {
        let embedId = videoUrl.split('v=').pop();
        setEmbedId(embedId);
    }

    function handleSubmit() {
        // Send Video EmbedId to Back End
        // let endpoint = 'https://official-joke-api.appspot.com/random_joke'
        let submitEndpoint = 'http://localhost:5000/youtube/submit-job/'+embedId
        Axios.get(submitEndpoint).then(
            (response) => {
                // setJoke(response.data.setup+' ... '+response.data.punchline);
                if (response.status === 202) {
                  setTaskId(response.data.task_id)
                  console.log(response)
                  // console.log("Task ID: "+taskId)
                  alert("Job Submision Success..")
                  // setSubmitJobStarted(true)
                  // setSubmitJobFinished(false)
                } else {
                  alert("Job Submision Failed...")
                }
            }
        )
    }

    // function handleSubmit() {
    //   const doFetch = async () => {
    //     const response = await fetch('http://localhost:5000/youtube/submit-job/'+embedId);
    //     const body = await response.json();
    //     const contacts = body.results;
    //     console.log(contacts);
    //     setData(contacts);
    //   };
    // }



    function checkJobStatus() {
      let statusEndpoint = 'http://localhost:5000/youtube/get-result/'+taskId
        Axios.get(statusEndpoint).then(
            (response) => {
              if (response.status !== 102){
                // setSubmitJobFinished(true)
                // setSubmitJobStarted(false)
                // setResponseData(response.data)
                console.log(response)
                let result = response.data.result
                setData(result)
                // console.log(result)
                // console.log(JSON.parse(result))
              } else {
                // setResponseData("Still Runing...")
                alert("Still Runing...")
                console.log(response)
              }
                // let taskId = response.data.task_id
            }
        )
    }

    return (
      <div>
      <div>
      <input 
        className="url-input" 
        value={input} 
        onInput={e => setInput(e.target.value)} 
        placeholder="URL..."
        />
      <button onClick={() => handleUrlFetch(input)}>Display Video</button>
      </div>
      <div>
      <YoutubeEmbed embedId={embedId} /> 
      </div>
      <div className="container-btn">
          <button 
            className="submit-btn" 
            onClick={handleSubmit}>
              Submit Job
            </button>
          <button 
            className="submit-btn" 
            onClick={checkJobStatus}>
              Check Job Status
            </button>
      </div>   
      <div>
      <App data={data}/>
      {/* <App/> */}
      </div>
      </div>
    );
  }

class MainWindow extends React.Component {

    render() {

      return (
        <div className="main-container">
            <div className="video-container" align="center">
                <div>
                <UrlFetchComponents/>
                </div>
              
              </div>
        </div>
      );
    }
  }

ReactDOM.render(
    <MainWindow />,
    document.getElementById('root')
  );
