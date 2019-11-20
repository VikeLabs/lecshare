import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    footer: {
        display: 'flex',
        color: theme.palette.text.secondary,
        padding: theme.spacing(3),
        paddingLeft: '10%',
        paddingRight: '10%',
        justifyContent: 'center',
        borderTop: 'solid',
        borderColor: 'lightgrey',
        position: "relative",
        bottom: 0
    }
}));

export default function Footer() {
    const classes = useStyles();
    return(
        <footer className={classes.footer}>
            <Typography color='inherit' align='center'>
                Lecshare brought to you by Vikelabs!<br/>
                It is our goal to make learning more accessible to everyone by recording and transcribing lectures.<br/>
                Developed by: Aomi Jokoji, Malcolm Seyd, Alex McRae, Bryce Edwards, Derek Lowlind, Goh Sato, Kevin Matthew, Malaki Vandas, and Ryley Woodland
            </Typography>
        </footer>     
    )
}