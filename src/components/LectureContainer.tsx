import React from 'react'
import TopBarDrawer from "./TopBarDrawer";
import Footer from "./Footer"

interface MainState {
    courseName:string
}

class LectureContainer extends React.Component<{}, MainState> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            courseName: 'SENG310'
        }
    }

    ///method for handling course change (get new data, audio, text, lectures etc.)
    changeCourse = () => {
        
    }
    ///method for handling change in lecture, changing data but not available lectures or course
    changeLecture = () => {
    
    }
    
    render() {
        return(
            <div className='main'>
                <TopBarDrawer courseName={this.state.courseName}/>
            </div>
        )
    }
}

export default LectureContainer;