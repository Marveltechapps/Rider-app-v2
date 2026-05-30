import React from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

interface AppLogoProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export default function AppLogo({ size = 64, style }: AppLogoProps) {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.2 }, style]}>
      <Image
        source={require('../../assets/images/selorg-delivery-partner-logo-clean.png')}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
