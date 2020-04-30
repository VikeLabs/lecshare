import React, {useEffect, useState} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Forward30Icon from '@material-ui/icons/Forward30';
import Replay10Icon from '@material-ui/icons/Replay10';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import LinearProgress from '@material-ui/core/LinearProgress';
import { type } from 'os';



interface AudioPlayerProps {
    value?: number
    onChange?: (value: number, nanos: number) => void
    audioLoaded: boolean
    metadataLoaded: boolean
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
        marginBottom: '-5px',
        paddingTop: '5px'
    },
    loadingContainer: {
        marginTop: '45px'
    },
    audioContainer: {
        borderTop: 'solid',
        borderWidth: '1px',
        borderColor: 'lightgray',
        height: "100px",
        width:'100%'
        
    },
    controlsContainer: {
        width: '70%'
    },
    footer: {
        display: 'flex',
        color: theme.palette.text.secondary,
        padding: 'auto',
        justifyContent: 'center',
        backgroundColor: 'white',
        position: "fixed",
        right: 0,
        left: 0,
        bottom: 5,
        zIndex: 1,
        marginBottom: "-5px"
    }
}));

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
  
function AudioFooter(props: AudioPlayerProps) {
    const theme = useTheme();
    const classes = useStyles(theme);
    const [marks, setMarks] = React.useState([{value: 0, label: '',}])
    const [duration, setDuration] = React.useState(100);
    const [playing, setPlaying] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [isSliding, setIsSliding] = React.useState(false);
    const [audioElement, setAudioElement] = React.useState(document.getElementById("currentAudio") as HTMLMediaElement)
    const requestRef: any = React.useRef();

    useEffect(() => {
        setAudioElement(document.getElementById("currentAudio") as HTMLMediaElement);
        return() => {
            cancelAnimationFrame(requestRef.current)
            audioElement.pause();
            audioElement.load();
        }
    }, []);

    const animate = (time: any) => {
        if(props.audioLoaded && props.metadataLoaded) {
            if(props.onChange) {
                props.onChange(seekSeconds(), seekNanos());
            }
        
            setValue(seekSeconds());
            setLabels(seekSeconds());
        }
        requestRef.current = requestAnimationFrame(animate);

    }

    const setLabels = (time:number) => {
        setMarks([
            {
                value: 0,
                label: formatTime(time)
            },
            {
                value: audioElement.duration,
                label: formatTime(audioElement.duration)
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
            audioElement.currentTime = value as number;
            if(!playing){
                audioElement.play();
                setPlaying(true);
            }
        }
        setIsSliding(false);
        requestRef.current = requestAnimationFrame(animate);
        
    }

    const handlePlaying = () => {
        const time = seekSeconds();
        if(playing) {
            setPlaying(false);
            audioElement.pause();
            cancelAnimationFrame(requestRef.current);
            let decimals: Number = +((audioElement.currentTime*100).toFixed()) % 100;
            console.log(decimals)
            console.log(audioElement.duration);
 
        } else {
            setPlaying(true);
            requestRef.current = requestAnimationFrame(animate);
            audioElement.play();
        }
        setLabels(time);
    }

    const seekSeconds = (time?: number) => {
        return Math.floor(audioElement.currentTime as number);
    }

    const seekNanos = (time?: number) => {
        var initial = (audioElement.currentTime as number) 
        let decimals: number = +((initial*100).toFixed()) % 100;
        return decimals
    }

    if(audioElement!=null) {
        audioElement.onloadedmetadata = function() {
            setDuration(audioElement.duration as number);
            setLabels(0);
            audioElement.volume = 0.5;
        }
    } 

    if(audioElement!=null) {
        audioElement.onended = function() {
            setPlaying(false);
            setValue(0);
        }
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
            audioElement.currentTime = targetValue;
            setValue(targetValue);
        }
    }

    return (
        <footer className={classes.footer}>
            <Container className={classes.audioContainer}>
                { !props.metadataLoaded ? (
                    <div className={classes.loadingContainer}>
                        <LinearProgress color="primary"/>
                    </div>
                ) :
                (<Container className={classes.controlsContainer}>
                    <Container className={classes.buttonContainer} >
                        <IconButton name={"backward"} value={-10} onClick={handleJump} disabled={value -10 < 0}>
                            <Replay10Icon className={classes.icon}/>
                        </IconButton>
                        <IconButton classes={{root: classes.playbackButton}} onClick={handlePlaying}>
                            {playing ? <PauseIcon className={classes.icon} /> : <PlayArrowIcon className={classes.icon}/>}
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
                    aria-labelledby="continuous-slider"
                    />
                </Container>)
                }
            </Container>
        </footer>
    )
}

export default AudioFooter;