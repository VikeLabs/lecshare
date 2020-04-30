import React, {useEffect, useState} from 'react';
import Header from './header';
import AudioFooter from './audiofooter'
import LectureText from './lecturetext'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import {ApolloClient} from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import {ApolloProvider} from "@apollo/react-hooks";
import { format } from 'path';

const GET_AUDIO_TRANSCRIPTION = gql`
{
    schools(code:"VIKELABS") {
    name
    description
    courses {
        name
        classes {
            term
            section
            lectures {
                name
                audio
                transcription {
                    words {
                        starttime
                        endtime
                        word
                    }
                }
            }
        }
    }
    }
}
`;

type WordStorageType = {
    word: string,
    startTimeSeconds: Number,
    endTimeSeconds: Number,
    endTimeNano: Number,
    startTimeNano: Number
}

function MainContainer() {
    let initArray: WordStorageType[] = []
    const [currentValue, setCurrentValue] = useState(0);
    const [currentNanos, setCurrentNanos] = useState(0);
    const [lectureText, setLectureText] = useState(initArray);
    const [textLoading, setTextLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState("");
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [metaDataLoaded, setMetaDataLoaded] = useState(false);
    const changeValue = (value: number, nanos: number) => {
        setCurrentValue(value)
        setCurrentNanos(nanos)
    };

    const formatSeconds = (time: string, lastSecond: Number) => {
        if(time!=null) {
            var nums = time.split(".")
            return +nums[0]
        } else {
            return lastSecond
        }
    }

    const formatNanos = (time: string, lastNano: Number) => {
        if(time!=null) {
            var nums = time.split(".")
            if(nums[1].length == 1) {
                nums[1] += "0";
                return +nums[1]
            } else {
                return +nums[1]
            }
        } else {
            return lastNano;
        }
        
    }

        //formatted when form changed (will have another component encapsulating these ones)
    const {data, loading, error} = useQuery(GET_AUDIO_TRANSCRIPTION);

    if(loading) {
        console.log("Loading!");
    }

    if(data && textLoading) {
        let words: any
        words = data.schools[0].courses[0].classes[0].lectures[0].transcription.words
        let bodyArray: WordStorageType[] = []
        let lastStartSecond: Number = 0
        let lastStartNano: Number = 0
        let lastEndSecond: Number = 0
        let lastEndNano: Number = 0

            for (var index in words) {
                console.log(words[index]); 
                let startSeconds: Number;
                let endSeconds: Number;
                let startNanos: Number;
                let endNanos: Number;

                if(words[index].starttime == null) {
                    startSeconds = lastStartSecond;
                    startNanos = lastStartNano;
                } else {
                    startSeconds = formatSeconds(words[index].starttime, lastStartSecond);
                    startNanos = formatNanos(words[index].starttime, lastEndSecond);
                }

                if(words[index].endtime == null) {
                    endSeconds = lastEndSecond;
                    endNanos = lastEndNano;
                } else {
                    endSeconds = formatSeconds(words[index].endtime, lastEndSecond);
                    endNanos = formatNanos(words[index].endtime, lastEndNano)
                }
                lastStartSecond = startSeconds
                lastStartNano = startNanos
                lastEndSecond = endSeconds
                lastEndNano = endNanos

                let wordStorage: WordStorageType = {
                    word: words[index].word,
                    startTimeSeconds: startSeconds,
                    endTimeSeconds: endSeconds,
                    startTimeNano: startNanos,
                    endTimeNano: endNanos,
                } 
                bodyArray.push(wordStorage)
            }
            setLectureText(bodyArray);
            setTextLoading(false);
    }
    //should also cover conditional for swapping lectures
    if(data && audioUrl=="") {
        console.log(data.schools[0].courses[0].classes[0].lectures[0].audio);
        setAudioUrl(data.schools[0].courses[0].classes[0].lectures[0].audio)
    }


    // useEffect(() => {
    //     axios.get('./vikelabs_test1.json').then(response => {
            
    //     }) 
    
    // }, []);

    const confirmLoaded = () => {
        setAudioLoaded(true);
        console.log("Audio can play!");
    }

    const confirmAvailable=() => {
        setMetaDataLoaded(true);
        console.log("Got metadata!");
    }

    

    let lectureBody: any;
    if (textLoading) {
        lectureBody = <div><div className="topSpacer"/><div className="textLoading"><CircularProgress /></div></div>
    } else {
        lectureBody = <LectureText words={lectureText} currentNanos={currentNanos} currentSeconds={currentValue}/>
    }

    let audioComponent: any;
    
    audioComponent = <AudioFooter onChange={changeValue} audioLoaded={audioLoaded} metadataLoaded={metaDataLoaded}/>
    
    //where to place audio so that it does not render every tiume?
    return(
        <div className="capsule">
                <Header/>
                <audio controls={false} src={audioUrl} id="currentAudio" preload="auto" onCanPlay={confirmLoaded} onLoadedMetadata={confirmAvailable}></audio>
                {lectureBody}
                {audioComponent}
        </div>
    )
}

export default MainContainer;