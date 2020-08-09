import { EditorPlugin } from "draft-js-plugins-editor";
import {AnchorHTMLAttributes, ComponentType, CSSProperties} from "react";

export interface LinkProps{
    title: string;
    image?: string;
    summary?: string;
    link: string;
}

export interface AnchorPluginTheme {
    link?: CSSProperties;
    input?: CSSProperties;
    inputInvalid?: CSSProperties;
}

export interface AnchorPluginConfig {
    theme?: AnchorPluginTheme;
    placeholder?: string;
    Link?: ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>;
    linkTarget?: string;
}

export type AnchorPlugin = EditorPlugin & {
    LinkButton: ComponentType<unknown>;
};
