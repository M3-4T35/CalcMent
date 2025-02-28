import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'CalcMent' }} />
      <Stack.Screen name="game" options={{ title: 'Jeu' }} />
    </Stack>
  );
}