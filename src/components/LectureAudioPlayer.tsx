import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Container, Button } from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Howl, Howler} from 'howler';

interface AudioPlayerProps {
    value?: number
    source: string
}

const useStyles = makeStyles(theme => ({
    playbackButton: {
        color: "white"
    },
}));

function initializeHowler(props: AudioPlayerProps){
    return new Howl({
        src: props.source,
        preload: true
    })
}

export function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [
        h,
        m > 9 ? m : (h ? '0' + m : m || '0'),
        s > 9 ? s : '0' + s,
    ].filter(a => a).join(':');
}
  
export default function LectureAudioPlayer(props: AudioPlayerProps) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [marks, setMarks] = React.useState([{value: 0, label: '',}])
    const [howler, setHowler] = React.useState(initializeHowler(props));
    const [duration, setDuration] = React.useState(100);
    const [playing, setPlaying] = React.useState(false);


    React.useEffect(() => {
        return () => {
            // howler.off()
            howler.stop();
            howler.unload();
            // setHowler(null);
        }
    },[])

    const handleValue = (e: any, value: any) => {
        if (value as number) {
            setValue(value as number);
            setMarks([
                {
                    value: 0,
                    label: formatTime(value as number)
                },
                {
                    value: howler.duration(),
                    label: formatTime(howler.duration())
                }
            ])
        }
    }

    const handleValueCommit = (e: any, value: any) => {
        if(value as number){
            howler.seek(value as number);
            if(!playing){
                howler.play();
                setPlaying(true);
            }
        }
    }


    const handlePlaying = () => {
        setDuration(howler.duration() as number);
        if(playing){
            const i = howler.pause();
            setPlaying(false);
        } else {
            howler.play();
            setPlaying(true);
        }
        setMarks([
            {
                value: 0,
                label: formatTime(value)
            },
            {
                value: howler.duration(),
                label: formatTime(howler.duration())
            }
        ])
    }

    howler.on('load', () => {
        setMarks([
            {
                value: 0,
                label: '0:00'
            },
            {
                value: duration,
                label: formatTime(howler.duration())
            }
        ]);
        howler.volume(0.5);
    })

    howler.on('end', () => {
        setPlaying(false);
        setValue(0);
    })

    return (
        <Container>
            <Button onClick={handlePlaying} disabled={howler.state() != "loaded"} >
                {
                    playing ? <PauseIcon className={classes.playbackButton} /> : <PlayArrowIcon className={classes.playbackButton} />
                }
            </Button>
            
            
            { howler.state() === "loading" ? <LinearProgress color="secondary" /> : <Slider 
                value={value} 
                onChange={handleValue}
                onChangeCommitted={handleValueCommit}
                style={{color: 'white'}} 
                aria-labelledby="continuous-slider"
                marks={marks}
                max={duration}
                // disable the playback slider
                disabled={howler.state() != "loaded"}
                key={props.source}
            />
                
                // <CircularProgress style={{color: "white"}} />
            }
            <Typography>{props.source}</Typography>
        </Container>
    )
}