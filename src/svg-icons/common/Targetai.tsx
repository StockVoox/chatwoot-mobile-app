import React from 'react';
import { Image } from 'react-native';

export const TargetaiIcon = (): JSX.Element => {
  return (
    <Image
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      source={require('../../../../assets/adaptive-icon.png')}
      style={{ width: '100%', height: '100%' }}
      resizeMode="contain"
    />
  );
};
