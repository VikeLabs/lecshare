import React, {useState} from 'react'
import { BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';
import LectureContainer from './LectureContainer'
import PrivateRoute from './PrivateRoute'
import LoginPage from './LoginPage';


interface AuthState {
    authenticated:boolean
}

function LecturePage() {
    return <LectureContainer/>
} 

function LoginRouter({}) {
    
    const [authenticated, setAuthenticated] = useState(false);

    const verifyLogin = (username: string, password: string) : boolean => {
        if(username=="admin" && password=="admin") {
            setAuthenticated(true);
            return true;
        } else {
            return false;
        }  
    }
    return(
        <div>
            <Router>
                <PrivateRoute path="/" component={LecturePage} isSignedIn={authenticated} />
                <Route path="/login"><LoginPage verifyLogin={verifyLogin} authenticated={authenticated} /></Route>
                
            </Router>
        </div>
        
    )
}

export default LoginRouter;