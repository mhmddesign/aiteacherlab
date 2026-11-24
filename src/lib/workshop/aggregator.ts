import { ACTIVITIES } from "@/content/activities";
import type {
  ActivityAggregate,
  AnonymizedSubmissionSnippet,
  OptionTally,
  QuestionTally,
  ShowcaseCategoryTally,
} from "@/content/types";

export interface RawResponseRow {
  id: string;
  participant_id: string;
  item_key: string;
  selected_option: string | null;
  payload: Record<string, unknown>;
  is_correct: boolean | null;
  created_at: string;
}

export function gradeResponse(
  activityKey: string,
  itemKey: string,
  selectedOption: string | undefined
): boolean | null {
  const def = ACTIVITIES[activityKey];
  if (!def || !def.questions || !selectedOption) return null;
  const question = def.questions.find((q) => q.id === itemKey);
  if (!question) return null;
  return question.correctOptionId === selectedOption;
}

export function computeAggregate(
  activityKey: string,
  resetGeneration: number,
  rows: RawResponseRow[],
  includeAnswers: boolean
): ActivityAggregate | null {
  const def = ACTIVITIES[activityKey];
  if (!def) return null;

  const uniqueRespondents = new Set(rows.map((r) => r.participant_id)).size;

  if (def.type === "poll" || def.type === "project_vote") {
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (r.selected_option) {
        counts.set(r.selected_option, (counts.get(r.selected_option) ?? 0) + 1);
      }
    }
    const denom = Math.max(rows.length, 1);
    const optionTallies: OptionTally[] = (def.options ?? []).map((opt) => {
      const count = counts.get(opt.id) ?? 0;
      return {
        optionId: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count,
        percentage: rows.length > 0 ? Math.round((count / denom) * 100) : 0,
      };
    });
    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      optionTallies,
    };
  }

  if (def.type === "mcq_quiz" || def.type === "tf_quiz") {
    const questionTallies: QuestionTally[] = (def.questions ?? []).map((q) => {
      const qRows = rows.filter((r) => r.item_key === q.id);
      const counts = new Map<string, number>();
      let correctCount = 0;
      for (const r of qRows) {
        if (r.selected_option) {
          counts.set(r.selected_option, (counts.get(r.selected_option) ?? 0) + 1);
        }
        if (r.is_correct) correctCount += 1;
      }
      const denom = Math.max(qRows.length, 1);
      return {
        questionId: q.id,
        prompt: q.prompt,
        totalResponses: qRows.length,
        correctCount,
        correctOptionId: includeAnswers ? q.correctOptionId : null,
        explanation: includeAnswers ? q.explanation : null,
        options: q.options.map((opt) => {
          const count = counts.get(opt.id) ?? 0;
          return {
            optionId: opt.id,
            label: opt.label,
            shortLabel: opt.label.slice(0, 26),
            count,
            percentage: qRows.length > 0 ? Math.round((count / denom) * 100) : 0,
          };
        }),
      };
    });

    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      questionTallies,
    };
  }

  if (def.type === "showcase_vote") {
    const showcaseTallies: ShowcaseCategoryTally[] = (def.categories ?? []).map((cat) => {
      const catRows = rows.filter((r) => r.item_key === cat.id);
      const counts = new Map<string, number>();
      for (const r of catRows) {
        if (r.selected_option) {
          counts.set(r.selected_option, (counts.get(r.selected_option) ?? 0) + 1);
        }
      }
      const denom = Math.max(catRows.length, 1);
      return {
        categoryId: cat.id,
        categoryLabel: cat.label,
        totalVotes: catRows.length,
        options: (def.options ?? []).map((opt) => {
          const count = counts.get(opt.id) ?? 0;
          return {
            optionId: opt.id,
            label: opt.label,
            shortLabel: opt.shortLabel,
            count,
            percentage: catRows.length > 0 ? Math.round((count / denom) * 100) : 0,
          };
        }),
      };
    });
    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      showcaseTallies,
    };
  }

  if (def.type === "prompt_builder") {
    const recentSnippets: AnonymizedSubmissionSnippet[] = rows
      .slice(-8)
      .reverse()
      .map((r) => {
        const grade = typeof r.payload.grade === "string" ? r.payload.grade : "Primaire";
        const subject = typeof r.payload.subject === "string" ? r.payload.subject : "Classe";
        const objective =
          typeof r.payload.objective === "string" ? r.payload.objective : "";
        const assembledPrompt =
          typeof r.payload.assembledPrompt === "string"
            ? r.payload.assembledPrompt
            : r.selected_option ?? "";
        return {
          id: r.id,
          label: `${grade} · ${subject}`,
          content: assembledPrompt.slice(0, 260),
          secondary: objective ? `Objectif : ${objective}` : undefined,
          createdAt: r.created_at,
        };
      });

    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      recentSnippets,
    };
  }

  if (def.type === "meta_prompt") {
    const frCount = rows.filter((r) => r.selected_option === "fr").length;
    const arCount = rows.filter((r) => r.selected_option === "ar").length;
    const denom = Math.max(rows.length, 1);
    const recentSnippets: AnonymizedSubmissionSnippet[] = rows
      .slice(-8)
      .reverse()
      .map((r) => ({
        id: r.id,
        label: r.selected_option === "ar" ? "العربية" : "Français",
        content:
          typeof r.payload.metaPrompt === "string"
            ? r.payload.metaPrompt.slice(0, 240)
            : typeof r.payload.roughIdea === "string"
              ? r.payload.roughIdea
              : "",
        secondary:
          typeof r.payload.roughIdea === "string"
            ? `Idée : ${r.payload.roughIdea.slice(0, 120)}`
            : undefined,
        createdAt: r.created_at,
      }));

    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      optionTallies: [
        {
          optionId: "fr",
          label: "Méta-prompt en Français",
          shortLabel: "Français",
          count: frCount,
          percentage: rows.length > 0 ? Math.round((frCount / denom) * 100) : 0,
        },
        {
          optionId: "ar",
          label: "Méta-prompt en Arabe",
          shortLabel: "العربية",
          count: arCount,
          percentage: rows.length > 0 ? Math.round((arCount / denom) * 100) : 0,
        },
      ],
      recentSnippets,
    };
  }

  if (def.type === "exit_ticket") {
    const counts = new Map<string, number>();
    for (const r of rows) {
      if (r.selected_option) {
        counts.set(r.selected_option, (counts.get(r.selected_option) ?? 0) + 1);
      }
    }
    const denom = Math.max(rows.length, 1);
    const optionTallies: OptionTally[] = (def.options ?? []).map((opt) => {
      const count = counts.get(opt.id) ?? 0;
      return {
        optionId: opt.id,
        label: opt.label,
        shortLabel: opt.shortLabel,
        count,
        percentage: rows.length > 0 ? Math.round((count / denom) * 100) : 0,
      };
    });
    const recentSnippets: AnonymizedSubmissionSnippet[] = rows
      .slice(-12)
      .reverse()
      .map((r) => {
        const opt = def.options?.find((o) => o.id === r.selected_option);
        const commitment =
          typeof r.payload.commitment === "string" ? r.payload.commitment : "";
        return {
          id: r.id,
          label: opt?.shortLabel ?? "Engagement",
          content: commitment || opt?.label || "Engagement confirmé",
          createdAt: r.created_at,
        };
      });

    return {
      activityKey,
      resetGeneration,
      totalRespondents: uniqueRespondents,
      totalSubmissions: rows.length,
      optionTallies,
      recentSnippets,
    };
  }

  return null;
}

