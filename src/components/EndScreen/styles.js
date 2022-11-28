import { StyleSheet } from 'react-native';
import { colors } from '../../constants';

export default StyleSheet.create({
  container: {},
  title: {
    fontSize: 30,
    color: 'white',
    marginVertical: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.lightgrey,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  numberContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  number: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    color: colors.lightgrey,
    textAlign: 'center',
  },
  guessDistributionLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  positionText: {
    fontSize: 15,
    color: colors.lightgrey,
  },
  amountContainer: {
    backgroundColor: colors.darkgrey,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 10,
  },
  positionNumber: {
    color: colors.lightgrey,
  },
});
