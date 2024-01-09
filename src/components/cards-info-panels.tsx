import React, {Component} from "react";
import {Body1, Card, CardContent, H5, Subtitle2} from "ui-neumorphism";
import withResize from "../hocs/withResize";

class CardsInfoPanels extends Component {
    private wellcomeCard =
        <div style={{display: 'flex', alignItems: 'flex-start', paddingTop: '55px', paddingLeft: '10px'}}>
            <Card inset rounded style={{padding: '0px'}}>
                <CardContent
                    style={{paddingTop: '0px', paddingRight: '20px', paddingBottom: '0px', paddingLeft: '5px'}}>
                    <Subtitle2 secondary>Welcome to</Subtitle2>
                    <H5>Svitoch app</H5>
                    <Body1>Here you can learn more</Body1>
                </CardContent>
            </Card>
        </div>;

    render() {
        return [
            React.cloneElement(this.wellcomeCard, {key: 'wellcomeCard'})
        ]
    }
}

export default withResize(CardsInfoPanels)