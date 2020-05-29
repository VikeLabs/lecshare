import React, {useEffect, useState} from 'react';
import CourseEntry from './courseEntry';
import MainContainer from './maincontainer';
import {useHistory, useLocation} from "react-router-dom";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from "react-router-dom";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const VERIFY_CODE = gql`
    query VERIFY_CODE($courseCode: String, $classCode: String, $accessKey: String) {
        protectedClass(courseCode:"UVIC#ECON#416" classCode: "201809#A00" accessKey: "vikelabs") {
            name
        }
    }
`;

type QueryInfoType = {
    classCode: String,
    courseCode: String,
    accessKey: String
}

function LecshareRouter() {

    let initInfos: QueryInfoType
    const [pageNumber, setPageNumber] = useState(0);
    const [courseName, setCourseName] = useState("/");
    const [validated, setValidated] = useState(false);
    const [queryInfo, setQueryInfo] = useState(initInfos);

    const changeCourse = (infos: QueryInfoType) => {
        setValidated(true);
        setQueryInfo(infos);
    }

    return(
        <div className="routerContainer">
            <Router basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route exact path="/">
                        <CourseEntry successMethod={changeCourse}/>
                    </Route>
                    <Route 
                        path="/view" 
                        render={({location}) => 
                            validated ? (
                                <MainContainer infos={queryInfo}/>
                            ) : (
                                <Redirect
                                    to={{
                                        pathname:"/",
                                        state: { from: location }
                                    }}
                                />
                            )}
                    />     
                </Switch>
            </Router>
        </div>
    );
}

export default LecshareRouter;