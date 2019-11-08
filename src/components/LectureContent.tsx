import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LectureText from './LectureText'
import LectureSlides from './LectureSlides'
import Footer from './Footer'

export default function LectureContent() {
    return(
        <div>
            <LectureSlides/>
            <LectureText/>
            <Footer/>
        </div>     
    )
}