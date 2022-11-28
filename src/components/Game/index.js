import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from '../../constants';
import Keyboard from '../Keyboard/Keyboard';
import { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import words from '../../../assets/Words';
import { getDayOfYear, copyArray, getDayKey } from '../utils';
import { NUMBER_OF_TRIES } from '../constant';
import styles from './styles';
import EndScreen from '../EndScreen';
import Animated, {
  ZoomIn,
  SlideInLeft,
  FlipInEasyY,
} from 'react-native-reanimated';

export default function Game() {
  const [loaded, setLoaded] = useState(false);
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const word = words[getDayOfYear() % 31];
  const letters = word.split('');
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );

  let dayKey = getDayKey();

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const persistState = async () => {
    const data = {
      curRow,
      curCol,
      gameState,
      rows,
    };
    try {
      let existingDataString = await AsyncStorage.getItem('gameState');
      let existingData = existingDataString
        ? JSON.parse(existingDataString)
        : {};

      existingData[dayKey] = data;
      await AsyncStorage.setItem('gameState', JSON.stringify(existingData));
    } catch (e) {
      console.log(e);
    }
  };

  const restoreState = async () => {
    const data = await AsyncStorage.getItem('gameState');
    try {
      const parsedData = JSON.parse(data);
      const dayData = parsedData[dayKey];
      const { curRow, curCol, gameState, rows } = dayData;
      setCurRow(curRow);
      setCurCol(curCol);
      setGameState(gameState);
      setRows(rows);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!loaded) {
      restoreState();
    }
  }, []);

  useEffect(() => {
    persistState();
  }, [gameState, curRow, curCol, rows]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert('You won!');
      setGameState('won');
    } else if (checkIfLost() && gameState !== 'lost') {
      setGameState('lost');
    }
  };
  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };
  const checkIfLost = () => {
    return curRow === rows.length;
  };

  const onKeyPressed = key => {
    if (gameState !== 'playing') return;
    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }
    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }
    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };
  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };
  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };
  const getAllLetterColor = color => {
    return rows.flatMap((row, i) =>
      row.filter((cell, j) => getCellBGColor(i, j) === color)
    );
  };

  const greenCaps = getAllLetterColor(colors.primary);
  const yellowCaps = getAllLetterColor(colors.secondary);
  const greyCaps = getAllLetterColor(colors.darkgrey);
  const getCellStyle = (index, indexCell) => [
    styles.cell,
    {
      borderColor: isCellActive(index, indexCell)
        ? colors.lightgrey
        : colors.darkgrey,
      backgroundColor: getCellBGColor(index, indexCell),
    },
  ];
  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  if (gameState !== 'playing') {
    setTimeout(() => {
      return (
        <EndScreen
          won={gameState === 'won'}
          rows={rows}
          getCellBGColor={getCellBGColor}
        />
      );
    }, 1000);
  }
  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, index) => (
          <Animated.View
            entering={SlideInLeft.delay(index * 100)}
            style={styles.row}
            key={index}
          >
            {row.map((letter, indexCell) => (
              <>
                {index < curRow && (
                  <Animated.View
                    entering={FlipInEasyY.delay(indexCell * 100)}
                    key={`${index}-${indexCell} flip`}
                    style={getCellStyle(index, indexCell)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                )}
                {index === curRow && !!letter && (
                  <Animated.View
                    entering={ZoomIn}
                    key={`${indexCell}zoom`}
                    style={getCellStyle(index, indexCell)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </Animated.View>
                )}
                {!letter && (
                  <View
                    key={`${indexCell}-letter
                  `}
                    style={getCellStyle(index, indexCell)}
                  >
                    <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
                  </View>
                )}
              </>
            ))}
          </Animated.View>
        ))}
      </ScrollView>
      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </>
  );
}
