import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import '../new-component-css/courseentry.css'

interface CourseEntryProps {
    successMethod?: (course: string) => void
}
function CourseEntry(props: CourseEntryProps) {

    const history = useHistory();
    const submitCode = () => {
        props.successMethod("/courseName");
        history.push("/lecshare-main/view")

        //check if code is valid

        //if valid fetch corresponding course and switch route (prop method)

        //if invalid prompt message
    }
    return(
        <div className="courseEntryContainer">
            <div className="infoTitle">Long Live the Lecture</div>
            <div className="infoText">
                Lecshare is a lecture sharing and transcription service that allows students to revisit, search, read, and deeply understand lectures.<br/>
                Spend less time trying to write everything down and more time in the lecture.
                </div>
            <div className="courseCodeEntry">
                <form>
                    <input className="courseTextInput" type="text" placeholder="Course code" name="coursename"/><br/>
                    <input className="entryButton" type="submit" value="Submit" onClick={submitCode} />
                </form>
            </div>
        </div>
    );
} 

export default CourseEntry;