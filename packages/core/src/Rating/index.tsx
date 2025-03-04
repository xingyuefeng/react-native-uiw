import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, StyleProp, TextStyle } from 'react-native';

import Icon, { IconsName } from '../Icon';
import { TabsItemIconTypes } from '../Tabs/TabsItem';

export type icoType = [TabsItemIconTypes, TabsItemIconTypes];
export interface RatingProps {
  /**  默认选中几个 */
  defaultRating?: number;
  /** 总数*/
  resultRating?: number;
  /** icon 大小 */
  size?: number;
  /** icon 颜色 */
  color?: string;
  /** actived 激活 unactived 未激活 */
  icon?: {
    actived?: TabsItemIconTypes;
    unactived?: TabsItemIconTypes;
  };
  /**
   * void
   * @param score type: number 得到几分
   */
  onPress?: (score: number) => void;
  /** 自定义每项的提示信息 */
  tooltips?: string[];
  /** 自定义提示信息样式 */
  tooltipsStyle?: StyleProp<TextStyle>;
  /** 只读模式 */
  disabled: boolean;
}

export interface RatingState {
  icon: Array<IconsName | React.ReactElement | React.ReactNode>;
  resultRating: number;
  size: number;
  color: string;
  defaultRating: number;
  typeIcon: icoType;
  tooltips?: string[];
  tooltipsText?: string;
  disabled: boolean;
}

export default class Rating extends React.Component<RatingProps, RatingState> {
  constructor(props: RatingProps) {
    super(props);
    let start = (props.icon && props.icon.unactived) || 'star-off';
    let end = (props.icon && props.icon.actived) || 'star-on';

    this.state = {
      defaultRating: props.defaultRating || 0,
      resultRating: props.resultRating || 5,
      icon: [],
      size: props.size ?? 24,
      color: props.color || '#ebc445',
      typeIcon: [start, end],
      tooltips: props.tooltips,
      tooltipsText: '',
      disabled: false,
    };
  }
  componentDidMount() {
    const { defaultRating } = this.state;
    this.updateIcon(defaultRating);
  }

  flag = true;
  updateIcon = (index: number) => {
    const { resultRating } = this.state;
    const { onPress, disabled } = this.props;
    let start = this.state.typeIcon[0];
    let end = this.state.typeIcon[1];
    if (disabled) {
      this.setState({ disabled: disabled });
    }
    if (index === 1 && this.flag) {
      this.setState({ icon: [...new Array(index).fill(end), ...new Array(resultRating - index).fill(start)] });
      onPress?.(1);
      if (this.state.tooltips) {
        this.setState({ tooltipsText: this.state.tooltips[index] });
      }
      this.flag = false;
    } else if (index === 1 && !this.flag) {
      this.setState({ icon: [...new Array(index - 1).fill(end), ...new Array(resultRating - index + 1).fill(start)] });
      if (this.state.tooltips) {
        this.setState({ tooltipsText: this.state.tooltips[index - 1] });
      }
      this.flag = true;
      onPress?.(0);
    } else {
      this.setState({ icon: [...new Array(index).fill(end), ...new Array(resultRating - index).fill(start)] });
      if (this.state.tooltips) {
        this.setState({ tooltipsText: this.state.tooltips[index] });
      }
      this.flag = true;
      onPress?.(index);
    }
  };
  render() {
    const { icon, size, color, tooltipsText, disabled } = this.state;
    const { tooltipsStyle } = this.props;
    return (
      <View>
        <View style={styles.RatingContainer}>
          {icon.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (disabled === false) {
                    this.updateIcon(index + 1);
                  }
                }}
                key={index}
              >
                {typeof item === 'string' ? <Icon name={item as IconsName} color={color} size={size} /> : item}
              </TouchableOpacity>
            );
          })}
          <Text style={[styles.tooltipsText, { fontSize: size - 5, color: color }, tooltipsStyle]}>{tooltipsText}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  RatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipsText: {
    marginHorizontal: 10,
  },
});
