'use client';

import debounce from 'lodash.debounce';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { toast } from 'sonner';

import { saveProject, type DashboardProject } from '@/app/(dashboard)/projects/actions';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export interface ProjectState {
  id: string;
  orgId: string;
  title: string;
  strategy: Record<string, unknown>;
  structure: unknown[];
  syllabusBlueprint: Record<string, unknown> | null;
  completionRate: number;
  totalScenes: number;
  interactiveObjects: number;
}

interface ProjectContextValue {
  project: ProjectState;
  saveState: SaveState;
  updateProject: (partial: Partial<Omit<ProjectState, 'id' | 'orgId'>>) => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

interface ProjectProviderProps {
  children: ReactNode;
  initialProject: DashboardProject;
}

function mapDbProject(project: DashboardProject): ProjectState {
  return {
    id: project.id,
    orgId: project.org_id,
    title: project.title,
    strategy: project.strategy ?? {},
    structure: Array.isArray(project.structure) ? project.structure : [],
    syllabusBlueprint: project.syllabus_blueprint ?? null,
    completionRate: project.completion_rate ?? 0,
    totalScenes: project.total_scenes ?? 0,
    interactiveObjects: project.interactive_objects ?? 0,
  };
}

export function ProjectProvider({ children, initialProject }: ProjectProviderProps) {
  const [project, setProject] = useState<ProjectState>(() => mapDbProject(initialProject));
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const lastSuccessToastAt = useRef<number>(0);

  const persistProject = useCallback(async (nextProject: ProjectState) => {
    const result = await saveProject(nextProject.id, {
      strategy: nextProject.strategy,
      structure: nextProject.structure,
      syllabusBlueprint: nextProject.syllabusBlueprint,
    });

    if (!result.success) {
      setSaveState('error');
      toast.error(result.error ?? 'No se pudo auto-guardar el proyecto.');
      return;
    }

    setSaveState('saved');

    const now = Date.now();
    if (now - lastSuccessToastAt.current > 5000) {
      toast.success('Proyecto guardado');
      lastSuccessToastAt.current = now;
    }
  }, []);

  const debouncedPersist = useMemo(
    () =>
      debounce((nextProject: ProjectState) => {
        void persistProject(nextProject);
      }, 800),
    [persistProject],
  );

  useEffect(() => {
    return () => {
      debouncedPersist.cancel();
    };
  }, [debouncedPersist]);

  const updateProject = useCallback(
    (partial: Partial<Omit<ProjectState, 'id' | 'orgId'>>) => {
      setProject((prev) => {
        const nextProject = {
          ...prev,
          ...partial,
        };

        setSaveState('saving');
        debouncedPersist(nextProject);
        return nextProject;
      });
    },
    [debouncedPersist],
  );

  const value = useMemo(
    () => ({
      project,
      saveState,
      updateProject,
    }),
    [project, saveState, updateProject],
  );

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjectContext() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }

  return context;
}
