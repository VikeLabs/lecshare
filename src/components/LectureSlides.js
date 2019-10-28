import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import happyPlace from '../images/protoslideimage.jpg'

const useStyles = makeStyles(theme => ({
    slideWindow: {
        height: '500px',
        marginLeft: '20%',
        marginRight: '20%',
        backgroundColor: 'lightblue'
    },
    slideImage: {
        maxHeight: '100%',
        maxWidth: '100%'
    },
    slideContainer: {
        backgroundColor: 'lightgrey'
    }
}));

export default function LectureContent() {
    const classes = useStyles();
    return(
        <div className={classes.slideContainer}>
            <div className={classes.slideWindow}>
                <img className={classes.slideImage} src={happyPlace}></img>
            </div>
        </div>
        
    )
}