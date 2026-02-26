import type { Session } from '@/types';

export type ProjectTemplateKey = 'onboarding' | 'workshop' | 'elearning';

interface TemplateSession {
  title: string;
  modules: Array<{
    title: string;
    units: Array<{
      title: string;
      topics: Array<{
        title: string;
        scenes: Array<{
          title: string;
          durationMinutes: number;
        }>;
      }>;
    }>;
  }>;
}

interface ProjectTemplate {
  key: ProjectTemplateKey;
  title: string;
  description: string;
  sessions: TemplateSession[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    key: 'onboarding',
    title: 'Programa de Onboarding',
    description: 'Estructura base de 2 sesiones para incorporacion inicial.',
    sessions: [
      {
        title: 'Sesion 1: Cultura y Contexto',
        modules: [
          {
            title: 'Modulo 1: Bienvenida',
            units: [
              {
                title: 'Unidad 1: Introduccion organizacional',
                topics: [
                  {
                    title: 'Tema 1: Cultura y valores',
                    scenes: [
                      { title: 'Escena 1: Video de bienvenida', durationMinutes: 12 },
                      { title: 'Escena 2: Recorrido guiado', durationMinutes: 15 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Sesion 2: Rol y Operacion',
        modules: [
          {
            title: 'Modulo 2: Flujo de trabajo',
            units: [
              {
                title: 'Unidad 2: Herramientas clave',
                topics: [
                  {
                    title: 'Tema 2: Primeros entregables',
                    scenes: [
                      { title: 'Escena 1: Simulacion de caso', durationMinutes: 20 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'workshop',
    title: 'Taller de Habilidades',
    description: '1 sesion con 3 modulos para formacion intensiva practica.',
    sessions: [
      {
        title: 'Sesion Unica: Taller Intensivo',
        modules: [
          {
            title: 'Modulo 1: Conceptos base',
            units: [
              {
                title: 'Unidad 1',
                topics: [
                  {
                    title: 'Tema 1',
                    scenes: [{ title: 'Escena 1: Marco conceptual', durationMinutes: 15 }],
                  },
                ],
              },
            ],
          },
          {
            title: 'Modulo 2: Practica guiada',
            units: [
              {
                title: 'Unidad 2',
                topics: [
                  {
                    title: 'Tema 2',
                    scenes: [{ title: 'Escena 1: Laboratorio guiado', durationMinutes: 25 }],
                  },
                ],
              },
            ],
          },
          {
            title: 'Modulo 3: Aplicacion y cierre',
            units: [
              {
                title: 'Unidad 3',
                topics: [
                  {
                    title: 'Tema 3',
                    scenes: [{ title: 'Escena 1: Reto aplicado', durationMinutes: 30 }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'elearning',
    title: 'Curso E-learning Completo',
    description: 'Plantilla completa de 4 sesiones para programas extensos.',
    sessions: [
      { title: 'Sesion 1: Fundamentos', modules: [] },
      { title: 'Sesion 2: Profundizacion', modules: [] },
      { title: 'Sesion 3: Practica aplicada', modules: [] },
      { title: 'Sesion 4: Proyecto final', modules: [] },
    ],
  },
];

function emptySessionStructure(title: string): TemplateSession {
  return {
    title,
    modules: [
      {
        title: 'Modulo 1',
        units: [
          {
            title: 'Unidad 1',
            topics: [
              {
                title: 'Tema 1',
                scenes: [{ title: 'Escena 1', durationMinutes: 15 }],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function buildTemplateStructure(templateKey: ProjectTemplateKey): Session[] {
  const selected = PROJECT_TEMPLATES.find((template) => template.key === templateKey);
  const sourceSessions = selected?.sessions ?? PROJECT_TEMPLATES[0].sessions;

  return sourceSessions.map((session) => {
    const normalizedSession = session.modules.length > 0 ? session : emptySessionStructure(session.title);

    return {
      id: crypto.randomUUID(),
      title: normalizedSession.title,
      modules: normalizedSession.modules.map((module) => ({
        id: crypto.randomUUID(),
        title: module.title,
        units: module.units.map((unit) => ({
          id: crypto.randomUUID(),
          title: unit.title,
          topics: unit.topics.map((topic) => ({
            id: crypto.randomUUID(),
            title: topic.title,
            scenes: topic.scenes.map((scene) => ({
              id: crypto.randomUUID(),
              title: scene.title,
              durationMinutes: scene.durationMinutes,
            })),
          })),
        })),
      })),
    };
  });
}
