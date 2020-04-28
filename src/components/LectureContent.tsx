import React from 'react'
import LectureText from './LectureText'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';


interface LectureProps {
    courseName: string,
    currentSeconds: number
    currentNanos: number
    value?: number
}

interface LectureState {
    courseName: string,
    textLoad: boolean,
    wordArray: Array<WordStorageType>
}

type WordStorageType = {
    word: string,
    startTimeSeconds: string,
    endTimeSeconds: string,
    endTimeNano: number,
    startTimeNano: number
}

class LectureContent extends React.Component<LectureProps, LectureState> {

    //for now this is a local file but eventually we will call to api to get this file. (then store in cache to quickly grab if revisiting the same component)
    //alternatively we have this call in the backend to create the html which is then sent back (but for demo we do not have)
    componentDidMount() {
        axios.get('./vikelabs_test1.json').then(response => {
            let bodyArray: WordStorageType[] = []
            var startTimeNanosEntry;
            for (var key1 in response.data) {
                let section = response.data[key1].alternatives[0]
                for (var key2 in section.words) {
                    if(!("nanos" in section.words[key2].startTime)) {
                        startTimeNanosEntry = 0
                    } else {
                        startTimeNanosEntry =  section.words[key2].startTime.nanos
                    }
                    let wordStorage: WordStorageType = {
                        word: section.words[key2].word,
                        startTimeSeconds: section.words[key2].startTime.seconds,
                        endTimeSeconds: section.words[key2].endTime.seconds,
                        endTimeNano: section.words[key2].endTime.nanos,
                        startTimeNano: startTimeNanosEntry
                    }       
                    bodyArray.push(wordStorage)
                }
                    
            }
            this.setState({wordArray: bodyArray})
            this.setState({textLoad: true})
        })
    }

    constructor(props: LectureProps) {
        super(props)
        this.state = {
            courseName: this.props.courseName,
            textLoad: false,
            wordArray: []
        }
    }

    render() {

        let lectureBody: any;

        if (this.state.textLoad) {
            lectureBody = <LectureText words={this.state.wordArray} currentSeconds={this.props.currentSeconds} currentNanos={this.props.currentNanos}/>
        } else {
            lectureBody = <CircularProgress />
        }
        return(
            <div>
                {/* <LectureSlides/> */}
                {lectureBody}
                {/*<Footer/>*/}
            </div>     
        )
    }
    
}

export default LectureContent;