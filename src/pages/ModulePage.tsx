// Resolves the :moduleId route param to the correct lazily-loaded module.

import { Suspense } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { MODULE_COMPONENTS } from '../modules';
import { getModule } from '../lib/registry';
import { ModuleId } from '../types';

function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-ink-400">
      <span className="animate-pulse">Loading…</span>
    </div>
  );
}

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const meta = moduleId ? getModule(moduleId) : undefined;

  if (!meta) return <Navigate to="/" replace />;

  const Component = MODULE_COMPONENTS[meta.id as ModuleId];
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}
