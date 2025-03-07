const mongoose = require('mongoose');

async function addPuzzle() {
  try {
    const dbUri = "mongodb+srv://santhosh:santhosh123@cluster0.jfzhr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Connect to MongoDB Atlas
    await mongoose.connect(dbUri);

    const { default: Puzzle } = await import('../models/Puzzle.js'); // Use dynamic import

    const newPuzzle = new Puzzle({
      size: 27,
      grid : [ 
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0],
        [1,0,1,0,1,1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0],
        [1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [1,0,1,0,0,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,0,0,0,0,0,0],
        [1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0],
        [1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],
        [1,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,1,0,1,0,0,0,0],
        [1,0,1,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,1,0,1,0,0,0,0],
        [1,0,1,0,1,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,1,0,0,0,0],
        [0,0,1,0,1,0,1,0,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,1,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0]
    ].map(row =>
        row.map(value => ({
          value,
          isSpecial: false,
          letter: '',
          question: '',
          answer: ''
        }))
      ),
      words:[
        {
          "word": "PROCEDURE",
          "clue": "I come in many forms, take in values, and return results when you call me.",
          "direction": "down",
          "startRow": 0,
          "startCol": 11,
          "number": 1,
          "wordLength": 9
        },
        {
          "word": "ENCAPSULATION",
          "clue": "Like a medicine capsule, this process keeps the contents safe inside, revealing only what's needed.",
          "direction": "across",
          "startRow": 2,
          "startCol": 0,
          "number": 2,
          "wordLength": 13
        },
        {
          "word": "COUNTINGSORT",
          "clue": "A non-comparison sorting technique?",
          "direction": "down",
          "startRow": 2,
          "startCol": 2,
          "number": 3,
          "wordLength": 12
        },
        {
          "word": "ASYNCHRONOUS",
          "clue": "I enable tasks to proceed independently, without waiting for previous ones to complete. What am I?",
          "direction": "down",
          "startRow": 2,
          "startCol": 20,
          "number": 4,
          "wordLength": 12
        },
        {
          "word": "ENUM",
          "clue": "I live inside structures or globally, giving names to integer values in C. What am I?",
          "direction": "across",
          "startRow": 3,
          "startCol": 13,
          "number": 5,
          "wordLength": 4
        },
        {
          "word": "NIBBLE",
          "clue": "I’m a building block of digital data, formed by 4 tiny decisions of yes or no. What am I?",
          "direction": "down",
          "startRow": 3,
          "startCol": 14,
          "number": 6,
          "wordLength": 6
        },
        {
          "word": "IMMUTABLE",
          "clue": "Once set, I can't be changed.",
          "direction": "down",
          "startRow": 4,
          "startCol": 0,
          "number": 7,
          "wordLength": 9
        },
        {
          "word": "DATABASE",
          "clue": "I’m a structured place where data is stored, organized, and easily retrieved. What am I?",
          "direction": "across",
          "startRow": 4,
          "startCol": 4,
          "number": 8,
          "wordLength": 8
        },
        {
          "word": "TERMINAL",
          "clue": "I am a blank screen, you command me, I answer you.",
          "direction": "down",
          "startRow": 4,
          "startCol": 18,
          "number": 9,
          "wordLength": 8
        },
        {
          "word": "BOOLEAN",
          "clue": "True or False.",
          "direction": "across",
          "startRow": 5,
          "startCol": 14,
          "number": 10,
          "wordLength": 7
        },
        {
          "word": "CALCULUS",
          "clue": "I study the rates of change and accumulation, focusing on derivatives and integrals.",
          "direction": "across",
          "startRow": 6,
          "startCol": 5,
          "number": 11,
          "wordLength": 8
        },
        {
          "word": "ALGORITHM",
          "clue": "I am a step-by-step set of rules, guiding you to solve a problem efficiently. What am I?",
          "direction": "across",
          "startRow": 9,
          "startCol": 0,
          "number": 12,
          "wordLength": 9
        },
        {
          "word": "TECKZITE2025",
          "clue": "if (0.1 + 0.2 == 0.3):\n\t print('Teckzite2k25')\n else: \n\t print('Teckzite2025')",
          "direction": "down",
          "startRow": 9,
          "startCol": 6,
          "number": 13,
          "wordLength": 12
        },
        {
          "word": "GIT",
          "clue": "if (1==0?0:1){ \n                 print('Git');\n             } \n             else{\n                 print('Bit'); \n             }",
          "direction": "down",
          "startRow": 10,
          "startCol": 10,
          "number": 14,
          "wordLength": 3
        },
        {
          "word": "ARTIFICIAL",
          "clue": "I'm often man-made, but can resemble nature in many ways.",
          "direction": "down",
          "startRow": 10,
          "startCol": 13,
          "number": 15,
          "wordLength": 10
        },
        {
          "word": "SINA",
          "clue": "PHOTO",
          "direction": "down",
          "startRow": 10,
          "startCol": 22,
          "number": 16,
          "wordLength": 4
        },
        {
          "word": "COMPILER",
          "clue": "I take your code and turn it into something the computer can understand. What am I?",
          "direction": "across",
          "startRow": 11,
          "startCol": 6,
          "number": 17,
          "wordLength": 8
        },
        {
          "word": "INTERFACE",
          "clue": "I am like a contract—follow my rules, or you won’t compile!",
          "direction": "down",
          "startRow": 12,
          "startCol": 4,
          "number": 18,
          "wordLength": 9
        },
        {
          "word": "RECURSION",
          "clue": "I solve problems by breaking them into smaller copies of myself. What am I?",
          "direction": "down",
          "startRow": 13,
          "startCol": 8,
          "number": 19,
          "wordLength": 9
        },
        {
          "word": "THIS",
          "clue": "I refer to the current object in your code, but I’m not the object itself. What am I?",
          "direction": "across",
          "startRow": 13,
          "startCol": 11,
          "number": 20,
          "wordLength": 4
        },
        {
          "word": "KRUSKAL",
          "clue": "The algorithm that connects all points with the least cost, avoiding cycles.",
          "direction": "across",
          "startRow": 13,
          "startCol": 17,
          "number": 21,
          "wordLength": 7
        },
        {
          "word": "COMMENT",
          "clue": "I am a helpful guide to you but ignored by the computer during execution.",
          "direction": "across",
          "startRow": 15,
          "startCol": 0,
          "number": 22,
          "wordLength": 7
        },
        {
          "word": "VARIABLE",
          "clue": "Like a chameleon, I change my values based on the situation, adapting as needed. What am I?",
          "direction": "across",
          "startRow": 15,
          "startCol": 10,
          "number": 23,
          "wordLength": 8
        },
        {
          "word": "COOKIE",
          "clue": "The small data packet that remembers your preferences, often asking for your acceptance on websites.",
          "direction": "down",
          "startRow": 16,
          "startCol": 18,
          "number": 24,
          "wordLength": 6
        },
        {
          "word": "KIRCHHOFF",
          "clue": "The principle with two laws that ensure electrical currents and voltages stay balanced, never losing their way.",
          "direction": "across",
          "startRow": 17,
          "startCol": 12,
          "number": 25,
          "wordLength": 9
        },
        {
          "word": "ZERO",
          "clue": "Derivative of the function: f(x)= -(tan^2(x)-sec^2(x))",
          "direction": "down",
          "startRow": 19,
          "startCol": 2,
          "number": 26,
          "wordLength": 4
        },
        {
          "word": "QUEUE",
          "clue": "First in, first out.",
          "direction": "across",
          "startRow": 20,
          "startCol": 0,
          "number": 27,
          "wordLength": 5
        },
        {
          "word": "VECTOR",
          "clue": "I hold a series of values, each accessible only by its index or position.",
          "direction": "down",
          "startRow": 20,
          "startCol": 15,
          "number": 28,
          "wordLength": 6
        },
        {
          "word": "NULL",
          "clue": "I represent the absence of a value, but I'm not empty.",
          "direction": "across",
          "startRow": 21,
          "startCol": 8,
          "number": 29,
          "wordLength": 4
        },
        {
          "word": "EIGEN",
          "clue": "The hidden values in a matrix that reveal its true nature, often found through the magic of calculus.",
          "direction": "across",
          "startRow": 21,
          "startCol": 15,
          "number": 30,
          "wordLength": 5
        }
      ]
      
    });

    await newPuzzle.save();
    console.log('Puzzle saved successfully!');
  } catch (error) {
    console.error('Error saving puzzle:', error);
  } finally {
    mongoose.connection.close();
  }
}

addPuzzle();