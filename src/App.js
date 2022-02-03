import { useEffect, useState } from 'react';
import { Nav, ProgressBar } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const App = () => {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [showNumbers, setShowNumbers] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

  const randomNumberGenerator = () => {
    const num = Math.floor(Math.random() * 10);
    return num;
  };

  useEffect(() => {
    let nums = [];
    for (let i = 0; i < 25; i++) {
      nums.push(randomNumberGenerator());
    }
    setRandomNumbers(nums);
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
    setShowNumbers(true);
    timer(
      20000, // in ms
      (timeLeft) => {
        setTimeLeft(timeLeft);
      },
      () => {
        setShowNumbers(false);
      }
    );
  };

  return (
    <>
      <div>
        <h1 className={'float-start'}>5squared</h1>
        <Button
          variant="outline-dark"
          onClick={handleStartGame}
          disabled={showNumbers}
          hidden={showNumbers}
          className={'float-end'}
        >
          start game
        </Button>
      </div>
      <></>
      <main>
        {!showNumbers &&
          randomNumbers.map((num, index) => <section key={index}></section>)}
        {showNumbers &&
          randomNumbers.map((num, index) => (
            <section key={index}>{num}</section>
          ))}
      </main>
      <ProgressBar
        max={20}
        now={timeLeft}
        variant="dark"
        style={{ borderRadius: 0, border: '1px solid #fff', height: '5px' }}
      />
    </>
  );
};

export default App;
