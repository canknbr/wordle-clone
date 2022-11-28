import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

export default StyleSheet.create({
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
