/* eslint-disable no-continue,no-restricted-syntax */
import React, {Component, CSSProperties} from 'react';
import PropTypes from 'prop-types';
import Draft, {EditorState, Editor, DefaultDraftBlockRenderMap, DraftDecorator,} from 'draft-js';
import {Map} from 'immutable';
import proxies from './proxies';
import moveSelectionToEnd from './moveSelectionToEnd';
import resolveDecorators from './resolveDecorators';
import defaultKeyBindings from './defaultKeyBindings';
import defaultKeyCommands from './defaultKeyCommands';
import {DraftEditorProps} from '../interfaces';


const getDecoratorLength = (obj: any) => {
  let decorators;

  if (obj.decorators != null) {
    decorators = obj.decorators;
  } else if (obj._decorators != null) {
    decorators = obj._decorators;
  }

  return decorators.size != null ? decorators.size : decorators.length;
};

interface Plugin {
  customStyleMap: { [name: string]: CSSProperties }

  initialize(functions: any): void;

  onChange(editorState: EditorState, functions: any): EditorState;

  willUnmount(functions: any): void;

  decorators: DraftDecorator[];

  getAccessibilityProps(): { ariaHasPopup: string, ariaExpanded: any }
}

interface Props extends DraftEditorProps {
  onChange: any;
  plugins: Plugin[];
  defaultBlockRenderMap: boolean,
  defaultKeyBindings: boolean,
  defaultKeyCommands: boolean,
}

interface State {
  readOnly: boolean
}

/**
 * The main editor component
 */
export class PluginEditor extends Component<Props, State> {
  // static propTypes = {
  //   editorState: PropTypes.object.isRequired,
  //   onChange: PropTypes.func.isRequired,
  //   plugins: PropTypes.array,
  //   defaultKeyBindings: PropTypes.bool,
  //   defaultKeyCommands: PropTypes.bool,
  //   defaultBlockRenderMap: PropTypes.bool,
  //   customStyleMap: PropTypes.object,
  //   // eslint-disable-next-line react/no-unused-prop-types
  //   decorators: PropTypes.array,
  // };

  static defaultProps = {
    defaultBlockRenderMap: true,
    defaultKeyBindings: true,
    defaultKeyCommands: true,
    customStyleMap: {},
    plugins: [],
    decorators: [],
  };

  private editor: any;

  constructor(props: Props) {
    super(props);

    // @ts-ignore
    const plugins: Plugin[] = [this.props, ...this.resolvePlugins()];
    plugins.forEach(plugin => {
      if (typeof plugin.initialize !== 'function') return;
      plugin.initialize(this.getPluginMethods());
    });

    // attach proxy methods like `focus` or `blur`
    proxies.forEach(method => {
      // @ts-ignore
      this[method] = (...args) => this.editor[method](...args);
    });

    this.state = {
      readOnly: props.readOnly ?? false
    };
  }

  UNSAFE_componentWillMount() {
    const decorator = resolveDecorators(
      this.props,
      this.getEditorState,
      this.onChange
    );

    const editorState = EditorState.set(this.props.editorState, {decorator});
    this.onChange(moveSelectionToEnd(editorState));
  }

  UNSAFE_componentWillReceiveProps(next: Props) {
    const curr = this.props;
    const currDec = curr.editorState.getDecorator();
    const nextDec = next.editorState.getDecorator();

    // If there is not current decorator, there's nothing to carry over to the next editor state
    if (!currDec) return;
    // If the current decorator is the same as the new one, don't call onChange to avoid infinite loops
    if (currDec === nextDec) return;
    // If the old and the new decorator are the same, but no the same object, also don't call onChange to avoid infinite loops
    if (
      currDec &&
      nextDec &&
      getDecoratorLength(currDec) === getDecoratorLength(nextDec)
    )
      return;

    const editorState = EditorState.set(next.editorState, {
      decorator: currDec,
    });
    this.onChange(moveSelectionToEnd(editorState));
  }

  componentWillUnmount() {
    this.resolvePlugins().forEach((plugin: any) => {
      if (plugin.willUnmount) {
        plugin.willUnmount({
          getEditorState: this.getEditorState,
          setEditorState: this.onChange,
        });
      }
    });
  }

