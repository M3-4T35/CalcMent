import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

// Composant de l'écran d'accueil
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CalcMent</Text>
      <Link href="/game" style={styles.button}>
        <Text style={styles.buttonText}>Jouer</Text>
      </Link>
    </View>
  );
}

// Styles CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});