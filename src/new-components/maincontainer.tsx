import React, {useEffect, useState} from 'react';
import Header from './header';
import AudioFooter from './audiofooter'
import LectureText from './lecturetext'
import CircularProgress from '@material-ui/core/CircularProgress';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/react-hooks'
import SideBar from './sidebar';
import {useHistory} from "react-router-dom";

// const GET_AUDIO_TRANSCRIPTION = gql`
// {
//     schools(code:"VIKELABS") {
//     name
//     description
//     courses {
//         name
//         classes {
//             term
//             section
//             lectures {
//                 name
//                 audio
//                 transcription {
//                     words {
//                         starttime
//                         endtime
//                         word
//                     }
//                 }
//             }
//         }
//     }
//     }
// }
// `;
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
        console.log("Ping!" +index)
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

        //formatted when form changed (will have another component encapsulating these ones)
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
        words = data.protectedClass.lectures[lectureIndex].transcription.words
        let bodyArray: WordStorageType[] = []
        let lastStartSecond: Number = 0
        let lastStartNano: Number = 0
        let lastEndSecond: Number = 0
        let lastEndNano: Number = 0

            for (var index in words) {
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
        console.log(data.protectedClass.lectures[lectureIndex].audio);
        setAudioUrl(data.protectedClass.lectures[lectureIndex].audio);
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
                <SideBar updateIndex={changeIndex}/>
                <audio controls={false} src={audioUrl} id="currentAudio" preload="auto" onCanPlay={confirmLoaded} onLoadedMetadata={confirmAvailable}></audio>
                {lectureBody}
                {audioComponent}
        </div>
    )
}

export default MainContainer;