  // Cycle through the plugins, changing the editor state with what the plugins
  // changed (or didn't)
  onChange = (editorState: EditorState) => {
    let newEditorState = editorState;
    this.resolvePlugins().forEach((plugin) => {
      if (plugin.onChange) {
        newEditorState = plugin.onChange(
          newEditorState,
          this.getPluginMethods()
        );
      }
    });

    if (this.props.onChange) {
      this.props.onChange(newEditorState, this.getPluginMethods());
    }
  };

  getPlugins = () => this.props.plugins.slice(0);
  getProps = () => ({...this.props});

  // TODO further down in render we use readOnly={this.props.readOnly || this.state.readOnly}. Ask Ben why readOnly is here just from the props? Why would plugins use this instead of just taking it from getProps?
  getReadOnly = () => this.props.readOnly;
  setReadOnly = (readOnly: boolean) => {
    if (readOnly !== this.state.readOnly) this.setState({readOnly});
  };

  getEditorRef = () => this.editor;

  getEditorState = () => this.props.editorState;

  getPluginMethods = () => ({
    getPlugins: this.getPlugins,
    getProps: this.getProps,
    setEditorState: this.onChange,
    getEditorState: this.getEditorState,
    getReadOnly: this.getReadOnly,
    setReadOnly: this.setReadOnly,
    getEditorRef: this.getEditorRef,
  });

  createEventHooks = (methodName: string, plugins: ((Readonly<Props> & Readonly<{ children?: React.ReactNode }>) | Plugin)[]) => (...args: any[]) => {
    const newArgs = [].slice.apply(args);
    // @ts-ignore
    newArgs.push(this.getPluginMethods());


    return plugins.some(
      plugin =>
        // @ts-ignore
        typeof plugin[methodName] === 'function' &&
        // @ts-ignore
        plugin[methodName](...newArgs) === true
    );
  };

  createHandleHooks = (methodName: string, plugins: any[]) => (...args: any[]) => {
    const newArgs = [].slice.apply(args);
    // @ts-ignore
    newArgs.push(this.getPluginMethods());

    return plugins.some(
      plugin =>
        typeof plugin[methodName] === 'function' &&
        plugin[methodName](...newArgs) === 'handled'
    )
      ? 'handled'
      : 'not-handled';
  };

  createFnHooks = (methodName: string, plugins: any[]) => (...args: any[]) => {
    const newArgs = [].slice.apply(args);

    // @ts-ignore
    newArgs.push(this.getPluginMethods());

    if (methodName === 'blockRendererFn') {
      let block: any = {props: {}};
      plugins.forEach(plugin => {
        if (typeof plugin[methodName] !== 'function') return;
        const result = plugin[methodName](...newArgs);
        if (result !== undefined && result !== null) {
          const {props: pluginProps, ...pluginRest} = result; // eslint-disable-line no-use-before-define
          const {props, ...rest} = block; // eslint-disable-line no-use-before-define
          block = {
            ...rest,
            ...pluginRest,
            props: {...props, ...pluginProps},
          };
        }
      });

      return block.component ? block : false;
    } else if (methodName === 'blockStyleFn') {
      let styles: string | undefined;
      plugins.forEach(plugin => {
        if (typeof plugin[methodName] !== 'function') return;
        const result = plugin[methodName](...newArgs);
        if (result !== undefined && result !== null) {
          styles = (styles ? `${styles} ` : '') + result;
        }
      });

      return styles || '';
    }

    let result;
    const wasHandled = plugins.some(plugin => {
      if (typeof plugin[methodName] !== 'function') return false;
      result = plugin[methodName](...newArgs);
      return result !== undefined;
    });
    return wasHandled ? result : false;
  };

