import React, {Component} from 'react';
import {Button, Tooltip, TextField, Alert} from 'ui-neumorphism';
import 'ui-neumorphism/dist/index.css';
import withResize from '../hocs/withResize';
import DownloadData from "./data-downloader-rest";
import CourseTab from "./course-tab";

class GetCourseButton extends Component<any, any> {
    private readonly formRef = {};
    private downloader = new DownloadData();

    constructor(props) {
        super(props);
        this.state = {
            isFormVisible: false,
            inputValue: '',
            showAlert: false,
            courseData: '',
            showCourseTab: false
        };

        this.formRef = React.createRef();
        this.handleFormShow = this.handleFormShow.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFormShow() {
        this.setState({isFormVisible: true});
    }

    handleInputChange(event) {
        this.setState({inputValue: event.value});
    }

    handleSubmit = async () => {
        try {
            const courseData = await this.downloader.getCourseData(this.state.inputValue);
            if (courseData === "Course not found" || courseData === "Course generation is in progress") {
                this.setState({courseData: courseData, showAlert: true});
            } else {
                this.setState({courseData: courseData, showAlert: false});
            }
            this.setState({uuid: this.state.inputValue})
            this.setState({isFormVisible: false, inputValue: ''});
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    handleBlur = () => {
        this.setState({showInput: false});
    }

    componentDidMount() {
        window.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        window.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.state.isFormVisible && this.formRef && !this.formRef.current.contains(event.target)) {
            this.setState({
                isFormVisible: false
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.courseData !== this.state.courseData) {
            if (this.state.courseData === "Course not found") {
                this.setState({showAlert: true, alertMessage: "Course not found", showCourseTab: false});
            } else if (this.state.courseData === "Course generation is in progress") {
                this.setState({
                    showAlert: true,
                    alertMessage: "Course generation is in progress",
                    showCourseTab: false
                });
            } else {
                this.setState({showCourseTab: true});
            }
        }
    }

    closeCourseTab = () => this.setState({showCourseTab: false});

    handleClose = () => {
        this.setState({showAlert: false});
    }

    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative'
                }}>

                {this.state.showAlert && (
                    <Alert
                        style={{alignSelf: 'center', position: 'absolute', top: '-70px', zIndex: 1}}
                        rounded={true}
                        show={this.state.showAlert}
                        closable={true}
                        onClose={() => {
                            this.setState({showAlert: false})
                        }}>
                        {this.state.alertMessage}
                    </Alert>
                )}

                <Button
                    rounded={true}
                    style={{width: '220px', height: '50px', fontSize: '20px'}}
                    onClick={this.handleFormShow}>
                    Learn
                </Button>

                {this.state.isFormVisible && (
                    <div
                        ref={this.formRef}
                        style={{
                            position: 'absolute',
                            top: '70px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <TextField
                            type="text"
                            className='my-3'
                            value={this.state.inputValue}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}/>
                        <Button
                            style={{marginTop: '-10px'}}
                            rounded={true}
                            onClick={this.handleSubmit}>Submit
                        </Button>
                    </div>
                )}

                {this.state.showCourseTab && (
                    <div
                        style={{
                            position: 'absolute',
                            top: this.state.isFormVisible ? '140px' : '50px',
                            width: '108vw',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                        <CourseTab uuid={this.state.uuid} data={this.state.courseData} onClose={this.closeCourseTab}/>
                    </div>
                )}

            </div>
        );
    }
}

export default withResize(GetCourseButton);