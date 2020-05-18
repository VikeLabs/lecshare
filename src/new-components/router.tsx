import React, {useEffect, useState} from 'react';
import CourseEntry from './courseEntry';
import MainContainer from './maincontainer';
import {useHistory} from "react-router-dom";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

function LecshareRouter() {
    const [pageNumber, setPageNumber] = useState(0);
    const [courseName, setCourseName] = useState("/");


    const changeCourse = (course: string) => {
        setCourseName(course);
        
    }

    return(
        <div className="routerContainer">
            <Router>
                <Switch>
                    <Route exact path="/lecshare-main">
                        <CourseEntry successMethod={changeCourse}/>
                    </Route>
                    <Route path="/lecshare-main/view">
                        <MainContainer/>
                    </Route>
                </Switch>
            </Router>
        </div>
    );
}

export default LecshareRouter;