import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { colors, CLEAR, ENTER, colorsToEmoji } from './src/constants';
import Keyboard from './src/components/Keyboard/Keyboard';
import { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';

const NUMBER_OF_TRIES = 6;
const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};
const wordsIncludeFiveLetters = [
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
  'lemon',
  'hello',
  'world',
  'react',
  'apple',
];
export default function App() {
  const word = wordsIncludeFiveLetters[getDayOfYear() % 31];
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
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing');
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical: 16,
  },
  row: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    borderWidth: 1,
    borderColor: colors.darkgrey,
    flex: 1,
    aspectRatio: 1,
    margin: 5,
    maxWidth: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
  },
});
