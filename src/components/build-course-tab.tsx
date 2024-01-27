import React, {Component} from 'react';
import {Alert, Button, Card, Divider, IconButton, Switch, TextField} from 'ui-neumorphism';
import withResize from "../hocs/withResize";
import Icon from "@mdi/react";
import {mdiClose} from "@mdi/js";
import {Urls} from "../configs/config-urls";

class BuildCourseTab extends Component {

    state = {
        courseName: '',
        lessons: [],
        language: '',
        endpoint: 'base_lessons',
        isSubmitted: false,
        alertMessage: '',
        showAlert: false,
    }

    handleChange = (event) => {
        if (!this.state.isSubmitted) {
            this.setState({courseName: event.value});
        }
    }

    handleLanguageChange = (event) => {
        if (!this.state.isSubmitted) {
            this.setState({language: event.value});
        }
    }

    handleSwitchChange = (event) => {
        this.setState({
            endpoint: event.checked ? "advance_lessons" : "base_lessons"
        });
    };

    handleSubmit = () => {
        let {courseName, lessons, endpoint} = this.state;
        let finalData

        if (lessons.length === 0) {
            // If array is empty
            finalData = {
                "text": courseName
            };
            endpoint = (endpoint === 'base_lessons') ? 'base_course' : 'advance_course'
            this.sendData(`${Urls.baseUrl}/v1/courses/${endpoint}`, finalData, true);
        } else {
            // If array is not empty
            let finalLessons = lessons.map(lesson => ({
                title: lesson.title,
                topics: typeof lesson.topics === "string" ? lesson.topics.split(",") : lesson.topics
            }));

            finalData = {
                course_content: {
                    course_name: courseName,
                    lessons: finalLessons
                }
            };

            if (this.state.language) {
                finalData.language = this.state.language;
            }

            this.sendData(`${Urls.baseUrl}/v1/lessons/${endpoint}`, finalData, false);
        }

        this.setState({lessons: [], courseName: '', isSubmitted: true});
    };

    sendData = (url, data) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                this.setState({alertMessage: `Your course UUID: ${data['response']['course_uuid']}`, showAlert: true});
            })
            .catch((error) => {
                console.error('Error:', error);
                this.setState({alertMessage: 'Error!', showAlert: true});
            });
    };

    addLesson = () => {
        this.setState(prevState => {
            return {
                lessons: [...prevState.lessons, {id: new Date().getTime(), title: '', topics: ''}],
            }
        });
    }

    deleteLesson = (index) => {
        this.setState(prevState => {
            let lessons = [...prevState.lessons];
            lessons.splice(index, 1);
            return {lessons};
        });
    }

    handleLessonChange = (event, index, field) => {
        if (!this.state.isSubmitted) {
            let lessons = [...this.state.lessons];
            lessons[index][field] = event.value;
            this.setState({lessons});
        }
    }

    render() {
        return (
            <>
                <div style={{position: 'relative'}}>
                    {this.state.showAlert &&
                        <div style={{
                            position: 'fixed',
                            top: '60%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            display: 'inline-block',
                            maxWidth: '80%', // to prevent overflowing on small screens
                        }}>
                            <Alert rounded={true} closable={true}
                                   color={this.state.alertMessage !== 'Error!' ? 'green' : 'red'}
                                   dismissible
                                   onClose={() => this.setState({showAlert: false})}
                                   border='left'>
                                {this.state.alertMessage}
                            </Alert>
                        </div>
                    }
                    {
                        this.state.isSubmitted ? "" :
                            <Card rounded={true} raised width={600}
                                  style={{
                                      marginLeft: "10px",
                                      marginRight: "2px",
                                      marginTop: "10px",
                                      padding: "10px",
                                      overflow: 'auto'
                                  }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <TextField
                                        rounded={true}
                                        style={{
                                            marginLeft: "14px",
                                            marginRight: "2px",
                                            marginTop: "10px",
                                            padding: "10px",
                                            overflow: 'auto'
                                        }}
                                        label="Course Name"
                                        value={this.state.courseName.toString()}
                                        onChange={this.handleChange}
                                    />
                                    <TextField
                                        rounded={true}
                                        style={{
                                            marginLeft: "14px",
                                            marginRight: "2px",
                                            marginTop: "10px",
                                            padding: "10px",
                                            overflow: 'auto'
                                        }}
                                        width={120}
                                        label="Language"
                                        value={this.state.language.toString()}
                                        onChange={this.handleLanguageChange}
                                    />
                                    <Switch color='var(--primary)' label={"GPT 3/4"}
                                            onChange={this.handleSwitchChange}/>
                                </div>
                                <Divider dense/>
                                {
                                    this.state.lessons.map((lesson, index) => (
                                        <Card flat={true} rounded={true}
                                              key={`lesson-${lesson.id}`}
                                              width={280}
                                              height={120}
                                              style={{
                                                  marginLeft: "10px",
                                                  marginRight: "2px",
                                                  marginTop: "2px",
                                                  padding: "2px",
                                                  margin: "10px"
                                              }}>
                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                <div>
                                                    <TextField
                                                        rounded={true}
                                                        label="Lesson"
                                                        value={lesson.title.toString()}
                                                        onChange={(value) => this.handleLessonChange(value, index, "title")}
                                                    />
                                                    <TextField
                                                        rounded={true}
                                                        label="Topics"
                                                        value={lesson.topics.toString()}
                                                        onChange={(value) => this.handleLessonChange(value, index, "topics")}

                                                    />
                                                </div>
                                                <IconButton rounded={true} size={"small"}
                                                            onClick={() => this.deleteLesson(index)}
                                                            bgcolor='#ccc'
                                                            style={{
                                                                marginLeft: "5px",
                                                                marginRight: "5px",
                                                                marginTop: "8px"
                                                            }}>
                                                    <Icon path={mdiClose} size={1}/>
                                                </IconButton>
                                            </div>
                                        </Card>
                                    ))
                                }
                                <Button rounded={true} size={"small"} onClick={this.addLesson} bgcolor='#ccc'
                                        style={{marginLeft: "23px", marginRight: "2px", marginTop: "10px"}}>
                                    + Lesson
                                </Button>
                                <Button rounded={true} size={"small"} onClick={this.handleSubmit} bgcolor='#ccc'
                                        style={{marginLeft: "23px", marginRight: "2px", marginTop: "10px"}}>
                                    Submit
                                </Button>
                            </Card>
                    }
                </div>
            </>
        )
    }
}

export default withResize(BuildCourseTab);