import React from 'react';
import '../new-component-css/lecturetext.css'

type WordStorageType = {
    word: string,
    startTimeSeconds: string,
    endTimeSeconds: string,
    endTimeNano: number,
    startTimeNano: number
}

interface LectureTextProps {
    words: Array<WordStorageType>,
    currentSeconds: number
    currentNanos: number
}

interface LectureProps {
    courseName: string
    currentSeconds: number
    currentNanos: number
    value?: number
}

function LectureText(props: LectureTextProps) {

    const bodyText = props.words.map((entry, index) => { 
        if (+entry.startTimeSeconds==+entry.endTimeSeconds && props.currentSeconds == +entry.startTimeSeconds && props.currentNanos >= +entry.startTimeNano && props.currentNanos <= +entry.endTimeNano) {
            return(
                // @ts-ignore
                <span className="word" key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                    <div className="highlight">{entry.word}&nbsp;</div>
                </span>
            )
        } else if (+entry.startTimeSeconds + 1 == +entry.endTimeSeconds) {
            if ((props.currentSeconds==+entry.startTimeSeconds && props.currentNanos >= +entry.startTimeNano) || (props.currentSeconds==+entry.endTimeSeconds && props.currentNanos <= +entry.endTimeNano)) {
                return(
                    // @ts-ignore
                    <span className="word" key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                        <div className="highlight">{entry.word}</div>
                        &nbsp;
                    </span>                 
                )
            } else {
                return(
                    // @ts-ignore
                    <span className="word" key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                        {entry.word}&nbsp;
                    </span>
                )
            }
        } else {  
            return(
                // @ts-ignore
                <span className="word" key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                    {entry.word}&nbsp;
                </span>
            )
        }
    }
    
)
    return(
        <div className="lectureContainer">
            <div className="topSpacer"/>
            <div className="lectureText">
                {bodyText}
            </div>
            <div className="botSpacer"></div>
        </div>
    )
}

export default LectureText;