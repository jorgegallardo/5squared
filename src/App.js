import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [numbers, setNumbers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameInSession, setGameInSession] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);

  const randomNumberGenerator = () => {
    const num = Math.floor(Math.random() * 10);
    return num;
  };

  const prepareGame = () => {
    const nums = [];
    for (let i = 0; i < 25; i++) {
      let randNum = randomNumberGenerator();
      nums.push({ answer: randNum, guess: undefined });
    }
    setNumbers(nums);
  };

  useEffect(() => {
    prepareGame();
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
    setGameInSession(true);
    setShowNumbers(true);
    timer(
      100, // in ms
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
  };

  return (
    <>
      <div>
        <h1 className={'float-start'}>5squared</h1>
        {gamePlayed && (
          <Button
            className={'float-end'}
            variant={!showNumbers ? 'outline-success' : 'outline-danger'}
            onClick={() => setShowNumbers(!showNumbers)}
            hidden={gameInSession}
            style={{ marginLeft: '5px' }}
          >
            {showNumbers ? 'hide numbers' : 'show numbers'}
          </Button>
        )}
        <Button
          className={'float-end'}
          variant="outline-dark"
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
          numbers.map((num, index) => (
            <section key={index}>
              <input
                id={`box${index}`}
                type="text"
                maxLength="1"
                onKeyDown={blockInvalidCharacters}
                className={'input-box'}
                autoFocus={index === 0}
                onChange={(event) => handleGuess(event, index)}
              ></input>
            </section>
          ))}
      </main>
      <ProgressBar
        max={20}
        now={timeLeft}
        variant="dark"
        style={{ borderRadius: 0, border: '1px solid #fff', height: '15px' }}
      />
    </>
  );
};

export default App;