  createPluginHooks = () => {
    const pluginHooks: { [name: string]: any } = {};
    const eventHookKeys: string[] = [];
    const handleHookKeys: string[] = [];
    const fnHookKeys: string[] = [];
    const plugins = [this.props, ...this.resolvePlugins()];

    plugins.forEach(plugin => {
      Object.keys(plugin).forEach(attrName => {
        if (attrName === 'onChange') return;

        // if `attrName` has been added as a hook key already, ignore this one
        if (
          eventHookKeys.indexOf(attrName) !== -1 ||
          fnHookKeys.indexOf(attrName) !== -1
        )
          return;

        const isEventHookKey = attrName.indexOf('on') === 0;
        if (isEventHookKey) {
          eventHookKeys.push(attrName);
          return;
        }

        const isHandleHookKey = attrName.indexOf('handle') === 0;
        if (isHandleHookKey) {
          handleHookKeys.push(attrName);
          return;
        }

        // checks if `attrName` ends with 'Fn'
        const isFnHookKey = attrName.length - 2 === attrName.indexOf('Fn');
        if (isFnHookKey) {
          fnHookKeys.push(attrName);
        }
      });
    });

    eventHookKeys.forEach(attrName => {
      pluginHooks[attrName] = this.createEventHooks(attrName, plugins);
    });

    handleHookKeys.forEach(attrName => {
      pluginHooks[attrName] = this.createHandleHooks(attrName, plugins);
    });

    fnHookKeys.forEach(attrName => {
      pluginHooks[attrName] = this.createFnHooks(attrName, plugins);
    });

    return pluginHooks;
  };

  resolvePlugins = () => {
    const plugins: Plugin[] = this.props.plugins.slice(0);
    if (this.props.defaultKeyBindings) {
      //@ts-ignore
      plugins.push(defaultKeyBindings);
    }
    if (this.props.defaultKeyCommands) {
      //@ts-ignore
      plugins.push(defaultKeyCommands);
    }

    return plugins;
  };


  resolveCustomStyleMap = () =>
    // @ts-ignore
    this.props.plugins
      .filter((plug) => plug.customStyleMap !== undefined)
      .map(plug => plug.customStyleMap)
      .concat([this.props.customStyleMap])
      .reduce(
        (styles: { [name: string]: React.CSSProperties; }, style: { [name: string]: React.CSSProperties; }) => ({
          ...styles,
          ...style,
        }),
        {}
      );

  resolveBlockRenderMap = () => {
    let blockRenderMap = this.props.plugins
      .filter((plug: any) => plug.blockRenderMap !== undefined)
      .reduce((maps: any, plug: any) => maps.merge(plug.blockRenderMap), Map({}));
    if (this.props.defaultBlockRenderMap) {
      blockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);
    }
    if (this.props.blockRenderMap) {
      blockRenderMap = blockRenderMap.merge(this.props.blockRenderMap);
    }
    return blockRenderMap;
  };

  resolveAccessibilityProps = () => {
    let accessibilityProps: any = {};
    //@ts-ignore
    const plugins: Plugin[] = [this.props, ...this.resolvePlugins()];
    plugins.forEach(plugin => {

      if (typeof plugin.getAccessibilityProps !== 'function') return;
      const props = plugin.getAccessibilityProps();
      const popupProps: any = {};

      if (accessibilityProps.ariaHasPopup === undefined) {
        popupProps.ariaHasPopup = props.ariaHasPopup;
      } else if (props.ariaHasPopup === 'true') {
        popupProps.ariaHasPopup = 'true';
      }

      if (accessibilityProps.ariaExpanded === undefined) {
        popupProps.ariaExpanded = props.ariaExpanded;
      } else if (props.ariaExpanded === true) {
        popupProps.ariaExpanded = true;
      }

      accessibilityProps = {
        ...accessibilityProps,
        ...props,
        ...popupProps,
      };
    });

    return accessibilityProps;
  };

  render() {
    const pluginHooks = this.createPluginHooks();
    const customStyleMap = this.resolveCustomStyleMap();
    const accessibilityProps = this.resolveAccessibilityProps();
    const blockRenderMap = this.resolveBlockRenderMap();
    return (
      <Editor
        {...this.props}
        {...accessibilityProps}
        {...pluginHooks}
        readOnly={this.props.readOnly || this.state.readOnly}
        customStyleMap={customStyleMap}
        blockRenderMap={blockRenderMap}
        onChange={this.onChange}
        editorState={this.props.editorState}
        ref={element => {
          this.editor = element;
        }}
      />
    );
  }
}
