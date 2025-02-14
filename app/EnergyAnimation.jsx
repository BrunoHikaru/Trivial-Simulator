import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const EnergyAnimation = () => {
  const energyParticles = useRef([]);
  const containerSize = 200; 
  const numParticles = 30; 

  useEffect(() => {
    energyParticles.current.forEach((particle, index) => {
      const duration = 1500 + Math.random() * 1500; 
      const delay = Math.random() * 1500; 
      const initialX = Math.random() * containerSize; 
      const targetX = Math.random() * containerSize; 
      const initialY = Math.random() * containerSize; 
      const targetY = Math.random() * containerSize; 

      
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(particle.translateX, {
            toValue: targetX,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: targetY,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateX, {
            toValue: initialX,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.translateY, {
            toValue: initialY,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      {Array.from(Array(numParticles).keys()).map((index) => {
        const size = Math.random() * 10 + 5; 
        const color = `rgba(255, 255, 255, ${Math.random()})`; 

        
        const translateX = useRef(new Animated.Value(Math.random() * containerSize)).current;
        const translateY = useRef(new Animated.Value(Math.random() * containerSize)).current;

        energyParticles.current[index] = { translateX, translateY };

        return (
          <Animated.View
            key={index}
            style={[
              styles.energyParticle,
              { width: size, height: size, backgroundColor: color },
              {
                transform: [
                  { translateX: energyParticles.current[index].translateX },
                  { translateY: energyParticles.current[index].translateY },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyParticle: {
    position: 'absolute',
    borderRadius: 50,
  },
});

export default EnergyAnimation;
