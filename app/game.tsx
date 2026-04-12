import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
// Mock AsyncStorage pour le stockage local des high scores
const AsyncStorage = {
    getItem: async (key: string) => {
        try {
            const data = localStorage?.getItem(key);
            return data || null;
        } catch {
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            localStorage?.setItem(key, value);
        } catch {
            console.error('Storage unavailable');
        }
    }
};

// Définition des types d'opérations et de difficulté (roadmap)
type Operation = 'addition' | 'soustraction' | 'multiplication';

interface GameState {
    operation: Operation;
    num1: number;
    num2: number;
    correctAnswer: number;
}

// Clé de stockage pour AsyncStorage
const HIGH_SCORE_KEY = '@CalcMent:HighScore';

/**
 * Génère deux nombres aléatoires et effectue l'opération spécifiée.
 * @param op L'opération à effectuer.
 * @returns Un objet contenant les nombres générés, l'opérateur texte, et la réponse correcte.
 */
const generateProblem = (op: Operation): GameState => {
    let num1: number;
    let num2: number;
    let correctAnswer: number;

    // Logique de génération dépendante de l'opération pour garantir des résultats cohérents
    switch (op) {
        case 'addition':
            num1 = Math.floor(Math.random() * 51);
            num2 = Math.floor(Math.random() * 51);
            correctAnswer = num1 + num2;
            break;
        case 'soustraction':
             // Garantit un résultat positif (ex: entre 16 et 50)
            const maxVal = Math.max(Math.floor(Math.random() * 31) + 16, Math.floor(Math.random() * 31) + 16);
            num1 = Math.min(maxVal, Math.floor(Math.random() * 31) + 16);
            num2 = maxVal;
             // Assure que le grand nombre est toujours num2 pour l'affichage (A - B ou B - A)
            correctAnswer = num2 - num1; 
            break;
        case 'multiplication':
            num1 = Math.floor(Math.random() * 10) + 2;
            num2 = Math.floor(Math.random() * 10) + 2;
            correctAnswer = num1 * num2;
            break;
        default:
            return generateProblem('addition');
    }

    // Ajustement de l'affichage des nombres pour la soustraction, où le plus grand est toujours affiché en premier.
    const displayNum1 = (op === 'soustraction') ? num2 : num1;
    const displayNum2 = (op === 'soustraction') ? num1 : num2;

    return {
        operation: op,
        num1: displayNum1,
        num2: displayNum2,
        correctAnswer: correctAnswer
    };
};