export function summarizeSubmission(
  activityKey: string,
  itemKey: string,
  selectedOption: string | null,
  payload: Record<string, unknown>
): string {
  if (activityKey === "prompt_builder" || activityKey === "builder-prompt") {
    const grade = typeof payload.grade === "string" ? payload.grade : "";
    const subject = typeof payload.subject === "string" ? payload.subject : "";
    const objective = typeof payload.objective === "string" ? payload.objective : "";
    return `${grade} · ${subject}${objective ? ` — ${objective}` : ""}`.trim();
  }
  if (activityKey === "exercise-metaprompt") {
    const rough = typeof payload.roughIdea === "string" ? payload.roughIdea : "";
    return `${selectedOption === "ar" ? "[AR]" : "[FR]"} ${rough.slice(0, 120)}`;
  }
  if (activityKey === "exit-ticket") {
    const commitment = typeof payload.commitment === "string" ? payload.commitment : "";
    return commitment || selectedOption || "Engagement";
  }
  const def = ACTIVITIES[activityKey];
  if (def?.options) {
    const opt = def.options.find((o) => o.id === selectedOption);
    if (opt) return `${itemKey !== "main" ? `[${itemKey}] ` : ""}${opt.label}`;
  }
  return `${itemKey}: ${selectedOption ?? "Soumis"}`;
}
