import React, { useState } from 'react';
import { StyleSheet, Animated, View, Alert } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import SwipeableImage from './SwipeableImage';

function Swipes({ users, currentIndex, handleLike, handlePass, swipesRef }) {
  const [willLike, setWillLike] = useState(false);
  const [willPass, setWillPass] = useState(false);

  // Use react-native-reanimated for more control over animations
  const translateX = new Animated.Value(0);

  const handleSwipe = (gestureState) => {
    // Update translateX based on the gestureState
    translateX.setValue(gestureState.dx);
  };

  const gestureHandler = (event) => {
    handleSwipe(event.nativeEvent);
  };

  const renderLeftActions = () => {
    return (
      <RectButton style={styles.container}>
        <SwipeableImage user={users[currentIndex + 1]}></SwipeableImage>
      </RectButton>
    );
  };

  const renderRightActions = () => {
    return (
      <RectButton style={styles.container}>
        <SwipeableImage user={users[currentIndex + 1]}></SwipeableImage>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipesRef}
      friction={1.8}
      leftThreshold={20}
      rightThreshold={20}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => {
        setWillLike(false);
        handleLike();
      }}
      onSwipeableRightOpen={() => {
        setWillPass(false);
        handlePass();
      }}
      onSwipeableLeftWillOpen={() => setWillLike(true)}
      onSwipeableRightWillOpen={() => setWillPass(true)}
      onSwipeableEvent={gestureHandler}
    >
      <Animated.View
        style={{
          transform: [{ translateX }],
        }}
      >
        <SwipeableImage user={users[currentIndex]} willLike={willLike} willPass={willPass} />
      </Animated.View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.forwardRef((props, ref) => <Swipes swipesRef={ref} {...props}></Swipes>);