// Composant de l'écran de jeu mis à jour pour la modularité et les high scores
export default function GameScreen() {
    const [gameState, setGameState] = useState<GameState>(generateProblem('addition'));
    const [answerText, setAnswerText] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');
    const [highScore, setHighScore] = useState<number>(0); // État pour stocker le high score

    // Chargement des scores au démarrage du composant
    React.useEffect(() => {
        loadHighScore().finally(() => console.log('High Score chargé.'));
    }, []);

    // Fonction pour charger le high score de AsyncStorage
    const loadHighScore = async () => {
        try {
            const storedScore = await AsyncStorage.getItem(HIGH_SCORE_KEY);
            if (storedScore !== null) {
                setHighScore(parseInt(storedScore, 10));
            }
        } catch (e) {
            console.error("Erreur lors du chargement des high scores:", e);
        }
    };

    // Fonction pour sauvegarder le score si c'est un nouveau record
    const saveHighScore = async () => {
        if (score > highScore) {
            try {
                await AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
                alert(`🎉 Nouveau Record ! Votre Score : ${score} !`);
            } catch (e) {
                console.error("Erreur lors de la sauvegarde du high score:", e);
            }
        }
    };

    // Utilisation de useCallback pour optimiser les fonctions qui génèrent un nouveau problème
    const generateNewProblem = useCallback((op: Operation) => {
        setGameState(generateProblem(op));
        setAnswerText('');
        setFeedback('none');
    }, []);

    // Fonction principale de vérification de la réponse
    const checkAnswer = async () => {
        if (answerText === '') return;

        const userAnswer = parseInt(answerText, 10);
        const correctAnswer = gameState.correctAnswer;

        if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
            // Réponse correcte
            setScore(s => s + 1);
            setFeedback('correct');
            
            // On attend un court instant pour montrer le feedback avant de générer le nouveau problème
            setTimeout(() => {
                generateNewProblem(gameState.operation);
            }, 500);

        } else {
            // Réponse incorrecte
            setFeedback('incorrect');
        }
    };

    // Gestion du changement d'opération/difficulté (Amélioration Future)
    const handleOperationChange = (operation: Operation) => {
        generateNewProblem(operation);
    };


    // Déterminer le texte de l'opération affiché
    const getOperatorSymbol = () => {
        switch (gameState.operation) {
            case 'addition': return '+';
            case 'soustraction': return '-';
            case 'multiplication': return '*';
        }
    };

    // Déterminer le style du feedback pour l'UX
    const getFeedbackStyle = () => {
        if (feedback === 'correct') return styles.success;
        if (feedback === 'incorrect') return styles.error;
        return null;
    };


    // Rendu de l'interface
    return (
        <KeyboardAvoidingView 
            style={styles.keyboardContainer} 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.container}>
                {/* Version plus concise du sélecteur d'opération */}
                <View style={styles.opSelector}>
                    <Text style={styles.subTitle}>Mode: </Text>
                    <Button 
                        title="+" onPress={() => handleOperationChange('addition')} 
                        disabled={gameState.operation === 'addition'} 
                    />
                    <Button
                        title="-" onPress={() => handleOperationChange('soustraction')} 
                        disabled={gameState.operation === 'soustraction'} 
                    />
                    <Button 
                        title="*" onPress={() => handleOperationChange('multiplication')} 
                        disabled={gameState.operation === 'multiplication'} 
                    />
                </View>


                {/* Titre du problème */}
                <Text style={styles.title}>
                    {gameState.num1} {getOperatorSymbol()} {gameState.num2} ?
                </Text>
                
                {/* Feedback visuel temporel */}
                {feedback === 'correct' && <Text style={styles.successMessage}>✅ Correct !</Text>}
                {feedback === 'incorrect' && <Text style={styles.errorMessage}>❌ Incorrect. Essaie encore.</Text>}

                <TextInput
                    style={[styles.input, getFeedbackStyle()]}
                    keyboardType="numeric"
                    value={answerText}
                    onChangeText={setAnswerText}
                    placeholder="Votre réponse"
                />
                
                {/* Bouton Valider */}
                <View style={styles.buttonWrapper}>
                     <Button 
                        title="Valider" 
                        onPress={checkAnswer} 
                        disabled={!answerText} // Désactiver si pas de texte saisi
                    />
                </View>

                {/* Affichage du Score et High Score */}
                <Text style={styles.score}>Score: {score}</Text>
                <View style={styles.highScoreContainer}>
                    <Text style={styles.highScoreLabel}>High Score : </Text>
                    <Text style={styles.highScoreValue}>{highScore}</Text>
                </View>

                 {/* Bouton pour sauvegarder le high score */}
                <View style={styles.saveButtonContainer}>
                    <Button 
                        title="Sauvegarder Score" 
                        onPress={saveHighScore} 
                        disabled={score <= highScore && feedback !== 'correct'}
                    />
                 </View>
            </View>
        </KeyboardAvoidingView>
    );
}

// Styles CSS mis à jour pour supporter la modularité et le feedback visuel
const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        backgroundColor: '#f0f2f5', // Fond plus clair
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    opSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        width: '90%',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginRight: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        minHeight: 40, // Pour éviter que le layout ne saute lors du changement de problème
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: 'white',
    },
    buttonWrapper: {
        width: '80%',
        marginBottom: 20,
    },
    score: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    // --- High Score Section ---
    highScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        fontSize: 18,
    },
    highScoreLabel: {
        color: '#777',
        marginRight: 10,
    },
    highScoreValue: {
        fontWeight: 'bold',
        color: '#FF9500', // Couleur or
        fontSize: 24,
    },
    saveButtonContainer: {
        marginTop: 30,
        width: '80%',
    },
    // Styles de Feedback visuel
    success: {
        borderColor: '#4CAF50', // Vert
        borderWidth: 2,
    },
    error: {
        borderColor: '#F44336', // Rouge
        borderWidth: 2,
    },
    // Messages de feedback affichés au-dessus du champ de texte
    successMessage: {
        color: '#4CAF50',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    errorMessage: {
        color: '#F44336',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});