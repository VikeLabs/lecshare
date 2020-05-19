import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import '../new-component-css/courseentry.css'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';

const VERIFY_CODE = gql`
    query VERIFY_CODE($crsCode: String!, $clsCode: String!, $acsKey: String!) {
        protectedClass(courseCode: $crsCode classCode: $clsCode accessKey: $acsKey) {
            name
        }
    }
`;

type QueryInfoType = {
    classCode: String,
    courseCode: String,
    accessKey: String
}

interface CourseEntryProps {
    successMethod?: (queryInfo: QueryInfoType) => void
}

function CourseEntry(props: CourseEntryProps) {
    const [input, setInput] = useState("");
    const [crsCode, setCrsCode]= useState("");
    const [clsCode, setClsCode] = useState("");
    const [acsKey, setAcsKey] = useState("");
    const [invalidCode, setInvalidCode] = useState(false);
    const history = useHistory();

    const {loading, error, data, variables} = useQuery(VERIFY_CODE, {
        variables: {
            crsCode,
            clsCode,
            acsKey
        },
    })

    const parseInput = () => {
        //example input "UVIC#ECON#416-201809#A00-vikelabs-"
        var toParse = input;
        var split = toParse.split("-");

        let returnInfo: QueryInfoType = {
            classCode: split[0],
            courseCode: split[1],
            accessKey: split[2]
        };

        setCrsCode(split[0])
        setClsCode(split[1])
        setAcsKey(split[2]);
        return returnInfo;
    }

    const submitCode = () => {
        console.log(input);
        if(error) {
            setInvalidCode(true);
        } else {
            let inputInfos: QueryInfoType = {
                classCode: clsCode,
                courseCode: crsCode,
                accessKey: acsKey
            };
            console.log("success!")
            props.successMethod(inputInfos);
            history.push("/lecshare-main/view")
        }
        

        //check if code is valid

        //if valid fetch corresponding course and switch route (prop method)

        //if invalid prompt message
    }
    let warning: any;
    if(invalidCode) {
        warning = (
            <div className="invalidNotification">Invalid course code</div>
        )
    }else {
        warning = (
            <div></div>
        )
    }
    const updateCode = (event) => {
        setInput(event.target.value)
        var parsed = parseInput();
        console.log(parsed);
    }
    return(
        <div className="courseEntryContainer">
            <div className="infoTitle">Long Live the Lecture</div>
            <div className="infoText">
                Lecshare is a lecture sharing and transcription service that allows students to revisit, search, read, and deeply understand lectures.<br/>
                Spend less time trying to write everything down and more time in the lecture.
                </div>
            <div className="courseCodeEntry">   
            <input className="courseTextInput" type="text" onInput={updateCode} placeholder="Course code" name="coursename"/><br/>
            <input className="entryButton" type="submit" value="Submit" onClick={submitCode} /><br/>
            {warning}
            </div>
        </div>
    );
} 

export default CourseEntry;