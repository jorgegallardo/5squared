import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameInSession, setGameInSession] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);
  const [allBoxesContainGuess, setAllBoxesContainGuess] = useState(false);

  const randomNumberGenerator = () => {
    const num = Math.floor(Math.random() * 10);
    return num;
  };

  const prepareGame = () => {
    const nums = [];
    for (let i = 0; i < 25; i++) {
      let randNum = randomNumberGenerator();
      nums.push({ answer: randNum, guess: null, match: null });
    }
    setNumbers(nums);
  };

  useEffect(() => {
    prepareGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const blockInvalidCharacters = (e) => {
    return isNaN(e.key) && e.preventDefault();
    //return ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
  };

  const timer = (time, update, complete) => {
    var start = new Date().getTime();
    var interval = setInterval(() => {
      var now = time - (new Date().getTime() - start);
      if (now <= 0) {
        clearInterval(interval);
        complete();
      } else update(Math.floor(now / 1000));
    }, 100);
  };

  const handleStartGame = () => {
    if (gamePlayed) prepareGame();
    setAllBoxesContainGuess(false);
    setGameInSession(true);
    setShowNumbers(true);
    timer(
      20000, // in ms
      (timeLeft) => {
        setTimeLeft(timeLeft);
      },
      () => {
        setGameInSession(false);
        setShowNumbers(false);
        setGamePlayed(true);
      }
    );
  };

  const handleGuess = (event, index) => {
    let guess = +event.target.value;
    let numbersCopy = [...numbers];
    numbersCopy[index].guess = guess;
    setNumbers(numbersCopy);
    if (index < 24) document.getElementById(`box${index + 1}`).focus();
    if (index === 24) document.getElementById(`box${index}`).blur();
    // check that all boxes are filled. if not, return.
    for (let i = 0; i < 25; i++) {
      if (numbersCopy[i].guess === null) {
        return;
      }
    }
    // all boxes contain a guess
    setAllBoxesContainGuess(true);
    checkAnswers();
  };

  const checkAnswers = () => {
    for (let i = 0; i < 25; i++) {
      if (numbers[i].answer === numbers[i].guess) {
        numbers[i].match = true;
      }
    }
    console.log(numbers); // for debugging
  };

  return (
    <>
      <div>
        <h1 className={'float-start'}>5squared</h1>

        <Button
          className={'float-end'}
          variant='outline-dark'
          onClick={handleStartGame}
          hidden={gameInSession}
        >
          {gamePlayed ? 'new game' : 'start game'}
        </Button>
      </div>

      <main>
        {/* default grid */}
        {!showNumbers &&
          !gamePlayed &&
          numbers.map((num, index) => <section key={index}></section>)}

        {/* in game: numbers showing */}
        {showNumbers &&
          numbers.map((num, index) => (
            <section key={index}>{num.answer}</section>
          ))}

        {/* in game: guessing time */}
        {!showNumbers &&
          gamePlayed &&
          !allBoxesContainGuess &&
          numbers.map((num, index) => (
            <section key={index}>
              <input
                id={`box${index}`}
                type='text'
                maxLength='1'
                onKeyDown={blockInvalidCharacters}
                className={'input-box'}
                autoFocus={index === 0}
                onChange={(event) => handleGuess(event, index)}
              ></input>
            </section>
          ))}

        {/* game over: results */}
        {!showNumbers &&
          gamePlayed &&
          allBoxesContainGuess &&
          numbers.map((num, index) => (
            <section
              key={index}
              className={numbers[index].match ? 'correct-box' : 'incorrect-box'}
            >
              <input
                id={`box${index}`}
                type='text'
                className={'input-box'}
                value={numbers[index].guess}
                readOnly
              ></input>
            </section>
          ))}
      </main>
      <ProgressBar
        max={20}
        now={timeLeft}
        variant='dark'
        style={{ borderRadius: 0, border: '1px solid #fff', height: '15px' }}
      />
    </>
  );
};

export default App;
