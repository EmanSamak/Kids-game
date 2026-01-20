export type Continent = 'Afrika' | 'Europa' | 'Asien' | 'Amerika' | 'Oceanien';

export interface QuizQuestion {
  countryName: string;
  correctCode: string; // ISO 3166-1 alpha-2 code (e.g., 'dk', 'us')
  wrongCodes: string[];
}

export type GameState = 'start' | 'loading' | 'quiz' | 'result' | 'error';

export interface QuizResult {
  totalQuestions: number;
  score: number;
}
