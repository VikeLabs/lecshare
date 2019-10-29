import React from 'react'
import TopBarDrawer from "./TopBarDrawer";
import { LoginForm } from './LoginForm';



class MainContainer extends React.Component {
   
    constructor(props) {
        super(props);
        this.state = {
            courseName: 'SENG310'
        }
    }

    render() {
        return(
            <div className='main'>
                <LoginForm />
            </div>
        )
    }
}

export default MainContainer;