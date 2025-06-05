// components/onboarding/OnboardingSlide.tsx
import React from 'react';
import { View, Text, Image, useWindowDimensions, ImageSourcePropType } from 'react-native';

type OnboardingSlideProps = {
  item: {
    id: string;
    image: ImageSourcePropType;
    title: string;
    description: string;
  };
};

export default function OnboardingSlide({ item }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <Image source={item.image} className="w-[70%] h-[30%] mb-12" resizeMode="contain" />
      <Text className="text-3xl font-bold text-netcom-blue text-center mb-4">{item.title}</Text>
      <Text className="text-base text-netcom-text-secondary text-center">{item.description}</Text>
    </View>
  );
}