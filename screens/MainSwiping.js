import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const MainSwiping = () => {
  const cards = ['Card 1', 'Card 2', 'Card 3', 'Card 4', 'Card 5'];

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(card) => (
          <View style={styles.card}>
            <Text>{card}</Text>
          </View>
        )}
        onSwiped={(cardIndex) => console.log('Swiped card index:', cardIndex)}
        onSwipedAll={() => console.log('All cards have been swiped')}
        cardIndex={0}
        backgroundColor="transparent"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});

export default MainSwiping;
