import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { inheritLeadingComments } from '@babel/types';
import { lineHeight, textAlign } from '@material-ui/system';
import { workerData } from 'worker_threads';

const useStyles = makeStyles(theme => ({
    transcriptionText: {
        fontSize: 16,
        marginLeft: '20%',
        marginRight: '20%',
        textAlign: 'left'
    },
    transcriptionWord: {
        display: 'inline-block',
        lineHeight: '17px',
        marginRight: '5px',
        marginTop: '10px',
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
    currentValue: number
}

export default function LectureContent(props: LectureTextProps) {
    const classes = useStyles();

    const bodyText = props.words.map((entry, index) => {
            if (props.currentValue < +entry.startTimeSeconds) {
                return(
                    // @ts-ignore
                    <span className={classes.transcriptionWord} key={index} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>{entry.word}</span>
                )
            } else {
                return(
                    // @ts-ignore
                    <span className={classes.transcriptionWord} key={index} style={{fontWeight: "bold"}} starttimeseconds={entry.startTimeSeconds} starttimenano={entry.startTimeNano} endtimeseconds={entry.endTimeSeconds} endtimenano={entry.endTimeNano}>{entry.word}</span>
                )
            }
        }
    )
    
    return(
        <div className={classes.transcriptionText}><p>{bodyText}</p></div>
    )
}