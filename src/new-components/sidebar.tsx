import React from 'react';
import '../new-component-css/sidebar.css'
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { LecshareStore } from "../store/LecshareStore";
import MenuIcon from '@material-ui/icons/Menu';

interface SideBarProps {
    updateIndex?: (index: number) => void
    data?: any;
}

function SideBar(props: SideBarProps) {

    const GET_LECTURES = gql`
    {
        schools(code:"VIKELABS") {
        name
        description
        courses {
            name
            classes {
                term
                section
                lectures {
                    name
                }
            }
        }
        }
    }
    `;

    const changeLecture = (index) => {
        props.updateIndex(index);
    }

    const [isOpen, setIsOpen] = useState(false);
    const [listLoading, setListLoading] = useState(true);

    const { data, loading, error } = useQuery(GET_LECTURES);

    if (loading) {
        console.log("loading lecture list!")
    }

    let listitems: any;
    if (data && listLoading) {
        let lectures = props.data.lectures
        listitems = lectures.map(function (item, index) {
            return (
                <div className="lectureOption" key={index} onClick={() => changeLecture(index)}>
                    {item.name}
                </div>
            )
        })
        //setListLoading(false);

    } else {
        listitems = <div className="lectureOption">Oops, no lectures</div>
    }

    const handleExpand = () => {
        console.log(isOpen)
        setIsOpen(!isOpen);
    }

    if (!isOpen) {
        return (
            <div>
                <div className="sideBarContainerClosed">
                    <div className="topSpacer"></div>
                    <div className="expandButton" onClick={handleExpand}><MenuIcon /></div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="sideBarContainerOpen">
                    <div className="topSpacer"></div>
                    <div className="expandButton" onClick={handleExpand}><MenuIcon /></div>
                    <div className="listContainer">
                        <div className="listTitle">{props.data.subject}{props.data.code} - {props.data.term}{props.data.section}</div>
                        <span className="listCourseTitle">{props.data.name}</span>
                        <div className="courseList">
                            {listitems}
                        </div>
                    </div>

                </div>
            </div>

        )
    }

}

export default SideBar;