import { Inbox } from "lucide-react";

export const EmptyState = ({ message = "Nenhum registro encontrado." }: { message?: string }) => (
  <div className="px-6 py-16 text-center text-muted-foreground flex flex-col items-center gap-2">
    <Inbox className="h-8 w-8 opacity-50" />
    <p className="text-sm">{message}</p>
  </div>
);
