import React from 'react';
import { Dimensions, Image, StyleSheet, View, Text } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { CarouselItem } from '@/types/displayTypes';

interface DisplayCarouselProps {
  images: CarouselItem[];
}

const DisplayCarousel: React.FC<DisplayCarouselProps> = ({ images }) => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <Carousel
      loop
      width={width}
      height={height}
      autoPlay={true}
      data={images}
      scrollAnimationDuration={1000}
      autoPlayInterval={10000}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Image
            source={{ uri: item.url }}
            style={styles.image}
            resizeMode="cover"
          />
          {item.text && (
            <View style={styles.textContainer}>
              <Text style={styles.slideText}>{item.text}</Text>
            </View>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  slideText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default DisplayCarousel;