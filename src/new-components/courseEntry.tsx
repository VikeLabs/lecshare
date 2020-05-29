import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import '../new-component-css/courseentry.css'
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/react-hooks';

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
    const [checkingCode, setCheckingCode] = useState(false);
    const history = useHistory();

    const [checkCode, {loading, error, data, variables}] = useLazyQuery(VERIFY_CODE, {
        variables: {
            crsCode,
            clsCode,
            acsKey
        },
        onCompleted: () => {
            if(error) {
                setCheckingCode(false);
                setInvalidCode(true);
            } else {
                setCheckingCode(false);
                setInvalidCode(false);
                let inputInfos: QueryInfoType = {
                    classCode: clsCode,
                    courseCode: crsCode,
                    accessKey: acsKey
                };
                console.log("success!")
                props.successMethod(inputInfos);
                history.push("/view")
            }
        }
    })

    const parseInput = () => {
        //example input "UVIC#ECON#416-201809#A00-vikelabs-"
        if(input==undefined) {
            return '';
        }
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

    const submitCode = (event) => {
        setInvalidCode(false);
        event.preventDefault();
        setInput(event.target.value)
        var parsed = parseInput();
        setCheckingCode(true);
        checkCode();
    }

    const updateCode = (event) => {
        setInput(event.target.value)
        if(event.target.value != undefined) {
            var parsed = parseInput();
        }
    }

    let warning: any;
    let checking: any;

    if(error && !invalidCode) {
        setInvalidCode(true);
        setCheckingCode(false);
    }

    if(!checkingCode) {
        checking = (
            <input className="entryButton" type="submit" value="Submit"/>
        )
    } else {
        checking = (
            <div>loading...</div>
        )
    }
    if(invalidCode) {
        warning = (
            <div className="invalidNotification">Invalid course code</div>
        )
    }else {
        warning = (
            <div></div>
        )
    }

    return(
        <div className="courseEntryContainer">
            <div className="infoTitle">Long Live the Lecture</div>
            <div className="infoText">
                Lecshare is a lecture sharing and transcription service that allows students to revisit, search, read, and deeply understand lectures.<br/>
                Spend less time trying to write everything down and more time in the lecture.
                </div>
            <div className="courseCodeEntry">   
            <form onSubmit={submitCode}>
                <input className="courseTextInput" type="text" onInput={updateCode} placeholder="Course code" name="coursename"/><br/>
                {checking}<br/>
            </form>
            {warning}
            </div>
        </div>
    );
} 

export default CourseEntry;