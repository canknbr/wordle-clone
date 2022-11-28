import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from '../../constants';
import Keyboard from '../Keyboard/Keyboard';
import { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import words from '../../../assets/Words';
import { getDayOfYear, copyArray } from '../utils';
import { NUMBER_OF_TRIES } from '../constant';
import styles from './styles';
export default function Game() {
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const word = words[getDayOfYear() % 31];
  const letters = word.split('');
  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  }, [curRow]);

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert('Yeeeey!', 'You won!', [
        { text: 'Share', onPress: shareScore },
      ]);
      setGameState('won');
    } else if (checkIfLost() && gameState !== 'lost') {
      Alert.alert('Oooops!!', 'You lost!');
      setGameState('lost');
    }
  };
  const checkIfWon = () => {
    const row = rows[curRow - 1];
    return row.every((letter, i) => letter === letters[i]);
  };
  const checkIfLost = () => {
    return !checkIfWon && curRow === rows.length;
  };

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );

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
  const shareScore = () => {
    const textMap = rows
      .map((row, i) =>
        row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join('')
      )
      .filter(row => row)
      .join('\n');
    const text = `I won with ${curRow} tries! \n${textMap}`;
    Clipboard.setStringAsync(text);
  };

  const greenCaps = getAllLetterColor(colors.primary);
  const yellowCaps = getAllLetterColor(colors.secondary);
  const greyCaps = getAllLetterColor(colors.darkgrey);
  return (
    <>
      <ScrollView style={styles.map}>
        {rows.map((row, index) => (
          <View style={styles.row} key={index}>
            {row.map((letter, indexCell) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(index, indexCell)
                      ? colors.lightgrey
                      : colors.darkgrey,
                    backgroundColor: getCellBGColor(index, indexCell),
                  },
                ]}
                key={indexCell}
              >
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
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
