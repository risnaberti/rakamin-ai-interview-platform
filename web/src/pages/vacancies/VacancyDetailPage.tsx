import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { vacanciesApi } from "@/services/vacancies";
import { LEVEL_LABELS } from "@/utils/constants";
import { Pencil, Briefcase, BarChart3, Info, FileText, Layers } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Vacancy } from "@/types";

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function VacancyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    vacanciesApi
      .get(Number(id))
      .then((res) => setVacancy(res.data.vacancy))
      .catch(() => setLoadError("Failed to load vacancy data."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-5">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <Breadcrumb items={[{ label: "Vacancies", href: "/vacancies" }]} />
        <div className="border rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-destructive">{loadError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/vacancies")}
          >
            Back to Vacancies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Vacancies", href: "/vacancies" },
          { label: vacancy?.role_title ?? "—" },
        ]}
      />

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold">{vacancy?.role_title ?? "—"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {vacancy?.skills?.length ?? vacancy?.skills_count ?? 0} skill
            {(vacancy?.skills?.length ?? vacancy?.skills_count ?? 0) !== 1
              ? "s"
              : ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/vacancies/${id}/edit`)}
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        {/* Main content */}
        <div className="space-y-4">
          {/* Competency expectations */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
              <FileText className="w-4 h-4 text-teal-600" />
              Competency expectations
            </div>
            {vacancy?.competency_expectations ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {vacancy.competency_expectations}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">No competency expectations defined.</p>
            )}
          </div>

          {/* Culture dimensions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
              <Layers className="w-4 h-4 text-teal-600" />
              Culture dimensions
            </div>
            {vacancy?.culture_dimensions ? (
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {vacancy.culture_dimensions}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">No culture dimensions defined.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3">
          {/* Vacancy info */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
              <Info className="w-4 h-4 text-teal-600" />
              Vacancy details
            </div>
            <div className="space-y-0">
              {[
                {
                  k: "Skills required",
                  v: `${vacancy?.skills?.length ?? vacancy?.skills_count ?? 0}`,
                },
                { k: "Created", v: formatDate(vacancy?.created_at) },
                { k: "Updated", v: formatDate(vacancy?.updated_at) },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0 text-xs"
                >
                  <span className="text-gray-500">{row.k}</span>
                  <span className="font-medium text-gray-900">{row.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills breakdown */}
          {vacancy?.skills && vacancy.skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Skills required
              </div>
              <div className="space-y-3">
                {vacancy.skills.map((s) => (
                  <div key={s.id ?? s.skill_label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-gray-900">
                        {s.skill_label}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {LEVEL_LABELS[s.expected_level]}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${(s.expected_level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No skills state */}
          {vacancy?.skills && vacancy.skills.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 mb-3">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Skills required
              </div>
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <Briefcase className="w-6 h-6 text-gray-300" />
                <p className="text-xs text-gray-400">No skills defined yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/vacancies/${id}/edit`)}
                >
                  Add skills
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
