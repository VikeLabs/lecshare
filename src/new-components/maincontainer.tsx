import React, {useEffect, useState} from 'react';
import Header from './header';
import AudioFooter from './audiofooter'
import LectureText from './lecturetext'
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import SideBar from './sidebar';
import {useHistory} from "react-router-dom";

const VERIFY_CODE = gql`
    query VERIFY_CODE($crsCode: String!, $clsCode: String!, $acsKey: String!) {
        protectedClass(courseCode: $crsCode classCode: $clsCode accessKey: $acsKey) {
            name
        }
    }
`;
const GET_AUDIO_TRANSCRIPTION = gql`
    query VERIFY_CODE($crsCode: String!, $clsCode: String!, $acsKey: String!) {
        protectedClass(courseCode: $crsCode classCode: $clsCode accessKey: $acsKey) {
            name
            lectures {
                name
                audio
                transcription {
                    words {
                        word
                        starttime
                        endtime
                        type
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

type QueryInfoType = {
    classCode: String,
    courseCode: String,
    accessKey: String
}

interface MainContainerProps {
    infos: QueryInfoType
}

function MainContainer(props: MainContainerProps) {
    let initArray: WordStorageType[] = []
    const [currentValue, setCurrentValue] = useState(0);
    const [currentNanos, setCurrentNanos] = useState(0);
    const [lectureText, setLectureText] = useState(initArray);
    const [textLoading, setTextLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState("");
    const [audioLoaded, setAudioLoaded] = useState(false);
    const [metaDataLoaded, setMetaDataLoaded] = useState(false);
    const [sideBarOpen, setSideBarOpen] = useState(false);
    const [lectureIndex, setLectureIndex] = useState(0);
    const [crsCode, setCrsCode] = useState(props.infos.courseCode);
    const [clsCode, setClsCode] = useState(props.infos.classCode);
    const [acsKey, setAcsKey] = useState(props.infos.accessKey);

    const history = useHistory();
    
    const changeValue = (value: number, nanos: number) => {
        setCurrentValue(value)
        setCurrentNanos(nanos)
    };

    const changeIndex = (index: number) => {
        setAudioUrl("");
        setAudioLoaded(false);
        setMetaDataLoaded(false);
        setTextLoading(true);
        setLectureIndex(index);
    }

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

    const capitalize = (s) => {
        return s && s[0].toUpperCase() + s.slice(1);
    }

    const lecture = (data) => {
        let previousWord = "";
        let previousType;
        let previousEndSeconds = 0;
        let previousStartSeconds = 0;
        let previousEndNanos = 0;
        let previousStartNanos = 0;

        let words: WordStorageType[] = []

        for (const [index, value] of data.words.entries()) {
            let startSeconds: Number;
            let endSeconds: Number;
            let startNanos: Number;
            let endNanos: Number;
            let wordEntry: string;

            if(value.starttime == null) {
                startSeconds = previousStartSeconds;
                startNanos = previousStartNanos;
            } else {
                startSeconds = formatSeconds(value.starttime, previousStartSeconds);
                startNanos = formatNanos(value.starttime, previousStartNanos);
            }

            if(value.endtime == null) {
                endSeconds = previousEndSeconds;
                endNanos = previousEndNanos;
            } else {
                endSeconds = formatSeconds(value.endtime, previousEndSeconds);
                endNanos = formatNanos(value.endtime, previousEndNanos)
            }

            if (value.type === "punctuation") {
                words[words.length-1].word = words[words.length-1].word + value.word
                wordEntry = value.word;
                continue
            } else if (previousType === "punctuation" || previousWord === "") {
                if(previousWord !== ","){
                    wordEntry = value.word;
                } else {
                    wordEntry = value.word;
                }
            } else if(previousType === "pronunciation"){
                wordEntry = value.word;
            } else {
                wordEntry = value.word;
            }
            previousWord = value.word;
            previousType = value.type;

            let wordStorage: WordStorageType = {
                word: wordEntry,
                startTimeSeconds: startSeconds,
                endTimeSeconds: endSeconds,
                startTimeNano: startNanos,
                endTimeNano: endNanos,
            } 
            words.push(wordStorage)
        }
        // return data.words.map(({word}) => (
        //   <span>{word}</span>
        // ))
        return words;
      }

    const {data, loading, error} = useQuery(GET_AUDIO_TRANSCRIPTION, {
        variables: {
            crsCode,
            clsCode,
            acsKey
        }
    });

    if(loading) {
        console.log("Loading!");
    }

    if(data && textLoading) {
        console.log("setting text")
        let words: any
        words = lecture(data.protectedClass.lectures[lectureIndex].transcription);
        setLectureText(words);
        setTextLoading(false);
    }

    if(data && audioUrl=="") {
        console.log(data.protectedClass.lectures[lectureIndex].audio);
        setAudioUrl(data.protectedClass.lectures[lectureIndex].audio);
    }

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
                <SideBar updateIndex={changeIndex}/>
                <audio controls={false} src={audioUrl} id="currentAudio" preload="auto" onCanPlay={confirmLoaded} onLoadedMetadata={confirmAvailable}></audio>
                {lectureBody}
                {audioComponent}
        </div>
    )
}

export default MainContainer;