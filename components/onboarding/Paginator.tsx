// components/onboarding/Paginator.tsx
import React from 'react';
import { View, Animated, useWindowDimensions } from 'react-native';

type PaginatorProps = {
  data: any[];
  scrollX: Animated.Value;
};

export default function Paginator({ data, scrollX }: PaginatorProps) {
  const { width } = useWindowDimensions();

  return (
    <View className="flex-row h-16">
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i.toString()}
            style={{ width: dotWidth, opacity }}
            className="h-2.5 bg-netcom-orange rounded-full mx-2"
          />
        );
      })}
    </View>
  );
}