import React, {Component} from "react";
import withResize from "../hocs/withResize";
import {Radio, RadioGroup} from "ui-neumorphism";

class ChooseAction extends Component<any, any> {
    render() {
        return (
            <RadioGroup vertical value='1' color='var(--primary)' onChange={this.onChange}>
                <Radio value='1' label='New course' />
                <Radio value='2' label='Existing one' />
            </RadioGroup>
        )
    }
}


export default withResize(ChooseAction)