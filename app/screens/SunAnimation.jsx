import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const SunAnimation = () => {
  const rotationValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(rotationValue, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }),
    { iterations: -1 }
  ).start();

  const rays = Array.from(Array(10).keys());

  return (
    <View style={styles.sunContainer}>
      {rays.map((_, index) => {
        const rayRotation = rotationValue.interpolate({
          inputRange: [0, 1],
          outputRange: [`${index * 36}deg`, `${(index + 1) * 36}deg`],
        });

        return (
          <Animated.View
            key={index}
            style={[styles.ray, { transform: [{ rotate: rayRotation }] }]}
          />
        );
      })}
      <View style={styles.sun} />
    </View>
  );
};

const styles = StyleSheet.create({
  sunContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  sun: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'yellow',
    position: 'absolute',
  },
  ray: {
    position: 'absolute',
    width: 2,
    height: 25,
    backgroundColor: 'rgba(255, 255, 0, 0.5)',
    borderRadius: 1,
    transformOrigin: 'bottom',
    top: 12.5,
  },
});

export default SunAnimation;
