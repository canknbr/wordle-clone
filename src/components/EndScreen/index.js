import { View, Text, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import styles from './styles';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, colorsToEmoji } from '../../constants';

import Animated, {
  ZoomIn,
  SlideInLeft,
  FlipInEasyY,
} from 'react-native-reanimated';
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
            minWidth: 50,
          },
        ]}
      >
        <Text style={styles.positionNumber}>{amount}</Text>
      </View>
    </View>
  );
};
const GuessDistribution = ({ distribution }) => {
  if (!distribution) return null;
  const sum = distribution.reduce((acc, cur) => acc + cur, 0);
  return (
    <View>
      <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
      {distribution.map((item, index) => {
        return (
          <GuessDistributionLine
            key={index}
            position={index + 1}
            amount={item}
            percentage={(100 * item) / sum}
          />
        );
      })}
    </View>
  );
};
const EndScreen = ({ won = false, rows, getCellBGColor }) => {
  const [seconds, setSeconds] = useState(0);
  const [played, setPlayed] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [distribution, setDistribution] = useState(null);
  useEffect(() => {
    restoreState();
  }, []);
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
  const restoreState = async () => {
    const data = await AsyncStorage.getItem('gameState');
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      console.log(e);
    }
    const keys = Object.keys(parsedData);
    const values = Object.values(parsedData);
    setPlayed(keys.length);
    const wins = values.filter(value => value.gameState === 'won').length;
    setWinRate(Math.floor((wins / keys.length) * 100));
    let curStreak = 0;
    let maxStreak = 0;
    let prevDay = 0;
    keys.forEach(key => {
      const day = parseInt(key.split('-')[1]);
      if (parsedData[key].gameState === 'won' && curStreak === 0) {
        curStreak += 1;
      } else if (parsedData[key].gameState === 'won' && prevDay === day - 1) {
        curStreak += 1;
      } else {
        if (curStreak > maxStreak) {
          maxStreak = curStreak;
        }
        curStreak = parsedData[key].gameState === 'won' ? 1 : 0;
      }
      prevDay = day;
    });
    setCurStreak(curStreak);
    setMaxStreak(maxStreak);
    let dist = [0, 0, 0, 0, 0, 0];
    values.map(game => {
      if (game.gameState === 'won') {
        const tries = game.rows.filter(row => row[0].length);
        dist[tries] = dist[tries] + 1;
      }
    });
    setDistribution(dist);
  };
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
        <Number number={played} label="Played" />
        <Number number={winRate} label="Win %" />
        <Number number={curStreak} label="Cur streak" />
        <Number number={maxStreak} label="Max streak" />
      </View>
      <GuessDistribution distribution={distribution} />
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
