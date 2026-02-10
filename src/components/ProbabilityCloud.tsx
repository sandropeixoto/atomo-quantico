import React, { useEffect, useState } from 'react';
import cloud from 'd3-cloud';

// A interface para uma única entrada do diário, que agora corresponde à estrutura de GratitudeJournal
interface JournalEntry {
    text: string;
}

// As props que o componente ProbabilityCloud espera receber
interface ProbabilityCloudProps {
    entries: JournalEntry[];
}

// Propriedades de uma palavra após o cálculo do layout pelo d3-cloud
interface WordData extends cloud.Word {
    text?: string;
    size?: number;
    x?: number;
    y?: number;
    rotate?: number;
}

// Paleta de cores para a nuvem de palavras
const colors = ["#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

export function ProbabilityCloud({ entries }: ProbabilityCloudProps) {
    const [words, setWords] = useState<WordData[]>([]);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        if (!entries || entries.length === 0) {
            setStatus('empty');
            return;
        }

        // Processa as entradas para contar a frequência das palavras
        const wordCounts = entries.reduce<Record<string, number>>((acc, entry) => {
            // Corrigido: usa entry.text em vez de entry.content
            const cleanedText = entry.text.replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").replace(/\s{2,}/g, " ");
            const wordsInEntry = cleanedText.toLowerCase().split(/\s+/);

            wordsInEntry.filter(word => word.length > 2).forEach(word => {
                acc[word] = (acc[word] || 0) + 1;
            });
            return acc;
        }, {});

        const data = Object.keys(wordCounts).map(key => ({
            text: key,
            value: wordCounts[key] * 10, // Pondera o valor para o tamanho da fonte
        }));

        if (data.length === 0) {
            setStatus('empty');
            return;
        }

        setStatus('loading');
        const layout = cloud()
            .size([500, 300])
            .words(data.map(d => ({ text: d.text, size: d.value })))
            .padding(5)
            .rotate(() => (~~(Math.random() * 6) - 3) * 30)
            .font("Impact")
            .fontSize(d => d.size || 10)
            .on("end", (layoutWords: WordData[]) => {
                setWords(layoutWords);
                setStatus('success');
            });

        layout.start();
    }, [entries]);

    if (status === 'empty') {
        return <p className="text-center text-text-secondary">Escreva em seu diário para ver sua nuvem de palavras tomar forma!</p>;
    }

    if (status === 'loading') {
        return <p className="text-center text-text-secondary">Gerando sua nuvem de gratidão...</p>;
    }

    return (
        <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
            <svg width="100%" viewBox={`0 0 500 300`}>
                <g transform={`translate(250,150)`}>
                    {words.map((word, i) => (
                        <text
                            key={word.text}
                            fontFamily={word.font || 'Impact'}
                            fontSize={word.size}
                            fill={colors[i % colors.length]}
                            textAnchor="middle"
                            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotate})`}
                            className="hover:opacity-80 transition-opacity"
                            style={{ cursor: 'pointer' }}
                        >
                            {word.text}
                        </text>
                    ))}
                </g>
            </svg>
        </div>
    );
}
