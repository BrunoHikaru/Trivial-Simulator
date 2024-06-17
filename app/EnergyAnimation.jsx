import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const EnergyAnimation = () => {
  const energyParticles = useRef([]);
  const containerSize = 200; // Tamanho do contêiner
  const numParticles = 30; // Número de partículas de energia

  useEffect(() => {
    energyParticles.current.forEach((particle, index) => {
      const duration = 1500 + Math.random() * 1500; // Duração do movimento da partícula (entre 1.5 e 3 segundos)
      const delay = Math.random() * 1500; // Atraso inicial aleatório para cada partícula
      const initialX = Math.random() * containerSize; // Posição inicial X aleatória
      const targetX = Math.random() * containerSize; // Posição alvo X aleatória
      const initialY = Math.random() * containerSize; // Posição inicial Y aleatória
      const targetY = Math.random() * containerSize; // Posição alvo Y aleatória

      // Configura a animação de movimento da partícula
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
        const size = Math.random() * 10 + 5; // Tamanho aleatório da partícula (entre 5 e 15)
        const color = `rgba(255, 255, 255, ${Math.random()})`; // Cor aleatória com transparência

        // Inicializa as animações de tradução para X e Y
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
