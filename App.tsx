import React, { useState, useEffect, useCallback } from 'react';
import { generateQuizQuestions } from './services/geminiService';
import { QuizQuestion, Continent, GameState } from './types';
import { Button } from './components/Button';
import { FlagCard } from './components/FlagCard';
import { Globe, RefreshCw, Trophy, Star, AlertCircle, ArrowRight, Play } from 'lucide-react';

// Continents configuration
const CONTINENTS: { name: Continent; color: string; icon: string }[] = [
  { name: 'Europa', color: 'bg-blue-100 border-blue-400 text-blue-800', icon: '🌍' },
  { name: 'Afrika', color: 'bg-yellow-100 border-yellow-400 text-yellow-800', icon: '🦁' },
  { name: 'Asien', color: 'bg-red-100 border-red-400 text-red-800', icon: '🏮' },
  { name: 'Amerika', color: 'bg-green-100 border-green-400 text-green-800', icon: '🌎' },
  { name: 'Oceanien', color: 'bg-purple-100 border-purple-400 text-purple-800', icon: '🦘' },
];

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  
  // Quiz State
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Start Quiz Handler
  const startQuiz = async (continent: Continent) => {
    setSelectedContinent(continent);
    setGameState('loading');
    setScore(0);
    setCurrentQuestionIndex(0);
    try {
      const qs = await generateQuizQuestions(continent);
      setQuestions(qs);
      setGameState('quiz');
    } catch (error) {
      console.error(error);
      setGameState('error');
    }
  };

  // Shuffle options when question changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQ = questions[currentQuestionIndex];
      const allOptions = [currentQ.correctCode, ...currentQ.wrongCodes];
      // Shuffle array
      setShuffledOptions(allOptions.sort(() => Math.random() - 0.5));
      setHasAnswered(false);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  }, [questions, currentQuestionIndex]);

  // Answer Handler
  const handleAnswer = (code: string) => {
    if (hasAnswered) return;

    setHasAnswered(true);
    setSelectedOption(code);
    const correct = code === questions[currentQuestionIndex].correctCode;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
    }
  };

  // Next Question
  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameState('result');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Render Start Screen
  if (gameState === 'start') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-bounce">
          <h1 className="text-5xl md:text-6xl font-black text-kid-blue drop-shadow-sm tracking-wide mb-2">
            FlagFun
          </h1>
          <p className="text-xl text-gray-600 font-bold">Verdens Flag Quiz</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-200 w-full">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Vælg et kontinent for at starte:</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTINENTS.map((c) => (
              <button
                key={c.name}
                onClick={() => startQuiz(c.name)}
                className={`
                  ${c.color} border-4 p-6 rounded-2xl flex items-center justify-between
                  text-2xl font-bold shadow-sm hover:scale-[1.02] hover:shadow-md transition-all
                  active:scale-95
                `}
              >
                <span>{c.name}</span>
                <span className="text-4xl">{c.icon}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-gray-500 text-sm font-semibold flex items-center gap-2">
           <Globe size={16} /> Lær geografi gennem leg!
        </div>
      </div>
    );
  }

  // Render Loading Screen
  if (gameState === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-kid-blue/10">
        <div className="animate-spin text-kid-blue mb-6">
          <RefreshCw size={64} />
        </div>
        <h2 className="text-3xl font-bold text-kid-purple mb-2">Henter flag...</h2>
        <p className="text-lg text-gray-600">Gør dig klar til {selectedContinent}!</p>
      </div>
    );
  }

  // Render Error Screen
  if (gameState === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="text-kid-pink mb-4">
          <AlertCircle size={80} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ups! Noget gik galt.</h2>
        <p className="mb-8 text-xl text-gray-600">Vi kunne ikke hente quizzen lige nu. Tjek din internetforbindelse eller API nøgle.</p>
        <Button onClick={() => setGameState('start')} variant="primary" size="lg">
          Prøv igen
        </Button>
      </div>
    );
  }

  // Render Result Screen
  if (gameState === 'result') {
    const isPerfect = score === questions.length;
    const isGood = score >= questions.length / 2;
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-gray-200 max-w-md w-full text-center pop-in">
          
          <div className="flex justify-center mb-6">
             {isPerfect ? (
                <div className="bg-yellow-100 p-6 rounded-full text-yellow-500 animate-bounce">
                  <Trophy size={64} fill="currentColor" />
                </div>
             ) : (
                <div className="bg-blue-100 p-6 rounded-full text-kid-blue">
                  <Star size={64} fill="currentColor" />
                </div>
             )}
          </div>

          <h2 className="text-4xl font-black text-gray-800 mb-2">
            {isPerfect ? "Fantastisk!" : isGood ? "Godt gået!" : "Flot forsøg!"}
          </h2>
          
          <p className="text-xl text-gray-600 mb-8">
            Du fik <span className="text-3xl font-bold text-kid-purple">{score}</span> ud af {questions.length} rigtige!
          </p>

          <div className="space-y-4">
            <Button onClick={() => startQuiz(selectedContinent!)} variant="success" size="lg" className="w-full">
              <RefreshCw className="mr-2" /> Spil igen
            </Button>
            <Button onClick={() => setGameState('start')} variant="secondary" size="lg" className="w-full">
              <Globe className="mr-2" /> Vælg nyt kontinent
            </Button>
          </div>

        </div>
      </div>
    );
  }

  // Render Quiz Screen
  if (gameState === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="min-h-screen flex flex-col items-center py-6 px-4 max-w-3xl mx-auto">
        
        {/* Header with progress */}
        <div className="w-full flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border-2 border-gray-100">
           <div className="flex items-center gap-2">
             <span className="bg-kid-yellow text-yellow-900 font-bold px-3 py-1 rounded-lg text-sm">
                SCORE: {score}
             </span>
           </div>
           <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
             <div 
               className="h-full bg-kid-green transition-all duration-500 ease-out"
               style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
             />
           </div>
           <div className="font-bold text-gray-500 text-sm">
             {currentQuestionIndex + 1}/{questions.length}
           </div>
        </div>

        {/* Question Card */}
        <div className="w-full mb-8 text-center space-y-2">
          <h3 className="text-2xl text-gray-500 font-medium">Hvilket flag tilhører</h3>
          <h1 className="text-5xl font-black text-kid-blue drop-shadow-sm wiggle cursor-default inline-block">
            {currentQuestion.countryName}?
          </h1>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4 w-full md:gap-6 mb-8">
          {shuffledOptions.map((isoCode) => {
            let status: 'default' | 'correct' | 'wrong' | 'dimmed' = 'default';

            if (hasAnswered) {
              if (isoCode === currentQuestion.correctCode) {
                status = 'correct'; // Always highlight the correct one
              } else if (isoCode === selectedOption && selectedOption !== currentQuestion.correctCode) {
                status = 'wrong'; // Highlight the wrong selection
              } else {
                status = 'dimmed'; // Dim others
              }
            }

            return (
              <FlagCard
                key={isoCode}
                isoCode={isoCode}
                status={status}
                disabled={hasAnswered}
                onClick={() => handleAnswer(isoCode)}
              />
            );
          })}
        </div>

        {/* Feedback / Next Button Area */}
        <div className="h-20 w-full flex items-center justify-center">
          {hasAnswered && (
             <div className="w-full animate-bounce">
                <Button 
                  onClick={nextQuestion} 
                  variant={isCorrect ? 'success' : 'primary'}
                  size="lg"
                  className="w-full max-w-md mx-auto shadow-xl"
                >
                  {isCorrect ? 'Rigtigt! Næste' : 'Se næste'} <ArrowRight className="ml-2" />
                </Button>
             </div>
          )}
        </div>

      </div>
    );
  }

  return null;
}