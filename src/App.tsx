import React, { useState, useEffect } from 'react';
import {fetchQuiz} from './API';
//components
import QuestionCard from './components/QuestionCard'
//types
import {QuestionsState} from './API';
//SCSS
import './App.scss';


export type AnswersState={
  question: string; 
  answer: string; 
  correct: boolean; 
  correctAnswer: string;
}

function App() {
  const [loading, setLoading]= useState(false); 
  const [questions,setQuestions]= useState<QuestionsState[]>([]);
  const [number,setNumber]= useState(0);
  const[userAnswers, setUserAnswers]= useState<AnswersState[]>([{
    question: '',
    answer: '' ,
    correct: false ,
    correctAnswer: ''
  }]);
  const [score,setScore]= useState(0); 
  const [gameOver, setGameOver] = useState(true);
  const [parameters, setParameters] = useState({
    numberQuestions: 1, 
    userLevel: '',
  });
  

  const levelQuiz = (event: React.ChangeEvent<HTMLSelectElement>) =>{
    const targetLevel=event.currentTarget.value;
    setParameters({...parameters, userLevel:targetLevel });
  }

  const numberQuiz = (event: React.ChangeEvent<HTMLSelectElement>) =>{
    const targetNumber = +event.currentTarget.value;
    setParameters({...parameters, numberQuestions: targetNumber });
  }

  const fetchData= async()=>{
    try{
    const newQuestions = await fetchQuiz(parameters.numberQuestions, parameters.userLevel);
    setQuestions(newQuestions);
    } catch(err){
      console.log("error:",err)
    };
  }

  useEffect(()=>{
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData()},[gameOver] );


  const handleSubmit = (event: any) =>{
    event.preventDefault();
    //when we start we initiate the fetch
    setLoading(true); 
    //and we do not have a game over 
    setGameOver(false);
    setScore(0); 
    setUserAnswers([]); 
    setNumber(0); 
    setLoading(false);
  }

  const checkAnswer =(e: React.MouseEvent<HTMLButtonElement>)=>{
     if(!gameOver){
       //user answer
       //currentTarget is the element that the event is attached to. 
       const answer = e.currentTarget.value; 
        //check if the answer is correct
        const correct = questions[number].correct_answer === answer;
        //add score if answer is correct
        if(correct){
          setScore(prevScore => prevScore+1);
        }
        //save answer in the userAnswers
        const answersState = {
          question: questions[number].question,
          answer: answer, 
          correct: correct,
          correctAnswer: questions[number].correct_answer,
        }
        setUserAnswers(prevState => [...prevState, answersState]);
      }
     
  }

  const nextQuestion = () =>{
    //move on to the next questions if not the last question
    const nextQuestion = number + 1;
    if(userAnswers.length === parameters.numberQuestions){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }
  }

  const playAgain =() =>{
     //and we do not have a game over 
     setGameOver(true);
     setParameters({...parameters, numberQuestions:1,  userLevel: ''});
  }


  return (
    <div className="App">
      <h1 className='quiz-title'>Quiz</h1>
    {gameOver ?
    (<form className='quiz-form' onSubmit={handleSubmit}>
      <label>
        Choose the level: 
      </label>
      <select className='quiz-level' value={parameters.userLevel} onChange={levelQuiz}>
        <option value="">---</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Difficult</option>
      </select>
      <label>
        Choose the # of questions: 
      </label>
      <select className='quiz-number' value={parameters.numberQuestions} onChange={numberQuiz}>
        <option value="">---</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
        </select>
      <button className='start btn' type='submit'>START</button>
    </form>) : null}
     {!gameOver? <p className='level'>Level: {parameters.userLevel.toUpperCase()}</p> : null}
      {!gameOver? <p className={score%2? 'score-even': 'score-odd'}>Score: {score}</p> : null}
      {loading ? <p>Loding Questions<span>...</span></p> : null }
      {!loading && !gameOver? 
      <QuestionCard 
      totalQuestions={parameters.numberQuestions}
      question={questions[number].question}
      answers={questions[number].answers}
      userAnswer={userAnswers? userAnswers[number] : undefined}
      checkAnswerFunction={checkAnswer}
      questionNr={number + 1}
      /> 
      : null}
     {!gameOver && !loading && 
     userAnswers.length === number+1 && number !== (parameters.numberQuestions -1) ?
     <button className='next btn' onClick={nextQuestion}>NEXT</button> :
     null
     }

  {!gameOver && !loading && userAnswers.length === (parameters.numberQuestions) ?
    <button className='next btn' onClick={playAgain}>PLAY AGAIN</button> :
    null
    }
    </div>  
  );
}

export default App;


// https://opentdb.com/api.php?amount=10&type=multiple
//www.youtube.com/watch?v=QO4NXhWo_NM 
//www.youtube.com/watch?v=XO77Fib9tSI