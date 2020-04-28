import React, {useEffect, useState} from 'react';
import Header from './header';
import AudioFooter from './audiofooter'
import LectureText from './lecturetext'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';

type WordStorageType = {
    word: string,
    startTimeSeconds: string,
    endTimeSeconds: string,
    endTimeNano: number,
    startTimeNano: number
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

    useEffect(() => {
        axios.get('./vikelabs_test1.json').then(response => {
            let bodyArray: WordStorageType[] = []
            var startTimeNanosEntry;
            for (var key1 in response.data) {
                let section = response.data[key1].alternatives[0]
                for (var key2 in section.words) {
                    if(!("nanos" in section.words[key2].startTime)) {
                        startTimeNanosEntry = 0
                    } else {
                        startTimeNanosEntry =  section.words[key2].startTime.nanos
                    }
                    let wordStorage: WordStorageType = {
                        word: section.words[key2].word,
                        startTimeSeconds: section.words[key2].startTime.seconds,
                        endTimeSeconds: section.words[key2].endTime.seconds,
                        endTimeNano: section.words[key2].endTime.nanos,
                        startTimeNano: startTimeNanosEntry
                    }       
                    bodyArray.push(wordStorage)
                }        
            }
            setLectureText(bodyArray);
            setTextLoading(false);
        }) 
    
    }, []);

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
        lectureBody = <div className="textLoading"><CircularProgress /></div>
    } else {
        lectureBody = <LectureText words={lectureText} currentNanos={currentNanos} currentSeconds={currentValue}/>
    }

    let audioComponent: any;
    
    audioComponent = <AudioFooter onChange={changeValue} audioLoaded={audioLoaded} metadataLoaded={metaDataLoaded}/>
    
    //where to place audio so that it does not render every tiume?
    return(
        <div className="capsule">
            <Header/>
            <audio controls={false} id="currentAudio" onCanPlay={confirmLoaded} onLoadedMetadata={confirmAvailable}>
                <source src="http://localhost:3000/lecshare-main/vikelabs_test1.ogg" type="audio/ogg"></source>
            </audio>
            {lectureBody}
            {audioComponent}
        </div>
    )
}

export default MainContainer;