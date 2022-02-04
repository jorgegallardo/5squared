import { useEffect, useState } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameInSession, setGameInSession] = useState(false);
  const [gamePlayed, setGamePlayed] = useState(false);

  const randomNumberGenerator = () => {
    const num = Math.floor(Math.random() * 10);
    return num;
  };

  const prepareGame = () => {
    let nums = [];
    for (let i = 0; i < 25; i++) {
      nums.push(randomNumberGenerator());
    }
    setRandomNumbers(nums);
  };

  useEffect(() => {
    prepareGame();
  }, []);

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
      1000, // in ms
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
          randomNumbers.map((num, index) => <section key={index}></section>)}

        {/* in game: numbers showing */}
        {showNumbers &&
          randomNumbers.map((num, index) => (
            <section key={index}>{num}</section>
          ))}

        {/* in game: guessing time */}
        {!showNumbers &&
          gamePlayed &&
          randomNumbers.map((num, index) => (
            <section key={index}>
              <input
                type="number"
                className={'input-box'}
                autoFocus={index === 0}
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
