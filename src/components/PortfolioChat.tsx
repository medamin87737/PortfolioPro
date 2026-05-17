import { useCallback, useEffect, useRef, useState } from "react";
import { PROFILE } from "../data/portfolio";
import type { Theme } from "../hooks/useTheme";
import { useTypewriter } from "../hooks/useTypewriter";
import { parseChatError } from "../utils/parseChatError";
import { ChatBrandIcon } from "./ChatBrandIcon";
import "./PortfolioChat.css";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
  at: number;
};

const FAB_ANIMS = ["bounce", "wobble", "orbit", "pulse", "shake"] as const;
type FabAnim = (typeof FAB_ANIMS)[number];

const WELCOME_TEXT =
  "Bonjour 👋 Je suis l'assistant du portfolio de Med Amin. Posez-moi vos questions sur son parcours, ses projets ou ses compétences.";

let messageSeq = 0;
const nextMessageId = () => `m-${++messageSeq}-${Date.now()}`;

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function pickFabAnim(): FabAnim {
  return FAB_ANIMS[Math.floor(Math.random() * FAB_ANIMS.length)];
}

type PortfolioChatProps = {
  theme: Theme;
};

function AssistantBubble({
  content,
  streaming,
  onStreamEnd,
}: {
  content: string;
  streaming: boolean;
  onStreamEnd: () => void;
}) {
  const { displayed, done } = useTypewriter(content, streaming, { speed: 14 });

  useEffect(() => {
    if (streaming && done) onStreamEnd();
  }, [streaming, done, onStreamEnd]);

  return (
    <p className="portfolio-chat__text">
      {streaming ? displayed : content}
      {streaming && !done && <span className="portfolio-chat__cursor" aria-hidden />}
    </p>
  );
}

function MessageRow({
  message,
  onStreamEnd,
}: {
  message: ChatMessage;
  onStreamEnd: (id: string) => void;
}) {
  const isUser = message.role === "user";
  const handleEnd = useCallback(() => onStreamEnd(message.id), [message.id, onStreamEnd]);

  return (
    <div
      className={`portfolio-chat__row portfolio-chat__row--${message.role}`}
      data-streaming={message.streaming ? "true" : undefined}
    >
      {!isUser && (
        <div className="portfolio-chat__avatar portfolio-chat__avatar--bot" aria-hidden>
          <ChatBrandIcon variant="avatar" size={32} />
        </div>
      )}

      <div className="portfolio-chat__col">
        <div className={`portfolio-chat__bubble portfolio-chat__bubble--${message.role}`}>
          {isUser ? (
            <p className="portfolio-chat__text">{message.content}</p>
          ) : (
            <AssistantBubble
              content={message.content}
              streaming={Boolean(message.streaming)}
              onStreamEnd={handleEnd}
            />
          )}
        </div>
        <time className="portfolio-chat__time" dateTime={new Date(message.at).toISOString()}>
          {formatTime(message.at)}
        </time>
      </div>

      {isUser && (
        <div className="portfolio-chat__avatar portfolio-chat__avatar--user" aria-hidden>
          <span>V</span>
        </div>
      )}
    </div>
  );
}

function TypingRow() {
  return (
    <div className="portfolio-chat__row portfolio-chat__row--assistant">
      <div className="portfolio-chat__avatar portfolio-chat__avatar--bot" aria-hidden>
        <ChatBrandIcon variant="avatar" size={32} />
      </div>
      <div className="portfolio-chat__col">
        <div className="portfolio-chat__bubble portfolio-chat__bubble--assistant portfolio-chat__bubble--typing">
          <span className="portfolio-chat__dots" aria-label="En train d'écrire">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
    </div>
  );
}

