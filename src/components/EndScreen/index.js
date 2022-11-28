import { View, Text, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import styles from './styles';
import * as Clipboard from 'expo-clipboard';

import { colors, colorsToEmoji } from '../../constants';
const Number = ({ number, label }) => {
  return (
    <View style={styles.numberContainer}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};
const GuessDistributionLine = ({ position, amount, percentage }) => {
  return (
    <View style={styles.guessDistributionLineContainer}>
      <Text style={styles.positionText}>{position}</Text>
      <View
        style={[
          styles.amountContainer,
          {
            width: `${percentage}%`,
          },
        ]}
      >
        <Text style={styles.positionNumber}>{amount}</Text>
      </View>
    </View>
  );
};
const GuessDistribution = () => {
  return (
    <View>
      <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
      <GuessDistributionLine position={0} amount={2} percentage={50} />
      <GuessDistributionLine position={3} amount={2} percentage={70} />
    </View>
  );
};
const EndScreen = ({ won = false, rows, getCellBGColor }) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const updateSeconds = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      setSeconds((tomorrow - now) / 1000);
    };

    const interval = setInterval(() => {
      updateSeconds();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const formatTime = () => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds / 3600);
    const min = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${min}m ${sec}s`;
  };
  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join('')
      )
      .filter(row => row)
      .join('\n');

    Clipboard.setStringAsync(textMap);
    Alert.alert(
      'Copied to clipboard!',
      'You can now share your score with your friends!'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{won ? 'You won!' : 'You lost!'}</Text>
      <Text style={styles.subtitle}>STATISTICS</Text>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Number number={1} label="Played" />
        <Number number={2} label="Win %" />
        <Number number={3} label="Cur streak" />
        <Number number={4} label="Max streak" />
      </View>
      <GuessDistribution />
      <View style={{ flexDirection: 'row', marginVertical: 20 }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ color: colors.lightgrey }}>Next Wordle</Text>
          <Text
            style={{
              color: colors.lightgrey,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            {formatTime()}
          </Text>
        </View>
        <Pressable
          onPress={shareScore}
          style={{
            flex: 1,
            padding: 10,
            backgroundColor: colors.primary,
            borderRadius: 20,
            marginLeft: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Share!
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EndScreen;
