import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { inheritLeadingComments } from '@babel/types';
import { lineHeight, textAlign } from '@material-ui/system';
import { workerData } from 'worker_threads';

//TODO conditional font size like Medium



const useStyles = makeStyles(theme => ({
    transcriptionText: {
        fontSize: 21,
        fontFamily: 'Roboto Serif, Noto Serif, Times New Roman, serif',
        margin: 'auto',
        textAlign: 'left',
        maxWidth: '40em'
    },
    transcriptionWord: {
        display: 'inline-block',
        lineHeight: '17px',
        // marginLeft: '5px',
        // marginTop: '10px',\

        // Padding is highlighted, so it should be uniform on all sides.
        padding: '5px',
        marginLeft: '-5px',
        marginRight: '-5px',
        // Margins make up for extra space
        marginTop: '5px',
        marginBottom: '5px',
    },
    transcriptionWordHighlighted: {
        display: 'inline-block',
        lineHeight: '17px',
        // marginLeft: '5px',
        // marginTop: '10px',
        
        // Padding is highlighted, so it should be uniform on all sides.
        padding: '5px',
        marginLeft: '-5px',
        marginRight: '-5px',
        // Margins make up for extra space
        marginTop: '5px',
        marginBottom: '5px',

        backgroundColor: '#ffbed0',
        borderRadius: '10px',
        transition: 'backgroundColor 100ms linear'
    }
}));

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

export default function LectureContent(props: LectureTextProps) {
    
    const classes = useStyles();

    const bodyText = props.words.map((entry, index) => {
            if (+entry.startTimeSeconds==+entry.endTimeSeconds && props.currentSeconds == +entry.startTimeSeconds && props.currentNanos >= +entry.startTimeNano && props.currentNanos <= +entry.endTimeNano) {
                return(
                    // @ts-ignore
                    <span key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                        <div className={classes.transcriptionWordHighlighted}>{entry.word}</div>
                        &nbsp;
                    </span>                 
                )
            } else if (+entry.startTimeSeconds + 1 == +entry.endTimeSeconds) {
                if ((props.currentSeconds==+entry.startTimeSeconds && props.currentNanos >= +entry.startTimeNano) || (props.currentSeconds==+entry.endTimeSeconds && props.currentNanos <= +entry.endTimeNano)) {
                    return(
                        // @ts-ignore
                        <span key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                            <div className={classes.transcriptionWordHighlighted}>{entry.word}</div>
                            &nbsp;
                        </span>                 
                    )
                } else {
                    return(
                        // @ts-ignore
                        <span className={classes.transcriptionWord} key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                            {entry.word}&nbsp;
                        </span>
                    )
                }
            } else {  
                return(
                    // @ts-ignore
                    <span className={classes.transcriptionWord} key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>
                        {entry.word}&nbsp;
                    </span>
                )
            }
        }
    )
    
    return(
        <div className={classes.transcriptionText}><p>{bodyText}</p></div>
    )
}