export function PortfolioChat({ theme }: PortfolioChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fabAnim, setFabAnim] = useState<FabAnim>("bounce");
  const [fabTick, setFabTick] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const welcomedRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, loading, scrollToBottom]);

  const isStreaming = messages.some((m) => m.streaming);
  useEffect(() => {
    if (!open || !isStreaming) return;
    const id = window.setInterval(scrollToBottom, 40);
    return () => clearInterval(id);
  }, [open, isStreaming, scrollToBottom]);

  const triggerFabMotion = useCallback(() => {
    setFabAnim(pickFabAnim());
    setFabTick((t) => t + 1);
  }, []);

  const openChat = useCallback(() => {
    triggerFabMotion();
    setOpen(true);
    if (!welcomedRef.current) {
      welcomedRef.current = true;
      setMessages([
        {
          id: nextMessageId(),
          role: "assistant",
          content: WELCOME_TEXT,
          streaming: true,
          at: Date.now(),
        },
      ]);
    }
  }, [triggerFabMotion]);

  const closeChat = useCallback(() => {
    triggerFabMotion();
    setOpen(false);
  }, [triggerFabMotion]);

  const toggleChat = useCallback(() => {
    if (open) closeChat();
    else openChat();
  }, [open, openChat, closeChat]);

  const markStreamDone = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
    );
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: nextMessageId(),
      role: "user",
      content: text,
      at: Date.now(),
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);

    const apiMessages = next.map(({ role, content }) => ({ role, content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const raw = await res.text();
      let data: { reply?: string; error?: string } = {};
      if (raw) {
        try {
          data = JSON.parse(raw) as { reply?: string; error?: string };
        } catch {
          throw new Error("Réponse serveur invalide. Lancez npm run dev:server.");
        }
      }

      if (!res.ok) {
        throw new Error(parseChatError(data.error, res.status));
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: "assistant",
          content: data.reply ?? "…",
          streaming: true,
          at: Date.now(),
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Impossible de joindre l'assistant";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          role: "assistant",
          content:
            "Désolé, je ne suis pas disponible pour le moment. Lancez npm run dev:server et vérifiez le fichier .env.",
          streaming: true,
          at: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="portfolio-chat" data-theme={theme}>
      {open && (
        <div className="portfolio-chat__panel" role="dialog" aria-label="Conversation assistant">
          <header className="portfolio-chat__header">
            <div className="portfolio-chat__header-profile">
              <div className="portfolio-chat__header-avatar">
                <ChatBrandIcon variant="avatar" size={40} />
                <span className="portfolio-chat__online" aria-hidden />
              </div>
              <div>
                <p className="portfolio-chat__header-name">Assistant CMA</p>
                <p className="portfolio-chat__header-status">Assistant IA · {PROFILE.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              className="portfolio-chat__close"
              onClick={closeChat}
              aria-label="Fermer la conversation"
            >
              <i className="fa-solid fa-chevron-down" aria-hidden />
            </button>
          </header>

          <div className="portfolio-chat__messages" ref={listRef}>
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} onStreamEnd={markStreamDone} />
            ))}
            {loading && <TypingRow />}
          </div>

          {error && <p className="portfolio-chat__error">{error}</p>}

          <footer className="portfolio-chat__composer">
            <input
              type="text"
              className="portfolio-chat__input"
              placeholder="Écrivez un message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              className="portfolio-chat__send"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
            >
              <i className="fa-solid fa-paper-plane" aria-hidden />
            </button>
          </footer>
        </div>
      )}

      <button
        type="button"
        key={fabTick}
        className={`portfolio-chat__fab portfolio-chat__fab--${fabAnim} ${open ? "portfolio-chat__fab--open" : ""}`}
        onClick={toggleChat}
        aria-label={open ? "Fermer l'assistant IA" : "Ouvrir l'assistant IA"}
        title="Assistant IA"
        aria-expanded={open}
      >
        <span className="portfolio-chat__fab-ring" aria-hidden />
        <span className="portfolio-chat__fab-glow" aria-hidden />
        {open ? (
          <i className="fa-solid fa-xmark portfolio-chat__fab-close" aria-hidden />
        ) : (
          <ChatBrandIcon className="portfolio-chat__fab-icon" size={44} variant="fab" />
        )}
      </button>
    </div>
  );
}
