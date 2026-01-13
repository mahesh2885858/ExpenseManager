import React from 'react';
import { View } from 'react-native';
import { gs } from '../../common';

type TProps = {
  children: React.ReactNode;
};
const Container = (props: TProps) => {
  return <View style={[gs.fullFlex]}>{props.children}</View>;
};

export default Container;
