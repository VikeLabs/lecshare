import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Container, Button } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Forward30Icon from '@material-ui/icons/Forward30';
import Replay10Icon from '@material-ui/icons/Replay10';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Howl, Howler} from 'howler';

interface AudioPlayerProps {
    value?: number
    source: string
    onChange?: (value: number, nanos: number) => void
    displacement: number
}

const useStyles = makeStyles(theme => ({
    playbackButton: {
    },
    icon: {
        color: "black",
    },
    label: {
        color: "black"
    },
    valueLabel: {
        color: "black"
    },
    buttonContainer: {
        color: "black",
        marginBottom: '-5px'
    },
    footer: {
        display: 'flex',
        color: theme.palette.text.secondary,
        padding: 'auto',
        justifyContent: 'center',
        backgroundColor: 'snow',
        position: "fixed",
        right: 0,
        left: 300,
        bottom: 0
    }
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
    const [marks, setMarks] = React.useState([{value: 0, label: '',}])
    const [howler, setHowler] = React.useState(initializeHowler(props));
    const [duration, setDuration] = React.useState(100);
    const [playing, setPlaying] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [isSliding, setIsSliding] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);

    const requestRef: any = React.useRef();
  
    React.useEffect(() => {
        // runs on component mount
        // requestRef.current = requestAnimationFrame(animate);
        return () => {
            // dismount
            cancelAnimationFrame(requestRef.current);
            // unload Howler
            howler.stop();
            howler.unload();
        }
    },[])

    const seekSeconds = (time?: number) => {
        return Math.floor(howler.seek() as number);
    }

    const seekNanos = (time?: number) => {
        var initial = (howler.seek() as number) 
        var decimal = (initial % 1) * 10
        var rounded = Math.round(decimal)
        return rounded * 100000000
    }

    const animate = (time: any) => {
        // The 'state' will always be the initial value here
        if(howler.state() == "loaded"){
            if(props.onChange){
                props.onChange(seekSeconds(), seekNanos());
            }
            setValue(seekSeconds());
            setLabels(seekSeconds());
        }
        requestRef.current = requestAnimationFrame(animate);
    }

    const setLabels = (time: number) => {
        setMarks([
            {
                value: 0,
                label: formatTime(time)
            },
            {
                value: howler.duration(),
                label: formatTime(duration)
            }
        ])
    }

    const handleValue = (e: any, value: any) => {
        if(!isSliding){
            setIsSliding(true);
            cancelAnimationFrame(requestRef.current);
        } 
        
        setValue(value as number);
        if(props.onChange){
            props.onChange(value as number, 0);
        }
        setLabels(value);
    }

    const handleValueCommit = (e: any, value: any) => {
        if(value as number){
            howler.seek(value as number);
            if(!playing){
                howler.play();
                setPlaying(true);
                
            }
        }
        setIsSliding(false);
        requestRef.current = requestAnimationFrame(animate);
        
    }

    const handlePlaying = () => {
        const time = seekSeconds();
        if(playing){
            howler.pause();
            cancelAnimationFrame(requestRef.current);
            setPlaying(false);
        } else {
            howler.play();
            requestRef.current = requestAnimationFrame(animate);
            setPlaying(true);
        }
        
        setLabels(time)
    }

    const handleJump = (event: React.MouseEvent<HTMLButtonElement>) => {
        const offset = parseInt(event.currentTarget.value);
        const targetValue = offset + value;
        console.log(offset, value, targetValue)
        if(targetValue > 0 && targetValue < duration){
            setValue(targetValue);
            if(!playing){
                setLabels(targetValue);
                if(props.onChange){
                    props.onChange(targetValue, 0);
                }
            }
            howler.seek(targetValue);
        }
    }

    // Howler event when audio is loaded.
    howler.on('load', () => {
        setDuration(howler.duration() as number);
        setLabels(0);
        setLoaded(true);
        howler.volume(0.5);
    })

    //  Howler event when audio has finished playback.
    howler.on('end', () => {
        setPlaying(false);
        setValue(0);
    })

    return (
        <footer className={classes.footer}>
            <Container>
                { !loaded ? (
                    <LinearProgress color="primary" />
                ) :
                (<Container>
                    <Container className={classes.buttonContainer} >
                        <IconButton name={"backward"} value={-10} onClick={handleJump} disabled={value -10 < 0}>
                            <Replay10Icon className={classes.icon}/>
                        </IconButton>
                        <IconButton onClick={handlePlaying} classes={{root: classes.playbackButton}}>
                            {playing ? <PauseIcon className={classes.icon} /> : <PlayArrowIcon className={classes.icon} />}
                        </IconButton>
                        <IconButton name={"forward"} value={30} onClick={handleJump} disabled={value + 30 > duration}>
                            <Forward30Icon className={classes.icon}/>
                        </IconButton>
                    </Container>
                    <Slider 
                    value={value} 
                    onChange={handleValue}
                    onChangeCommitted={handleValueCommit}
                    style={{color: 'black'}} 
                    classes={{
                        markLabel: classes.label,
                        valueLabel: classes.valueLabel
                    }} 
                    marks={marks}
                    max={duration}
                    key={props.source}
                    aria-labelledby="continuous-slider"
                    />
                </Container>)
                }
            </Container>
        </footer>
    )
}