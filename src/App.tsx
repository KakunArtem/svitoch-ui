import {Cards, DHeader} from "./components";
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
            </div>
        )
    }
}

export default App