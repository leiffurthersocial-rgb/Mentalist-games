// Room Recall — study a described scene for a set time, then answer
// multiple-choice questions about its details.

import { useState } from 'react';
import { ModuleShell } from '../../components/ModuleShell';
import { Button, Panel, ScoreBanner, Stat } from '../../components/ui';
import { TimerRing } from '../../components/TimerRing';
import { useApp } from '../../context/AppState';
import { useCountdown } from '../../lib/useCountdown';
import { getModule } from '../../lib/registry';
import { normalizeScore } from '../../lib/scoring';
import { ScoreMeaning } from '../../components/ScoreMeaning';
import { cx } from '../../lib/utils';
import { generateScene, Scene } from './scene';

const META = getModule('room-recall')!;
type Phase = 'idle' | 'study' | 'quiz' | 'result';

export default function RoomRecall() {
  const { recordSession, getSetting, setSetting } = useApp();
  const studyTime = getSetting('room-recall', 'studyTime', 25) as number;

  const [phase, setPhase] = useState<Phase>('idle');
  const [scene, setScene] = useState<Scene>(() => generateScene());
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startedAt, setStartedAt] = useState(0);

  const timer = useCountdown(() => setPhase('quiz'));

  function begin() {
    setScene(generateScene());
    setAnswers({});
    setStartedAt(Date.now());
    setPhase('study');
    timer.start(studyTime);
  }

  const correctCount = scene.questions.filter((q, i) => answers[i] === q.answer).length;
  const score = normalizeScore('room-recall', correctCount / scene.questions.length);

  function finish() {
    setPhase('result');
    recordSession('room-recall', score, Date.now() - startedAt, {
      questions: scene.questions.length,
    });
  }

  return (
    <ModuleShell meta={META}>
      {phase === 'idle' && (
        <div className="space-y-6">
          <Panel className="p-5">
            <label className="mb-2 block text-sm font-medium">Study time: {studyTime}s</label>
            <input
              type="range"
              min={10}
              max={45}
              step={5}
              value={studyTime}
              onChange={(e) => setSetting('room-recall', 'studyTime', Number(e.target.value))}
              className="w-full"
            />
            <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
              A room will be described for {studyTime} seconds. Observe everything — counts,
              colours, positions — then answer six questions from memory.
            </p>
          </Panel>
          <div className="flex justify-center">
            <Button size="lg" onClick={begin}>
              Enter the room
            </Button>
          </div>
        </div>
      )}

      {phase === 'study' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-500 dark:text-ink-400">Observe the scene…</p>
            <TimerRing remaining={timer.remaining} total={studyTime} />
          </div>
          <Panel className="p-6">
            <div className="mb-4 flex justify-center gap-2 text-4xl">
              {scene.tableObjects.map((o, i) => (
                <span key={i}>{o}</span>
              ))}
            </div>
            <ul className="space-y-2 text-base leading-relaxed text-ink-700 dark:text-ink-200">
              {scene.lines.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brass-500">·</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setPhase('quiz')}>
              I've memorised it →
            </Button>
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div className="space-y-5">
          <p className="text-sm text-ink-500 dark:text-ink-400">Answer from memory:</p>
          {scene.questions.map((q, i) => (
            <Panel key={i} className="p-4">
              <p className="mb-3 font-medium">{q.prompt}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: opt }))}
                    aria-pressed={answers[i] === opt}
                    className={cx(
                      'rounded-lg border px-3 py-2 text-sm transition-colors',
                      answers[i] === opt
                        ? 'border-brass-500 bg-brass-500/10'
                        : 'border-ink-200 hover:border-ink-300 dark:border-ink-800 dark:hover:border-ink-700',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Panel>
          ))}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={finish}
              disabled={Object.keys(answers).length < scene.questions.length}
            >
              Submit answers
            </Button>
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="space-y-6">
          <Panel className="p-6">
            <ScoreBanner
              score={score}
              detail={
                <Stat value={`${correctCount}/${scene.questions.length}`} label="correct" />
              }
            />
            <ScoreMeaning moduleId="room-recall" score={score} />
          </Panel>
          <Panel className="p-5">
            <h3 className="mb-3 text-sm font-medium text-ink-500 dark:text-ink-400">Review</h3>
            <ul className="space-y-3">
              {scene.questions.map((q, i) => {
                const ok = answers[i] === q.answer;
                return (
                  <li key={i} className="text-sm">
                    <div className="flex items-start gap-2">
                      <span className={ok ? 'text-emerald-500' : 'text-red-500'}>
                        {ok ? '✓' : '✗'}
                      </span>
                      <div>
                        <div className="text-ink-700 dark:text-ink-200">{q.prompt}</div>
                        {!ok && (
                          <div className="text-xs text-ink-500 dark:text-ink-400">
                            You said <span className="line-through">{answers[i]}</span> · answer:{' '}
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {q.answer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <div className="flex justify-center">
            <Button onClick={begin}>New room</Button>
          </div>
        </div>
      )}
    </ModuleShell>
  );
}
