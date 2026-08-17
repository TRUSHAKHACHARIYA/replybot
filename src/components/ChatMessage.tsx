interface ChatMessageProps {
  sender: "customer" | "bot" | "owner";
  message: string;
  time: string;
  name?: string;
}

export default function ChatMessage({ sender, message, time, name }: ChatMessageProps) {
  const isBot = sender === "bot";
  const isOwner = sender === "owner";

  return (
    <div className={`flex gap-3 ${isBot ? "" : "flex-row-reverse"}`}>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
        isBot ? "bg-primary-100 text-primary-600" :
        isOwner ? "bg-accent-100 text-accent-600" :
        "bg-surface text-text-secondary"
      }`}>
        {isBot ? "AI" : isOwner ? "You" : name?.charAt(0) || "C"}
      </div>
      <div className={`max-w-[70%] ${isBot ? "" : "text-right"}`}>
        <div className={`inline-block rounded-2xl px-4 py-2.5 text-sm ${
          isBot ? "bg-primary-50 text-text-primary" :
          isOwner ? "bg-accent-50 text-text-primary" :
          "bg-surface text-text-primary"
        }`}>
          {message}
        </div>
        <p className="mt-1 text-xs text-text-muted">{time}</p>
      </div>
    </div>
  );
}
