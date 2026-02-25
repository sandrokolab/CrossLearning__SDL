
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LXDProject, Strategy, Session, SyllabusBlueprint } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const SYSTEM_INSTRUCTION = `
Eres el motor inteligente de la aplicación LXD4DL (Learning Experience Design for Digital Learning).
Tu objetivo es actuar como un arquitecto de experiencias de aprendizaje y Consultor Senior.
Metodología:
1. Learning Design: Backwards Design.
2. Content Builder: Jerarquía Estricta (Sesión > Módulo > Unidad > Tema > Escena).
3. Journey Development: Metodología ABC (Adquisición, Indagación, Discusión, Práctica, Colaboración, Producción).
4. Multimedia Resources: Niveles 1-4.
`;

// Helper to sanitize JSON string if the model returns markdown code blocks
const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const generateStrategy = async (
  problem: string,
  persona: string,
  need: string
): Promise<Partial<Strategy>> => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Basado en el siguiente contexto:
    - Problema de negocio: "${problem}"
    - Perfil del estudiante (Persona): "${persona}"
    - Necesidad de formación: "${need}"

    Genera una estrategia de diseño de aprendizaje (Module 1).
    Devuelve un JSON con:
    - valueProposition: Una frase potente (Propuesta de Valor).
    - jobs: Lista de 'Jobs' (Tareas que el estudiante intenta resolver en su trabajo).
    - pains: Lista de 'Pains' (Obstáculos, riesgos o resultados no deseados actuales).
    - gains: Lista de 'Gains' (Beneficios y resultados que esperan conseguir).
    - qualitativeObjective: Un Objetivo Cualitativo claro (Training Objective).
    - okrs: Lista de 3 Resultados Clave de Aprendizaje (Key Learning Results - KLRs) verificables.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          valueProposition: { type: Type.STRING },
          jobs: { type: Type.ARRAY, items: { type: Type.STRING } },
          pains: { type: Type.ARRAY, items: { type: Type.STRING } },
          gains: { type: Type.ARRAY, items: { type: Type.STRING } },
          qualitativeObjective: { type: Type.STRING },
          okrs: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateDesignCard = async (
    cardType: 'value_proposition' | 'oklr' | 'interaction' | 'assessment' | 'feedback' | 'outcome',
    context: Strategy
): Promise<Partial<Strategy>> => {
    const model = "gemini-2.5-flash";
    const basePromptContext = `
      Contexto:
      - Problema: "${context.businessProblem}"
      - Audiencia: "${context.targetAudience}"
      - Necesidad: "${context.trainingNeed}"
    `;

    let prompt = "";
    let responseSchema: Schema = { type: Type.OBJECT, properties: {} };

    switch (cardType) {
        case 'value_proposition':
            prompt = `${basePromptContext} Genera el detalle de la Propuesta de Valor (Value Proposition, Jobs, Pains, Gains).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    valueProposition: { type: Type.STRING },
                    jobs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    pains: { type: Type.ARRAY, items: { type: Type.STRING } },
                    gains: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            break;
        case 'oklr':
            prompt = `${basePromptContext} Genera los Objetivos y Key Learning Results (OKLR).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    qualitativeObjective: { type: Type.STRING },
                    okrs: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            break;
        case 'interaction':
            prompt = `${basePromptContext} Diseña la Estrategia de Interacción (Interaction Design) detallada para estas 6 categorías: Onsite, Video, Assisted, Independent, Collaborative, Asynchronous. Y un resumen del flujo (interactionDesign).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    interactionDesign: { type: Type.STRING },
                    onsite: { type: Type.ARRAY, items: { type: Type.STRING } },
                    video: { type: Type.ARRAY, items: { type: Type.STRING } },
                    assisted: { type: Type.ARRAY, items: { type: Type.STRING } },
                    independent: { type: Type.ARRAY, items: { type: Type.STRING } },
                    collaborative: { type: Type.ARRAY, items: { type: Type.STRING } },
                    asynchronous: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            break;
        case 'assessment':
            prompt = `${basePromptContext} Diseña el Modelo de Evaluación (Assessment) detallado para: Formative, Summative, Didactics, Impact. Y un resumen del método (assessmentMethod).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    assessmentMethod: { type: Type.STRING },
                    formativeAssessment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    summativeAssessment: { type: Type.ARRAY, items: { type: Type.STRING } },
                    didacticsEvaluation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    impactEvaluation: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            break;
        case 'feedback':
            prompt = `${basePromptContext} Diseña la Estrategia de Feedback detallada para: Frequency, Follow-up, Progress Monitoring, Coaching & Mentoring. Y un resumen general (feedbackStrategy).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    feedbackStrategy: { type: Type.STRING },
                    frequency: { type: Type.ARRAY, items: { type: Type.STRING } },
                    followUp: { type: Type.ARRAY, items: { type: Type.STRING } },
                    progressMonitoring: { type: Type.ARRAY, items: { type: Type.STRING } },
                    coachingMentoring: { type: Type.ARRAY, items: { type: Type.STRING } },
                }
            };
            break;
        case 'outcome':
            prompt = `${basePromptContext} Diseña el Mapa de Resultados (Outcome Mapping) basado en los 5 Principios de Kirkpatrick/Phillips. Y un resumen de validación de impacto (impactValidation).`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    impactValidation: { type: Type.STRING },
                    principle1: { type: Type.ARRAY, items: { type: Type.STRING } }, // Reaction/Learning
                    principle2: { type: Type.ARRAY, items: { type: Type.STRING } }, // ROE
                    principle3: { type: Type.ARRAY, items: { type: Type.STRING } }, // Behavior/Participation
                    principle4: { type: Type.ARRAY, items: { type: Type.STRING } }, // Results/Reinforcement
                    principle5: { type: Type.ARRAY, items: { type: Type.STRING } }, // ROI/Chain of Evidence
                    generalObjectives: { type: Type.ARRAY, items: { type: Type.STRING } } // For compatibility
                }
            };
            break;
    }

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    return JSON.parse(cleanJson(response.text || "{}"));
}

export const generateStructure = async (
  strategy: Strategy
): Promise<{ blueprint: SyllabusBlueprint, structure: Session[] }> => {
  const model = "gemini-2.5-flash"; // Using flash for large context
  
  const prompt = `
    ROL: Eres un Consultor Senior en Diseño de Experiencias de Aprendizaje (LXD) y Diseño Instruccional Invertido.
    Tu misión es generar el "Syllabus del curso" completo y profesional.

    INPUTS:
    - Problema de Negocio: ${strategy.businessProblem}
    - Audiencia: ${strategy.targetAudience}
    - Objetivo de Formación: ${strategy.trainingNeed}
    - OKRs: ${JSON.stringify(strategy.okrs)}

    METODOLOGÍA OBLIGATORIA (Responde en el objeto 'blueprint'):
    
    Sección 1: Contexto y Objetivo
    Define el ámbito (corporativo/educativo) y la problemática raíz.
    Redacta un Objetivo General centrado en la transformación del aprendiz.

    Sección 2: Habilidades Necesarias (Inputs)
    Lista las capacidades técnicas y blandas (soft skills) requeridas antes o durante el proceso para cerrar la brecha. Justifica su relevancia.

    Sección 3: Retos de Aprendizaje
    Identifica barreras reales (tecnológicas, de tiempo, cognitivas o motivacionales) que dificulten aprender.

    Sección 4: Competencias y Capacidades Logradas (Outputs)
    Define qué sabrá hacer el participante al finalizar. Establece indicadores de éxito claros (evidencias).

    Sección 5: La Propuesta de Valor (Síntesis)
    Redacta 3 párrafos usando esta estructura:
    1. Descripción: "Este programa facilita [Habilidades] mediante [Estrategia] abordando [Retos]".
    2. Beneficio: "Los participantes desarrollan [Competencias], impactando en [Indicador]".
    3. Diferencial: "Enfoque práctico aplicado a [Contexto]".

    Sección 6: Diseño Didáctico
    Selecciona 2 o 3 Tipos de Aprendizaje (Adquisición, Entre Pares, Discusión, Indagación, Práctica, Producción).
    Selecciona los Momentos de Interacción (In-Situ, Sincrónica, Asistido, Independiente, Colaborativa, Autónomo).

    Sección 7: Recursos y Niveles G2RI
    Propón recursos específicos clasificándolos como:
    - G2RI-1: No interactivos (PDF, lecturas).
    - G2RI-2: Audiovisuales lineales (Video, Podcast).
    - G2RI-3: Interactivos (Simuladores, Juegos, Drag&Drop).

    Sección 8: Estrategia de Evaluación (DME)
    Define la Evaluación Formativa y Sumativa.
    Define la Evaluación de la Didáctica y del Nivel de Apropiación.

    Sección 9: Narrativa Final (Resumen Ejecutivo)
    Integra todo lo anterior en un texto fluido y persuasivo de 300-400 palabras, ideal para presentar a un cliente o directivo.

    ADEMÁS:
    Genera la 'structure' jerárquica (Sesión > Módulo > Unidad > Tema > Escena) basada en este blueprint.
  `;

  // Schema Definitions
  const sceneSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      durationMinutes: { type: Type.NUMBER },
      learningObjective: { type: Type.STRING }
    },
    required: ["title", "id"]
  };

  const topicSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      scenes: { type: Type.ARRAY, items: sceneSchema }
    },
    required: ["title", "scenes", "id"]
  };

  const unitSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      topics: { type: Type.ARRAY, items: topicSchema }
    },
    required: ["title", "topics", "id"]
  };

  const moduleSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      units: { type: Type.ARRAY, items: unitSchema }
    },
    required: ["title", "units", "id"]
  };

  const sessionSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        modules: { type: Type.ARRAY, items: moduleSchema }
    },
    required: ["title", "modules", "id"]
  };

  const blueprintSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        contextAndObjective: { type: Type.STRING },
        necessarySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        learningChallenges: { type: Type.ARRAY, items: { type: Type.STRING } },
        achievedCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
        valueProposition: { type: Type.STRING },
        didacticDesign: {
            type: Type.OBJECT,
            properties: {
                learningTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                interactionMoments: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
        },
        resourcesG2RI: { type: Type.ARRAY, items: { type: Type.STRING } },
        assessmentStrategy: {
            type: Type.OBJECT,
            properties: {
                formativeSummative: { type: Type.STRING },
                didacticsAppropriation: { type: Type.STRING },
            }
        },
        finalNarrative: { type: Type.STRING },
    },
    required: ["contextAndObjective", "necessarySkills", "finalNarrative"]
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            blueprint: blueprintSchema,
            structure: { type: Type.ARRAY, items: sessionSchema }
        }
      },
    },
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};

export const suggestPedagogyAndMedia = async (
  sceneTitle: string,
  sceneObjective: string,
  persona: string
) => {
  const model = "gemini-2.5-flash";
  const prompt = `
    Para la escena de aprendizaje: "${sceneTitle}"
    Objetivo: "${sceneObjective}"
    Audiencia: "${persona}"

    Sugiere:
    1. Una metodología ABC (Adquisition, Inquiry, Discussion, Practice, Collaboration, Production).
    2. Un Nivel Multimedia (Level 1, Level 2, Level 3, Level 4).
    3. Un formato de medio específico (ej. Video Interactivo, Podcast, Quiz).
    4. Una breve justificación.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
            abcMethod: { type: Type.STRING },
            mediaLevel: { type: Type.STRING },
            mediaFormat: { type: Type.STRING },
            reasoning: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(cleanJson(response.text || "{}"));
};

export const consultantChat = async (
    currentContext: string,
    userMessage: string
) => {
    const model = "gemini-2.5-flash";
    const prompt = `
    Contexto del proyecto actual:
    ${currentContext}

    Pregunta del usuario: "${userMessage}"

    Responde como el consultor experto LXD4DL. Sé breve, directo y pedagógicamente sólido.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        }
    });

    return response.text;
}
