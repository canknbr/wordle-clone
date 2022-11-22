import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { colors, CLEAR, ENTER } from './src/constants';
import Keyboard from './src/components/Keyboard/Keyboard';
import { useState, useEffect } from 'react';
const NUMBER_OF_TRIES = 6;
const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};

export default function App() {
  const word = 'Hello';
  const letters = word.split('');
  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
  );
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const onKeyPressed = key => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>
        {rows.map((row, index) => (
          <View style={styles.row} key={index}>
            {row.map((cell, indexCell) => (
              <View
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(index, indexCell)
                      ? colors.lightgrey
                      : colors.darkgrey,
                  },
                ]}
                key={indexCell}
              >
                <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <Keyboard onKeyPressed={onKeyPressed} />
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
    height: 100,
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
