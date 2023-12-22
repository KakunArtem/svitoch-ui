import React, {Component} from 'react';
import {Button, Tooltip} from 'ui-neumorphism';
import 'ui-neumorphism/dist/index.css';
import withResize from "../hocs/withResize";
import {BuildCourseTab} from "./index";

class GenerateCourseButton extends Component {
    state = {
        showBuildCourse: false
    };

    handleButtonClick = () => {
        this.setState(prevState => ({
            showBuildCourse: !prevState.showBuildCourse
        }));
    };

    handleClickOutside = (event) => {
        if (this.container && !this.container.contains(event.target)) {
            this.setState({
                showBuildCourse: false
            });
        }
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    };

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    };

    render() {
        return (
            <div ref={node => this.container = node} style={{margin: '0 20px', position: 'relative'}}>
                <Button rounded={true}
                        onClick={this.handleButtonClick}
                        style={{width: '220px', height: '50px', fontSize: '20px'}}>
                    Create
                </Button>

                {this.state.showBuildCourse &&
                    <div style={{position: 'absolute', top: '60px', right: '80px', width: '100%'}}>
                        <BuildCourseTab style={this.styles}/>
                    </div>
                }
            </div>
        );
    }
}

export default withResize(GenerateCourseButton);