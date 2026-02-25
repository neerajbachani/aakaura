"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImSpinner8 } from "react-icons/im";
import { IoIosArrowBack, IoMdAdd, IoMdTrash, IoMdCreate } from "react-icons/io";

// Types matching the Prisma model
type ChakraSlug =
  | "root"
  | "sacral"
  | "solar-plexus"
  | "heart"
  | "throat"
  | "third-eye"
  | "crown";

type EnergyState = "excess" | "deficit" | "stable";

interface QuizAnswer {
  id?: string;
  text: string;
  chakra: ChakraSlug;
  state: EnergyState;
  weight: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  multiSelect: boolean;
  order: number;
  answers: QuizAnswer[];
}

const CHAKRAS: ChakraSlug[] = [
  "root",
  "sacral",
  "solar-plexus",
  "heart",
  "throat",
  "third-eye",
  "crown",
];

const STATES: EnergyState[] = ["excess", "deficit", "stable"];

export default function AdminQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<QuizQuestion>>({
    question: "",
    multiSelect: false,
    answers: [],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/admin/quiz");
      if (res.ok) {
        const result = await res.json();
        setQuestions(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await fetch(`/api/admin/quiz?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuestions(questions.filter((q) => q.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete question", error);
    }
  };

  const handleSave = async () => {
    // Basic validation
    if (
      !formData.question ||
      !formData.answers ||
      formData.answers.length === 0
    ) {
      alert("Please fill in the question and at least one answer.");
      return;
    }

    try {
      const method = editingQuestion ? "PUT" : "POST";
      const body = {
        ...formData,
        id: editingQuestion?.id,
      };

      const res = await fetch("/api/admin/quiz", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchQuestions();
        setEditingQuestion(null);
        setIsCreating(false);
        setFormData({ question: "", multiSelect: false, answers: [] });
      } else {
        alert("Failed to save question");
      }
    } catch (error) {
      console.error("Failed to save question", error);
    }
  };

  const startEdit = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      multiSelect: question.multiSelect,
      answers: question.answers,
    });
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingQuestion(null);
    setFormData({
      question: "",
      multiSelect: false,
      answers: [
        { text: "", chakra: "root", state: "stable", weight: 0.3 },
        { text: "", chakra: "root", state: "stable", weight: 0.3 },
      ],
    });
    setIsCreating(true);
  };

  const updateAnswer = (index: number, field: keyof QuizAnswer, value: any) => {
    const newAnswers = [...(formData.answers || [])];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setFormData({ ...formData, answers: newAnswers });
  };

  const addAnswer = () => {
    setFormData({
      ...formData,
      answers: [
        ...(formData.answers || []),
        { text: "", chakra: "root", state: "stable", weight: 0.3 },
      ],
    });
  };

  const removeAnswer = (index: number) => {
    const newAnswers = [...(formData.answers || [])];
    newAnswers.splice(index, 1);
    setFormData({ ...formData, answers: newAnswers });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1005] text-[#F5E6D3]">
        <ImSpinner8 className="animate-spin text-4xl" />
      </div>
    );
  }

  // Edit/Create View
  if (isCreating || editingQuestion) {
    return (
      <div className="min-h-screen bg-[#1A1005] text-[#F5E6D3] p-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsCreating(false);
                setEditingQuestion(null);
              }}
              className="p-2 hover:bg-[#F5E6D3]/10 rounded-full transition-colors"
            >
              <IoIosArrowBack className="text-2xl" />
            </button>
            <h1 className="text-3xl font-serif text-[#F5E6D3]">
              {isCreating ? "New Question" : "Edit Question"}
            </h1>
          </div>

          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-2xl space-y-6">
            {/* Question Text */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#F5E6D3]/60">
                Question Text
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full bg-[#1A1005] border border-[#F5E6D3]/20 rounded-lg p-3 focus:outline-none focus:border-[#F5E6D3]/50 transition-colors"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Multi-Select Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="multiSelect"
                checked={formData.multiSelect}
                onChange={(e) =>
                  setFormData({ ...formData, multiSelect: e.target.checked })
                }
                className="w-5 h-5 rounded border-[#F5E6D3]/20 bg-[#1A1005] text-[#F5E6D3] focus:ring-[#F5E6D3]/50"
              />
              <label htmlFor="multiSelect" className="text-[#F5E6D3]/80">
                Allow Multiple Selections?
              </label>
            </div>

            {/* Answers Section */}
            <div className="space-y-4 pt-4 border-t border-[#F5E6D3]/10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif">Answers</h3>
                <button
                  onClick={addAnswer}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20 rounded-lg text-sm transition-colors"
                >
                  <IoMdAdd /> Add Answer
                </button>
              </div>

              <div className="space-y-4">
                {formData.answers?.map((answer, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#1A1005]/50 border border-[#F5E6D3]/10 rounded-xl space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={answer.text}
                          onChange={(e) =>
                            updateAnswer(idx, "text", e.target.value)
                          }
                          className="w-full bg-[#1A1005] border border-[#F5E6D3]/20 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5E6D3]/50"
                          placeholder="Answer text..."
                        />

                        <div className="flex flex-wrap gap-3">
                          {/* Chakra Select */}
                          <select
                            value={answer.chakra}
                            onChange={(e) =>
                              updateAnswer(idx, "chakra", e.target.value)
                            }
                            className="bg-[#1A1005] border border-[#F5E6D3]/20 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5E6D3]/50"
                          >
                            {CHAKRAS.map((ch) => (
                              <option key={ch} value={ch}>
                                {ch.replace("-", " ")}
                              </option>
                            ))}
                          </select>

                          {/* State Select */}
                          <select
                            value={answer.state}
                            onChange={(e) =>
                              updateAnswer(idx, "state", e.target.value)
                            }
                            className="bg-[#1A1005] border border-[#F5E6D3]/20 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5E6D3]/50"
                          >
                            {STATES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>

                          {/* Weight Input */}
                          <div className="flex items-center gap-2">
                            <label className="text-xs text-[#F5E6D3]/60">
                              Weight:
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              value={answer.weight}
                              onChange={(e) =>
                                updateAnswer(
                                  idx,
                                  "weight",
                                  parseFloat(e.target.value),
                                )
                              }
                              className="w-20 bg-[#1A1005] border border-[#F5E6D3]/20 rounded-lg p-2 text-sm focus:outline-none focus:border-[#F5E6D3]/50"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeAnswer(idx)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Remove Answer"
                      >
                        <IoMdTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-[#F5E6D3]/10">
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-[#F5E6D3] text-[#27190B] font-medium rounded-xl hover:bg-white transition-all transform hover:scale-105"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="min-h-screen bg-[#1A1005] text-[#F5E6D3] p-8 pb-32">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif text-[#F5E6D3]">Quiz Manager</h1>
            <p className="text-[#F5E6D3]/60 mt-2">
              Manage questions, answers, and scoring logic
            </p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-6 py-3 bg-[#F5E6D3] text-[#27190B] font-medium rounded-xl hover:bg-white transition-all transform hover:scale-105"
          >
            <IoMdAdd className="text-xl" /> New Question
          </button>
        </div>

        <div className="grid gap-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-6 rounded-2xl hover:border-[#F5E6D3]/30 transition-all group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[#F5E6D3]/40 font-mono text-sm">
                      #{index + 1}
                    </span>
                    <h3 className="text-xl font-medium text-[#F5E6D3]">
                      {q.question}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {q.multiSelect && (
                      <span className="text-xs px-2 py-1 bg-[#F5E6D3]/10 rounded-full text-[#F5E6D3]/80 border border-[#F5E6D3]/20">
                        Multi-Select
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-[#F5E6D3]/10 rounded-full text-[#F5E6D3]/80 border border-[#F5E6D3]/20">
                      {q.answers.length} Answers
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(q)}
                    className="p-2 hover:bg-[#F5E6D3]/10 rounded-lg text-[#F5E6D3]/80 hover:text-[#F5E6D3] transition-colors"
                  >
                    <IoMdCreate className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                  >
                    <IoMdTrash className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Preview of answers */}
              <div className="mt-4 pl-8 space-y-1">
                {q.answers.map((a, idx) => (
                  <div
                    key={idx}
                    className="text-sm text-[#F5E6D3]/60 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5E6D3]/40" />
                    <span className="truncate">{a.text}</span>
                    <span className="text-[#F5E6D3]/30 text-xs">
                      ({a.chakra} • {a.state} • {a.weight})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-20 bg-[#F5E6D3]/05 rounded-3xl border border-dashed border-[#F5E6D3]/20">
              <p className="text-[#F5E6D3]/40 text-lg">
                No questions yet. Create one to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
