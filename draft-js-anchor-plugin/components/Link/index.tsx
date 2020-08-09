import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import {Theme, Typography, withStyles} from "@material-ui/core";
import {LinkProps} from "../../utils/interfaces";
import {defaultTheme} from "../../theme";

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    entityKey: PropTypes.string,
    getEditorState: PropTypes.func.isRequired,
};

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        width: 300,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

//@ts-ignore
const Link = ({children, className, entityKey, getEditorState, target}) => {
    const entity = getEditorState()
        .getCurrentContent()
        .getEntity(entityKey);
    const entityData: LinkProps | undefined = entity ? entity.get('data')?.url : undefined;
    return (
        <HtmlTooltip title={<React.Fragment>
            <Typography variant="h6">{entityData?.title ?? "No data"}</Typography>
            {entityData?.image && <img src={entityData?.image} alt={""} height={200} crossOrigin={"anonymous"}/>}
            <Typography>{entityData?.summary}</Typography>
            <span>{entityData?.link}</span>
        </React.Fragment>}>
            <a
                style={defaultTheme.link}
                href={entityData?.link}
                target={target}
                rel="noopener noreferrer"
            >
                {children}
            </a>
        </HtmlTooltip>
    );
};

Link.propTypes = propTypes;
export default Link;
