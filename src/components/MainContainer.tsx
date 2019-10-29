import React from 'react'
import TopBarDrawer from "./TopBarDrawer";



class MainContainer extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            courseName: 'SENG310'
        }
    }

    render() {
        return(
            <div className='main'>
                <TopBarDrawer/>
            </div>
        )
    }
}

export default MainContainer;