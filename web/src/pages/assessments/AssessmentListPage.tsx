import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/ui/empty-state";
import { Alert, AlertContent } from "@/components/ui/alert";
import { assessmentsApi } from "@/services/assessments";
import {
  Plus,
  Clock,
  ChevronRight,
  ClipboardList,
  Code,
  LayoutGrid,
  Users,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assessment } from "@/types";

type FilterStatus = "all" | "completed" | "awaiting" | "failed";

function getAssessmentStatus(a: Assessment): FilterStatus {
  if (!a.latest_session) return "awaiting";
  if (a.latest_session.status === "active") return "awaiting";
  if (a.latest_session.status === "ended" && a.latest_session.end_reason === "error") return "failed";
  if (a.latest_session.status === "ended") return "completed";
  return "awaiting";
}

const STATUS_CONFIG = {
  completed: {
    icon: Code,
    iconBg: "bg-teal-50",
    iconStroke: "text-teal-700",
    badge: "bg-teal-50 text-teal-700",
    label: "Completed",
  },
  awaiting: {
    icon: LayoutGrid,
    iconBg: "bg-blue-50",
    iconStroke: "text-blue-700",
    badge: "bg-amber-50 text-amber-700",
    label: "Awaiting",
  },
  failed: {
    icon: AlertCircle,
    iconBg: "bg-red-50",
    iconStroke: "text-red-700",
    badge: "bg-red-50 text-red-700",
    label: "Failed",
  },
};

const ICON_VARIANTS = [Code, LayoutGrid, Users, Monitor, AlertCircle];
const ICON_COLORS = [
  { bg: "bg-teal-50", stroke: "text-teal-700" },
  { bg: "bg-blue-50", stroke: "text-blue-700" },
  { bg: "bg-purple-50", stroke: "text-purple-700" },
  { bg: "bg-amber-50", stroke: "text-amber-700" },
  { bg: "bg-red-50", stroke: "text-red-700" },
];

function getIconForAssessment(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % ICON_VARIANTS.length;
  const colorIdx = Math.abs(hash) % ICON_COLORS.length;
  return { Icon: ICON_VARIANTS[idx], ...ICON_COLORS[colorIdx] };
}

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "completed", label: "Completed" },
  { key: "awaiting", label: "Awaiting" },
  { key: "failed", label: "Failed" },
];

function getStatusBadge(status: FilterStatus) {
  if (status === "completed") return STATUS_CONFIG.completed;
  if (status === "failed") return STATUS_CONFIG.failed;
  return STATUS_CONFIG.awaiting;
}

function MetaDot() {
  return <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />;
}

export default function AssessmentListPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const navigate = useNavigate();

  useEffect(() => {
    assessmentsApi
      .list()
      .then((res) => setAssessments(res.data.assessments))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const assessmentsWithStatus = useMemo(
    () => assessments.map((a) => ({ ...a, _status: getAssessmentStatus(a) })),
    [assessments]
  );

  const filtered = useMemo(
    () =>
      filter === "all"
        ? assessmentsWithStatus
        : assessmentsWithStatus.filter((a) => a._status === filter),
    [assessmentsWithStatus, filter]
  );

  const counts = useMemo(() => {
    const c = { all: 0, completed: 0, awaiting: 0, failed: 0 };
    for (const a of assessmentsWithStatus) c[a._status]++;
    c.all = assessmentsWithStatus.length;
    return c;
  }, [assessmentsWithStatus]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Assessments</h1>
          {!loading && assessments.length > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {assessments.length} assessment{assessments.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Button onClick={() => navigate("/assessments/new")}>
          <Plus className="h-4 w-4 mr-1.5" /> New assessment
        </Button>
      </div>

      {error && (
        <Alert variant="danger">
          <AlertContent>Failed to load assessments. Please refresh the page.</AlertContent>
        </Alert>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-6 w-6 text-muted-foreground" />}
          title="No assessments yet"
          description="Create an assessment to define skills and invite candidates."
          action={
            <Button variant="outline" onClick={() => navigate("/assessments/new")}>
              <Plus className="h-4 w-4 mr-1.5" /> Create your first assessment
            </Button>
          }
        />
      ) : (
        <>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  filter === f.key
                    ? "bg-teal-50 text-teal-700 border-teal-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-800"
                )}
              >
                {f.label}
                {counts[f.key] > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-semibold",
                      filter === f.key
                        ? "bg-teal-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {counts[f.key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map((a) => {
              const { Icon, bg, stroke } = getIconForAssessment(a.name);
              const statusCfg = getStatusBadge(a._status);

              return (
                <div
                  key={a.id}
                  onClick={() => navigate(`/assessments/${a.id}/invite`)}
                  className="flex items-center gap-3.5 bg-white border border-gray-200 rounded-xl px-4 py-3.5 cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      bg
                    )}
                  >
                    <Icon className={cn("w-5 h-5", stroke)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {a.name}
                    </div>
                    <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        {a.time_limit_min} min
                      </span>
                      <MetaDot />
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-200">
                        {a.skills?.length ?? 0} skill{(a.skills?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
                        statusCfg.badge
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {statusCfg.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
