import React from 'react'
import TopBarDrawer from "./TopBarDrawer";
import Footer from "./Footer"

interface MainState {
    courseName:string
}

class MainContainer extends React.Component<{}, MainState> {
    
    constructor(props: any) {
        super(props);
        this.state = {
            courseName: 'SENG310'
        }
    }

    render() {
        return(
            <div className='main'>
                <TopBarDrawer courseName={this.state.courseName}/>
                <Footer />
            </div>
        )
    }
}

export default MainContainer;