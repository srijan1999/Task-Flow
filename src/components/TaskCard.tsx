import React from "react";
import { CheckCircle2, Clock, Trash2, User, HelpCircle } from "lucide-react";
import { Task, User as UserType, Tag, AccentColor, accentColorMap } from "../types/task";

interface TaskCardProps {
  task: Task;
  users: UserType[];
  tags: Tag[];
  onClick: () => void;
  onMoveStatus: (taskId: string, direction: "left" | "right") => void;
  accentColor: AccentColor;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  tags,
  onClick,
  onMoveStatus,
  accentColor,
}) => {
  const accent = accentColorMap[accentColor];
  const assignee = users.find((u) => u.id === task.assignee_id);
  const taskTags = tags.filter((tag) => task.tag_ids?.includes(tag.id));

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 rounded-full ${accent.bg} ${accent.bgLight} flex items-center justify-center text-white text-sm font-medium`}>
            {task.title.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-xs">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 text-xs">
              {taskTags.map((tag) => (
                <span
                  key={tag.id}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    tag.color === "indigo"
                      ? "bg-indigo-100 text-indigo-800"
                      : tag.color === "rose"
                      ? "bg-rose-100 text-rose-800"
                      : tag.color === "emerald"
                      ? "bg-emerald-100 text-emerald-800"
                      : tag.color === "amber"
                      ? "bg-amber-100 text-amber-800"
                      : tag.color === "sky"
                      ? "bg-sky-100 text-sky-800"
                      : tag.color === "violet"
                      ? "bg-violet-100 text-violet-800"
                      : "bg-fuchsia-100 text-fuchsia-800"
                  }`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
          {task.description && (
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            {assignee && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{assignee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveStatus(task.id, "left");
            }}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HelpCircle className="h-4 w-4 text-slate-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveStatus(task.id, "right");
            }}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete functionality would go here
            }}
            className="p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
          </button>
        </div>
      </div>
    </div>
  );
};