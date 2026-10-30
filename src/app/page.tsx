import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';

interface Word {
  id: string;
  greek_word: string;
  transliteration: string;
  translation_sv: string;
  translation_en: string;
  part_of_speech: string;
  frequency: number;
}

// Komponent som hämtar orden från Supabase
async function WordList() {
  const { data: words, error } = await supabase
    .from('words')
    .select('*')
    .order('frequency', { ascending: false });

  if (error) {
    console.error('Kunde inte hämta ord:', error);
    return <p className="text-red-500">Kunde inte ladda ord från databasen.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {words && words.map((word: Word) => (
        <div 
          key={word.id} 
          className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-3"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {word.part_of_speech}
            </span>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {word.greek_word}
            </h3>
            <p className="text-sm text-slate-400 italic">
              /{word.transliteration}/
            </p>
          </div>

          <div className="border-t pt-2 text-sm space-y-1">
            <p className="text-slate-700 font-medium">🇸🇪 {word.translation_sv}</p>
            <p className="text-slate-500">🇬🇧 {word.translation_en}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Huvudsida
export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b pb-4">
          <h1 className="text-4xl font-bold tracking-tight text-indigo-900">Glosso</h1>
          <p className="text-slate-600 mt-2">
            Biblisk grekiska &bull; Kapitelbaserad vokabulär och läsare
          </p>
        </header>

        {/* Gloslista inbäddad i Suspense */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Kapitel 1: Ordlista</h2>
          
          <Suspense fallback={<p className="text-slate-400">Laddar glosor...</p>}>
            <WordList />
          </Suspense>
        </section>

      </div>
    </main>
  );
}