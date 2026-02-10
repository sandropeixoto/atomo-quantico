import { useEffect, useState } from 'react';
import { Wordcloud } from '@visx/wordcloud';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../contexts/AuthContext';

interface WordData {
  text: string;
  value: number;
}

// Lista de stopwords para filtrar palavras comuns
const stopwords = new Set([
    'a', 'o', 'e', 'ou', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'com', 'por', 'para', 
    'pelo', 'pela', 'pelos', 'pelas', 'que', 'eu', 'você', 'ele', 'ela', 'nós', 'vocês', 'eles', 'elas', 
    'meu', 'minha', 'meus', 'minhas', 'seu', 'sua', 'seus', 'suas', 'um', 'uma', 'uns', 'umas', 'estou', 'sou', 'fui'
]);

const processText = (text: string): WordData[] => {
    const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
    const wordFrequencies: { [key: string]: number } = {};

    for (const word of words) {
        if (!stopwords.has(word) && word.length > 2) { // Filtra palavras curtas
            wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
        }
    }

    return Object.entries(wordFrequencies).map(([text, value]) => ({ text, value }));
};

export function ProbabilityCloud() {
    const [words, setWords] = useState<WordData[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEntries = async () => {
            if (!user) return;
            const q = query(collection(db, 'entries'), where('authorId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const allText = querySnapshot.docs.map(doc => doc.data().text).join(' ');
            setWords(processText(allText));
        };

        fetchEntries();
    }, [user]);

    if (words.length === 0) {
        return <p className="text-center text-text-secondary">Comece a escrever no seu diário para ver sua nuvem de palavras!</p>;
    }

    return (
        <div className="w-full h-64 bg-primary rounded-xl shadow-lg flex items-center justify-center">
            <Wordcloud
                words={words}
                width={500}
                height={250}
                fontSize={(word: WordData) => Math.sqrt(word.value) * 15} // Escala o tamanho da fonte
                font={'Arial'}
                padding={2}
                spiral="archimedean"
                rotate={0} // Mantém as palavras na horizontal
            >
                {(cloudWords) =>
                    cloudWords.map((w, i) => (
                        <text
                            key={w.text! + i}
                            fontSize={w.size}
                            fontFamily={w.font}
                            x={w.x}
                            y={w.y}
                            fill={"#a855f7"} // Cor roxa, alinhada à identidade visual
                            textAnchor="middle"
                            transform={`translate(${w.x}, ${w.y})`}
                        >
                            {w.text}
                        </text>
                    ))
                }
            </Wordcloud>
        </div>
    );
}
