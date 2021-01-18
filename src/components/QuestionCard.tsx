import React from 'react';
import {AnswersState} from '../App';
//SCSS
import './QuestionCard.scss';

type Props={
        question: string; 
        answers: string[];
        checkAnswerFunction: (e: React.MouseEvent<HTMLButtonElement>)=>void;
        userAnswer: AnswersState | undefined; 
        questionNr:number;
        totalQuestions:number; 
}

//In there is a generic type called FC that allows us 
//to type our function components

const QuestionCard = ({
        question,
        answers,
        checkAnswerFunction,
        userAnswer,
        questionNr, 
        totalQuestions}: Props) => {
                console.log(userAnswer);
        return(
        <div>
            <p className='quiz-questionNr'>
                  Question: {questionNr} | {totalQuestions}  
            </p>
            {/* If in React if you have to set HTML programmatically  */}
            {/* or from an external source, you would have to use  */}
            {/* dangerouslySetInnerHTML */}
            {/* While using dangerouslySetInnerHTML,  */}
            {/* you will have to pass an object with a __html key. */}
            <div className='questions-wrapper'>
            <p  className='quiz-question' dangerouslySetInnerHTML={{__html: (question)}}></p>
                <div>
                {answers.map(answer=>{
                        return(
                        <div key={answer}>
                        {/* if we have userAnswer we disable the other buttons */}
                         <button disabled={userAnswer? true: false}
                        className={userAnswer !== undefined && answer === userAnswer.correctAnswer
                                ? 'questions-btn correct': "questions-btn false"}
                         value={answer}
                         onClick={checkAnswerFunction}>
                                <span dangerouslySetInnerHTML={{__html:(answer)}}></span>   
                        </button>
                        </div>
                        )
                })}
                </div>
            </div>
        </div>
        ) 
}


export default QuestionCard;
