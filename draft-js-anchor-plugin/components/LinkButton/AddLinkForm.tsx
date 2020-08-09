import React, {Component} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
// @ts-ignore
import EditorUtils from 'draft-js-plugins-utils';

import URLUtils from '../../utils/URLUtils';
import Axios from "axios";
import {LinkProps} from "../../utils/interfaces";
import {Collapse, CircularProgress, LinearProgress} from '@material-ui/core';


interface State {
    value: string,
    isInvalid: boolean,
    isLoading: boolean,
}

interface Props {
    getEditorState: any,
    setEditorState: any,
    theme: any,
    placeholder: string
}

export default class AddLinkForm extends Component<Props, State> {
    input?: HTMLInputElement

    constructor(props: Props) {
        super(props);
        this.state = {
            value: '',
            isInvalid: false,
            isLoading: false,
        };
    }

    static propTypes = {
        getEditorState: PropTypes.func.isRequired,
        setEditorState: PropTypes.func.isRequired,
        onOverrideContent: PropTypes.func.isRequired,
        theme: PropTypes.object.isRequired,
        placeholder: PropTypes.string,
    };

    static defaultProps = {
        placeholder: 'Enter a URL and press enter',
    };


    componentDidMount() {
        this.input?.focus();
    }

    onRef = (node: any) => {
        this.input = node;
    };

    // @ts-ignore
    onChange = ({target: {value}}) => {
        const nextState = {value};
        if (this.state.isInvalid && URLUtils.isUrl(URLUtils.normalizeUrl(value))) {
            // @ts-ignore
            nextState.isInvalid = false;
        }
        this.setState(nextState);
    };

    // @ts-ignore
    onClose = () => this.props.onOverrideContent(undefined);

    onKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.submit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            this.onClose();
        }
    };

    async submit() {
        const {getEditorState, setEditorState} = this.props;
        this.setState({isLoading: true})
        let {value: url} = this.state;
        if (!URLUtils.isMail(URLUtils.normaliseMail(url))) {
            url = URLUtils.normalizeUrl(url);
            if (!URLUtils.isUrl(url)) {
                this.setState({isInvalid: true});
                return;
            }
        } else {
            url = URLUtils.normaliseMail(url);
        }
        // get link's detail
        let data: LinkProps = {
            link: url,
            title: ""
        };
        try {
            let result = await Axios.get(url)
            let parser = new DOMParser();
            let htmlDoc = parser.parseFromString(result.data, "text/html");
            let title = htmlDoc.querySelector("title");
            let image = htmlDoc.querySelector("img");
            let summary = htmlDoc.querySelector("p")

            data = {
                link: url,
                title: title?.innerText ?? "No title",
                image: image?.src,
                summary: summary?.innerText,
            }
        } catch (err) {

        } finally {
            this.setState({isLoading: false})
        }
        setEditorState(EditorUtils.createLinkAtSelection(getEditorState(), data));
        this.input?.blur();
        this.onClose();
    }

    render() {
        const {theme, placeholder} = this.props;
        const {value, isInvalid, isLoading} = this.state;
        const className = isInvalid
            ? clsx(theme.input, theme.inputInvalid)
            : theme.input;

        return (
            <div>
                <input
                    onBlur={this.onClose}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    placeholder={placeholder}
                    style={className}
                    ref={this.onRef}
                    type="text"
                    value={value}
                />
                <Collapse in={isLoading}>
                    <LinearProgress style={{marginTop: 4, width: "100%"}}/>
                </Collapse>
            </div>

        );
    }
}
