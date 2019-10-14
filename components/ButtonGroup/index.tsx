import React, { Component } from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { ButtonProps } from '../Button';

const styles = StyleSheet.create({
  default: {
    display: 'flex',
    flexDirection: 'row',
  }
});

export interface ButtonGroupProps extends ViewProps, ButtonProps {
  /**
   * 按钮间隔间距
   */
  gutter?: number;
}

export default class ButtonGroup extends Component<ButtonGroupProps> {
  static defaultProps: ButtonGroupProps = {
    bordered: true,
  }
  render() {
    const { style, children, gutter, color, textStyle, size, type, rounded, bordered, disabled, loading, ...otherProps } = this.props;
    const porps = { color, type, bordered, disabled, textStyle };
    const childs = React.Children.toArray(children);
    return (
      <View style={[styles.default, style]} {...otherProps}>
        {childs.map((child: React.ReactNode, idx: number) => {
          if (!React.isValidElement(child)) return null;
          const childStyle: ButtonProps['style'] = { flex: 1 };
          if (!gutter) {
            if (childs.length !== 1 && (idx === 0 || idx < childs.length - 1)) {
              childStyle.borderTopRightRadius = 0;
              childStyle.borderBottomRightRadius = 0;
            }
            if (childs.length > 0 && idx !== 0) {
              childStyle.borderTopLeftRadius = 0;
              childStyle.borderBottomLeftRadius = 0;
            }
          }
          if (!bordered) {
            childStyle.borderWidth = 0;
          }
          if (bordered && !gutter) {
            if ((idx > 0 && idx < (children as ButtonProps[]).length - 1) || idx === 0) {
              childStyle.borderRightWidth = StyleSheet.hairlineWidth;
            }
            if (idx > 0 && idx < (children as ButtonProps[]).length) {
              childStyle.borderLeftWidth = StyleSheet.hairlineWidth;
            }
          }
          if (gutter) {
            childStyle.marginLeft = gutter;
          }
          return React.cloneElement(child, { ...porps, ...child.props, size, rounded, style: [childStyle, child.props.style] });
        })}
      </View>
    );
  }
}

