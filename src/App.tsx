import {Cards, DHeader, GenerateCourse, GetCourse} from "./components";
import React, {Component} from "react";
import SearchBar from "./components/search-bar"

class App extends Component {

    componentDidMount() {
        document.title = "Svitoch";
    }

    render() {
        return (
            <div>
                <title>Svitoch</title>
                <DHeader/>
                <Cards/>
                <div
                style={{
                    marginTop: '90px'
                }}>
                    <SearchBar/>
                </div>
                {/*<div style={{*/}
                {/*    display: 'flex',*/}
                {/*    justifyContent: 'center',*/}
                {/*    alignItems: 'center',*/}
                {/*    minHeight: '20vh',*/}
                {/*}}>*/}
                {/*    <GenerateCourse/>*/}
                {/*    <GetCourse/>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default App