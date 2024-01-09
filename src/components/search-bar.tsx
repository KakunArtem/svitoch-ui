import React, {Component} from 'react';
import {TextField, Button, Alert, Fab} from 'ui-neumorphism';
import CourseTab from "./course-tab";
import Icon from '@mdi/react';
import {mdiMagnify} from '@mdi/js';
import {GenerateCourse, GetCourse} from "./index";
import {Urls} from "../configs/config-urls";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.selectRef = React.createRef();
        this.state = {
            course_name: '',
            courseList: [],
            loaded: false,
            showAlert: false,
            courseData: '',
            showCourseTab: false,
            uuid: '',
            alertMessage: '',
            isClickedOutside: false
        };
    }

    componentDidMount() {
        window.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.selectRef.current && !this.selectRef.current.contains(event.target)) {
            this.setState({isClickedOutside: true, loaded: false});
        }
    }

    handleInputChange = (event) => {
        this.setState({course_name: event.value, isClickedOutside: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.state.course_name.trim() === "") {
            this.setState({
                showAlert: true,
                alertMessage: "Please enter a course name",
                showCourseTab: false
            });
            return;
        }

        this.setState({loaded: false, isClickedOutside: false}, () => {
            fetch(`${Urls.baseUrl}/v1/courses/name/${this.state.course_name}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) {
                        this.setState({
                            showAlert: true,
                            alertMessage: "Course not found",
                            showCourseTab: false
                        });
                    } else {
                        this.setState({courseList: data, loaded: true}, () => {
                            if (data.length === 1) {
                                this.handleCourseData(data[0].course_uuid);
                            }
                        })
                    }
                });
        });
    }

    handleCourseData = async (uuid) => {
        try {
            const response = await fetch(`${Urls.baseUrl}/v1/courses/uuid/${uuid}`);
            const courseData = await response.json();
            this.setState({courseData: courseData, showAlert: false, showCourseTab: true, uuid: uuid});
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    handleChange = (event) => {
        this.handleCourseData(event.target.value);
    };

    closeCourseTab = () => this.setState({showCourseTab: false});

    handleCloseAlert = () => {
        this.setState({showAlert: false});
    }

    render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                flexDirection: 'column'
            }}>
                {this.state.showAlert && (
                    <Alert
                        style={{
                            alignSelf: 'center', position: 'absolute', zIndex: 1, marginTop: '-300px',
                        }}
                        inset={true}
                        show={this.state.showAlert}
                        closable={true}
                        onClose={this.handleCloseAlert}>
                        {this.state.alertMessage}
                    </Alert>
                )}

                <form onSubmit={this.handleSubmit}
                      style={{display: "flex", flexDirection: "row", gap: "0.5rem", alignItems: "center"}}>
                    <TextField
                        rounded={true}
                        width={500}
                        label='Search'
                        value={this.state.course_name}
                        onChange={this.handleInputChange}
                    />
                    {!this.state.loaded &&
                        <Fab type="submit" style={{marginLeft: '-18px', marginTop: '-20px'}}>
                            <Icon path={mdiMagnify} size={1}/>
                        </Fab>
                    }
                </form>
                {this.state.loaded && !this.state.isClickedOutside && !this.state.showCourseTab &&
                    <select ref={this.selectRef}
                            style={{
                                boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
                                borderWidth: 0,
                                borderRadius: '15px',
                                padding: '10px 20px',
                                outline: 'none',
                                backgroundColor: '#efefef',
                                color: '#333',
                                fontSize: '14px',
                                fontFamily: 'sans-serif',
                                appearance: 'none',
                            }}
                            onChange={this.handleChange}>
                        {this.state.courseList.map((course, i) =>
                            <option key={i} value={course.course_uuid}>
                                {`Name: ${course.course_name} ID: ${course.course_uuid}`}
                            </option>
                        )}
                    </select>
                }
                {this.state.showCourseTab && (
                    <div
                        style={{
                            top: this.state.isFormVisible ? '140px' : '50px',
                            width: '108vw',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'absolute',
                            marginLeft: '310px',
                        }}>
                        <CourseTab uuid={this.state.uuid} data={this.state.courseData} onClose={this.closeCourseTab}/>
                    </div>
                )}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '20vh',
                }}>
                    {!this.state.showCourseTab && (
                        <>
                            <GenerateCourse/>
                            <GetCourse/>
                        </>
                    )}
                </div>
            </div>
        );
    }
}

export default SearchBar;