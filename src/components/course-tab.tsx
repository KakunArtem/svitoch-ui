import React, {Component} from "react";
import withResize from "../hocs/withResize";
import {Card, Divider, IconButton, Tab, TabItem, TabItems, Tabs} from "ui-neumorphism";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {nord} from 'react-syntax-highlighter/dist/esm/styles/prism';
import './markdown.css'
import Icon from '@mdi/react'
import {mdiCodeJson, mdiLanguageMarkdown, mdiClose} from '@mdi/js';
import DownloadData from "./data-downloader-rest";


class CourseTab extends Component<any, any> {
    private downloader = new DownloadData();
    private tabsArray = this.props.data ? [this.props.data.course_content.course_name].concat(Object.keys(this.props.data.course_content.content)) : [];
    private markdownText = this.props.data ? this.props.data.course_content.lessons : [];

    constructor(props) {
        super(props);
        this.state = {active: 0, hasError: false};
        this.styles = {fontSize: 'clamp(8px, 2vw, 12px)', lineHeight: '3vw', padding: '25px'};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    renderTabItems() {
        let items = []
        items.push(
            <TabItem key='course_name'>
                <div style={{lineHeight: '2', fontSize: 'me', fontStyle: 'Lato', padding: "20px"}}>
                    <h2>Great to have you here!</h2>
                    <p>We have prepared learning materials, based on your
                        request: <strong>{this.props.data.query}</strong>.</p>
                    <p>These materials were generated using the <strong>{this.props.data.llm_version}</strong> Large
                        Language Model.</p>
                    <p>You will find a lot of interesting and useful information during this course. Please,
                        explore what we've made for you.</p>
                    <br/>
                    <Divider dense elevated/>
                    <h2>Course Topics:</h2>
                    {this.markdownText.map((lesson, index) =>
                        <div key={index} style={{lineHeight: '2', fontSize: 'medium'}}>
                            <strong>Page {index + 1}: </strong>{lesson.title}</div>
                    )}
                </div>
            </TabItem>
        )

        if (this.props.data && this.props.data.course_content && this.props.data.course_content.content) {
            Object.entries(this.props.data.course_content.content).forEach(([key, value], index) => {
                if (value && value.content) {
                    items.push(
                        <TabItem key={key}>
                            <div style={this.styles}>
                                <ReactMarkdown
                                    className="markdown"
                                    children={value.content}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                                <SyntaxHighlighter style={nord} language={match[1]} PreTag="div"
                                                                   children={String(children).replace(/\n$/, '')} {...props} />
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            )
                                        }
                                    }}/>
                            </div>
                        </TabItem>
                    )
                }
            })
        }
        return items
    }

    renderTabs() {
        return this.tabsArray.map((item, index) => (
            <Tab key={index}>{index === 0 ? "Home" : `Page: ${index}`}</Tab>
        ))
    }

    render() {
        if (this.state.hasError) {
            return <h1>An error occurred. Details are logged into console.</h1>;
        }

        const {active} = this.state

        return (
            <div style={{
                display: 'flex',
                alignItems: "flex-start",
                width: '100%',
                padding: '0 10% 0px 0px'
            }}>
                <Card flat className='fill-width'
                      style={{justifyContent: 'center', alignItems: 'center', width: '90%', marginTop: '50px'}}>
                    <div className='mt-12'>
                        <Card flat className='px-4 fill-width'>
                            <Card rounded className='pa-4 mt-12'>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div>
                                        <Tabs
                                            rounded
                                            value={active}
                                            onChange={({active}) => this.setState({active})}>
                                            {this.renderTabs()}
                                        </Tabs>
                                    </div>
                                    <div style={{textAlign: 'right'}}>
                                        <IconButton size={"small"} text rounded={true} color='var(--primary)'
                                                    style={{paddingTop: "5px", marginTop: "5px", marginRight: "10px"}}
                                                    onClick={() => this.downloader.downloadData('json', this.props.uuid)}>
                                            <Icon path={mdiCodeJson} size={1}/>
                                        </IconButton>
                                        <IconButton size={"small"} text rounded={true} color='var(--primary)'
                                                    style={{paddingTop: "5px", marginTop: "5px", marginRight: "10px"}}
                                                    onClick={() => this.downloader.downloadData('md', this.props.uuid)}>
                                            <Icon path={mdiLanguageMarkdown} size={1}/>
                                        </IconButton>
                                        <IconButton size={"small"} text rounded={true} color='var(--primary)'
                                                    style={{paddingTop: "5px", marginTop: "5px", marginRight: "10px"}}
                                                    onClick={this.props.onClose}>
                                            <Icon path={mdiClose} size={1}/>
                                        </IconButton>
                                    </div>
                                </div>
                                <TabItems value={active}>
                                    {this.renderTabItems()}
                                </TabItems>
                            </Card>
                        </Card>
                    </div>
                </Card>
            </div>
        )
    }
}

export default withResize(CourseTab);