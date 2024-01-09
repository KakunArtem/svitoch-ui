import React, {Component} from "react";
import {Divider} from 'ui-neumorphism'
import withResize from "../hocs/withResize";

class DHeader extends Component {
    render() {
        return [
            <div key="headerDiv"
                 style={{
                     top: '10',
                     zIndex: '100',
                     width: '100%',
                     transform: 'translate(0px, 40px)'
                 }}>
                <Divider/>
            </div>
        ]
    }
}

export default withResize(DHeader);