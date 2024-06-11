import React, { useState, useRef } from 'react';
import { View, StyleSheet, TextInput, Button, Text } from 'react-native';

const App = () => {
  const words = ['AGUJA', 'BANCO', 'CAUSA', 'DARDO', 'MEDIO', 'FUEGO', 'GATO', 'HUEVO', 'IGUAL', 'JUGAR', 'LLAMA', 'MANGO', 'NUEVO', 'OLIVO', 'PATIO', 'QUESO', 'RADIO', 'SILLA', 'TIGRE', 'UNION', 'VASOS', 'BUENA', 'XENON', 'FORMA', 'ZORRO', 'FRUTA', 'BRISA', 'CLIMA', 'DULCE'];

  const initialCellContents = Array(5).fill('').map(() => ({
    cells: Array(5).fill(''),
    backgroundColors: Array(5).fill('#fff'), // Color de fondo inicial de las celdas
    locked: false,
  }));

  const [cellContents, setCellContents] = useState(initialCellContents);
  const [resultMessage, setResultMessage] = useState('');
  const [chosenWord, setChosenWord] = useState('');
  const [showChosenWord, setShowChosenWord] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const inputRefs = useRef([]);

  const randomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const handleCellChange = (rowIndex, cellIndex, value) => {
    if (cellContents[rowIndex].locked) {
      return;
    }

    const newValue = value.toUpperCase();
    const newCellContents = [...cellContents];
    newCellContents[rowIndex].cells[cellIndex] = newValue.slice(0, 1);
    setCellContents(newCellContents);

    if (cellIndex < 4) {
      inputRefs.current[rowIndex][cellIndex + 1].focus();
    }
  };

  const handleKeyPress = (event, rowIndex, cellIndex) => {
    if (event.nativeEvent.key === 'Backspace' && cellContents[rowIndex].cells[cellIndex] === '') {
      if (cellIndex > 0) {
        const newCellContents = [...cellContents];
        newCellContents[rowIndex].cells[cellIndex - 1] = '';
        setCellContents(newCellContents);
        inputRefs.current[rowIndex][cellIndex - 1].focus();
      }
    }
  };

  const handleStartGame = () => {
    const selectedWord = randomWord();
    setChosenWord(selectedWord);
    setShowChosenWord(true);
    setGameStarted(true);
  };

  const handleRestartGame = () => {
    const selectedWord = randomWord();
    setChosenWord(selectedWord);
    setShowChosenWord(true);
    setResultMessage('');
    setCellContents(initialCellContents);
  };

  const handleGuess = () => {
    if (!showChosenWord) {
      const selectedWord = randomWord();
      setChosenWord(selectedWord);
      setShowChosenWord(true);
    }

    let guessedCorrectly = false;

    const newCellContents = cellContents.map((vector, vectorIndex) => {
      const backgroundColors = vector.cells.map((cell, cellIndex) => {
        if (cell === '') {
          return '#fff'; // Blanco si la celda está vacía
        }

        const letter = cell.toUpperCase();
        const correctLetter = chosenWord[cellIndex];
        if (letter === correctLetter) {
          return '#7CFC00'; // Verde si la letra es correcta
        } else if (chosenWord.includes(letter)) {
          return '#FFA500'; // Naranja si la letra está en la palabra pero en una posición incorrecta
        } else {
          return '#fff'; // Blanco si la letra no es parte de la palabra
        }
      });

      // Cambiar las celdas de los vectores debajo del vector lleno a blanco
      if (guessedCorrectly && vectorIndex > 0) {
        return { ...vector, backgroundColors: Array(5).fill('#fff') };
      }

      return { ...vector, backgroundColors };
    });

    setCellContents(newCellContents);

    for (let rowIndex = 0; rowIndex < cellContents.length; rowIndex++) {
      const word = cellContents[rowIndex].cells.join('').toUpperCase();
      if (word === chosenWord) {
        guessedCorrectly = true;
        break;
      }
    }

    if (guessedCorrectly) {
      setResultMessage(`¡Felicidades! ¡Adivinaste la palabra correctamente! La palabra correcta era "${chosenWord}".`);
    } else {
      const nextVectorIndex = cellContents.findIndex(vector => vector.cells.every(cell => cell === ''));
      if (nextVectorIndex !== -1) {
        inputRefs.current[nextVectorIndex][0].focus();
        setResultMessage('');
        newCellContents[0].locked = true;
        setCellContents(newCellContents);
      } else {
        const newCellContents = cellContents.map(vector => ({ ...vector, locked: true }));
        setCellContents(newCellContents);
        setResultMessage(`Perdiste, lo siento. La palabra correcta era "${chosenWord}".`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adivina la Palabra</Text>
      {cellContents.map((vector, vectorIndex) => (
        <View key={vectorIndex} style={styles.vector}>
          {vector.cells.map((cell, cellIndex) => (
            <TextInput
              key={cellIndex}
              ref={(ref) => {
                if (!inputRefs.current[vectorIndex]) {
                  inputRefs.current[vectorIndex] = [];
                }
                inputRefs.current[vectorIndex][cellIndex] = ref;
              }}
              style={[styles.cell, { backgroundColor: vector.backgroundColors[cellIndex] }]} // Color de fondo dinámico
              onChangeText={(text) => handleCellChange(vectorIndex, cellIndex, text)}
              onKeyPress={(event) => handleKeyPress(event, vectorIndex, cellIndex)}
              value={cell}
              maxLength={1}
              editable={!vector.locked}
              autoCapitalize="characters"
              keyboardType="ascii-capable"
            />
          ))}
        </View>
      ))}
      <View style={styles.buttonContainer}>
        {!gameStarted && <Button title="Iniciar" onPress={handleStartGame} />}
        {gameStarted && <Button title="Reiniciar" onPress={handleRestartGame} />}
        <Button title="Adivinar" onPress={handleGuess} />
      </View>
      {/*showChosenWord && <Text style={styles.chosenWordText}>Palabra seleccionada: {chosenWord}</Text>*/}
      <Text style={styles.resultText}>{resultMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  vector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  chosenWordText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default App;
