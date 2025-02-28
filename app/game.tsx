import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function GameScreen() {
  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 100));
  const [answer, setAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  const checkAnswer = () => {
    const correctAnswer = num1 * num2;
    if (parseInt(answer) === correctAnswer) {
      setScore(score + 1);
      Alert.alert('Correct!', 'Bonne réponse!');
      setNum1(Math.floor(Math.random() * 10));
      setNum2(Math.floor(Math.random() * 100));
      setAnswer('');
    } else {
      Alert.alert('Incorrect!', 'Mauvaise réponse, essayez encore!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Combien font {num1} * {num2} ?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={answer}
        onChangeText={setAnswer}
        placeholder="Votre réponse"
      />
      <Button title="Valider" onPress={checkAnswer} />
      <Text style={styles.score}>Score: {score}</Text>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  score: {
    marginTop: 20,
    fontSize: 18,
  },
});