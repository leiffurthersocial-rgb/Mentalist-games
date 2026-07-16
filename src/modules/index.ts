// Maps each module id to its lazily-loaded component. Adding a module means
// adding its metadata to lib/registry.ts and one line here.

import { lazy } from 'react';
import type { LazyExoticComponent } from 'react';
import { ModuleId } from '../types';

type ModuleComponent = LazyExoticComponent<() => JSX.Element>;

export const MODULE_COMPONENTS: Record<ModuleId, ModuleComponent> = {
  'kims-game': lazy(() => import('./kims-game/KimsGame')),
  'room-recall': lazy(() => import('./room-recall/RoomRecall')),
  'memory-palace': lazy(() => import('./memory-palace/MemoryPalace')),
  'calibration-journal': lazy(() => import('./calibration-journal/CalibrationJournal')),
  'emotion-reader': lazy(() => import('./emotion-reader/EmotionReader')),
  'cold-reading': lazy(() => import('./cold-reading/ColdReading')),
  'abductive-puzzles': lazy(() => import('./abductive-puzzles/AbductivePuzzles')),
  'deduction-drills': lazy(() => import('./deduction-drills/DeductionDrills')),
  'number-memory': lazy(() => import('./number-memory/NumberMemory')),
  'speed-matrix': lazy(() => import('./speed-matrix/SpeedMatrix')),
  'fermi-estimation': lazy(() => import('./fermi-estimation/FermiEstimation')),
  'lie-spotter': lazy(() => import('./lie-spotter/LieSpotter')),
  'pattern-sequences': lazy(() => import('./pattern-sequences/PatternSequences')),
  'n-back': lazy(() => import('./n-back/NBack')),
  'syllogisms': lazy(() => import('./syllogisms/Syllogisms')),
  'analogies': lazy(() => import('./analogies/Analogies')),
  'mental-math': lazy(() => import('./mental-math/MentalMath')),
};
