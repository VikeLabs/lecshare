import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import LectureAudioPlayer from './LectureAudioPlayer';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        color: theme.palette.text.secondary,
        padding: theme.spacing(3),
        justifyContent: 'center',
        borderTop: 'solid',
        borderColor: 'lightgrey',
        backgroundColor: 'white',
        position: "fixed",
        height: '200px',
        bottom: 0
    }
}));

export default function AudioContainer() {
    const classes = useStyles();
    return(
        <footer className={classes.footer}>
            
        </footer>     
    )
}