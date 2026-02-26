interface SceneLike {
  selectedActivityId?: string;
  abcMethod?: string;
  mediaLevel?: string;
  mediaFormat?: string;
  learningObjective?: string;
  interactionMoment?: string;
}

interface TopicLike {
  scenes?: SceneLike[];
}

interface UnitLike {
  topics?: TopicLike[];
}

interface ModuleLike {
  units?: UnitLike[];
}

interface SessionLike {
  modules?: ModuleLike[];
}

export interface ProjectMetrics {
  completionRate: number;
  totalScenes: number;
  interactiveObjects: number;
}

export function calculateProjectMetrics(structure: unknown): ProjectMetrics {
  const sessions = (Array.isArray(structure) ? structure : []) as SessionLike[];

  let totalScenes = 0;
  let interactiveObjects = 0;
  let completedScenes = 0;

  sessions.forEach((session) => {
    session.modules?.forEach((module) => {
      module.units?.forEach((unit) => {
        unit.topics?.forEach((topic) => {
          topic.scenes?.forEach((scene) => {
            totalScenes += 1;

            if (scene.selectedActivityId) {
              interactiveObjects += 1;
            }

            const isCompleted = Boolean(
              scene.selectedActivityId &&
                scene.abcMethod &&
                scene.mediaLevel &&
                scene.mediaFormat &&
                scene.learningObjective &&
                scene.interactionMoment,
            );

            if (isCompleted) {
              completedScenes += 1;
            }
          });
        });
      });
    });
  });

  const completionRate = totalScenes === 0 ? 0 : Math.round((completedScenes / totalScenes) * 100);

  return {
    completionRate,
    totalScenes,
    interactiveObjects,
  };
}

export function getStepProgress(completionRate: number): Record<string, number> {
  const steps = ['strategy', 'design', 'content', 'journey', 'production'];
  const stepSize = 100 / steps.length;

  return steps.reduce<Record<string, number>>((acc, step, index) => {
    const stepStart = stepSize * index;
    const stepProgress = Math.max(0, Math.min(100, ((completionRate - stepStart) / stepSize) * 100));
    acc[step] = Math.round(stepProgress);
    return acc;
  }, {});
}
