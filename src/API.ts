import {shuffleArray} from './randomShuffle';

export type Question ={
    category: string; 
    correct_answer: string; 
    difficulty: string; 
    incorrect_answers: string[]; 
    question: string; 
    type: string; 
}

export type QuestionsState = Question & {answers: string[]};



export const fetchQuiz = async(amount:number, difficulty: string) =>{
    const endpoint=
    `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;

    //Here we need to awaits because the first one waits for the fetch
    //fetch return a promise, but with await we get the response
    //the second waits for the JSON conversion.
        const data = await((fetch(endpoint))
        .then (response => response.json())
        .catch(error => console.log("error:", error)));
    
    return(data.results.map((question: Question)=>{
        return {...question, answers: shuffleArray([...question.incorrect_answers, question.correct_answer])};
    }));
}; 