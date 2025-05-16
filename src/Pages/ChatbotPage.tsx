import { useContext, useEffect, useRef, useState, type JSX } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  useTheme,
} from "@mui/material";
import TypingText from "../Components/TypingText";
import CircularProgress from "@mui/material/CircularProgress";
import { ServiceLocatorContext } from "../Contexts/ServiceLocatorContext";
import { createHTTPClient } from "../Clients/HTTPClient";
import { Bot, Send, X } from "lucide-react";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Update the Message type
type Message = {
  id: string;
  user: boolean;
  content?: string | null;
  html_object?: string | null;
  isTyping?: boolean;
  showHtmlDialog?: boolean; // Add this new field
};

// // Define types for better type safety
// type Message = {
//   id: string // Add unique id for each message
//   user: boolean
//   content?: string | null
//   html_object?: string | null
//   isTyping?: boolean
// }

type ChatResponse = {
  text?: string | null;
  html_object?: string | null;
};

const componentMap: Record<string, () => JSX.Element> = {
  upload_form: () => <p>upload form</p>,
  file_browser: () => <p>file browser</p>,
  search_bar: () => <p>search bar</p>,
};

const ChatbotPage = () => {
  const { url } = useContext(ServiceLocatorContext)!;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [currentHtmlContent, setCurrentHtmlContent] = useState<string | null>(
    null,
  );

  // Add these handler functions
  const handleOpenHtmlDialog = (htmlContent: string) => {
    setCurrentHtmlContent(htmlContent);
  };

  const handleCloseHtmlDialog = () => {
    setCurrentHtmlContent(null);
  };

  const gateway_client = createHTTPClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      user: true,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data: ChatResponse = await gateway_client.post(
        `${url}/api/v1/chatbot/chat`,
        { "Content-Type": "application/json" },
        { message: input },
      );

      const botMessage: Message = {
        id: Date.now().toString(),
        user: false,
        content: data.text || null,
        html_object: data.html_object || null,
        isTyping: !!data.text, // Always show typing if there's text, regardless of html_object
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          user: false,
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate if we should disable input
  const isInputDisabled = loading || messages.some((msg) => msg.isTyping);

  // Focus input when messages finish loading/typing
  useEffect(() => {
    if (!isInputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: "800px",
        mx: "auto",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
          }}
        >
          <Bot />
        </Avatar>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          PandoraDrive Assistant
        </Typography>
      </Box>

      <Paper
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          mb: 2,
        }}
      >
        {messages.length === 0 && (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              textAlign: "center",
              color: theme.palette.text.secondary,
            }}
          >
            <Bot size={60} opacity={0.5} />
            <Typography variant="h6">How can I help you today?</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Ask me anything or try one of our features
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            background:
              theme.palette.mode === "dark"
                ? theme.palette.grey[900]
                : theme.palette.grey[50],
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.user ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  maxWidth: "90%",
                }}
              >
                {!msg.user && (
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 32,
                      height: 32,
                      mt: "4px",
                    }}
                  >
                    <Bot fontSize="small" />
                  </Avatar>
                )}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: msg.user
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      backgroundColor: msg.user
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                      color: msg.user
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.user ? (
                      <Typography>{msg.content}</Typography>
                    ) : msg.content ? (
                      msg.isTyping ? (
                        <TypingText
                          text={msg.content}
                          onFinish={() =>
                            setMessages((prev) =>
                              prev.map((m) =>
                                m.id === msg.id ? { ...m, isTyping: false } : m,
                              ),
                            )
                          }
                        />
                      ) : (
                        <Typography>{msg.content}</Typography>
                      )
                    ) : (
                      <Typography variant="body2">(No response)</Typography>
                    )}
                  </Paper>

                  {/* Add button to show HTML content if available */}
                  {msg.html_object && !msg.isTyping && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenHtmlDialog(msg.html_object!)}
                      sx={{
                        alignSelf: "flex-start",
                        borderRadius: "12px",
                        textTransform: "none",
                      }}
                    >
                      Show Details
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 32,
                  height: 32,
                  mr: 1.5,
                }}
              >
                <Bot fontSize="small" />
              </Avatar>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "18px 18px 18px 4px",
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}
          <div ref={bottomRef} />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.default,
          }}
        >
          <Box display="flex" gap={1} alignItems="center">
            <TextField
              inputRef={inputRef}
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={isInputDisabled}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={isInputDisabled}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
                "&:disabled": {
                  backgroundColor: theme.palette.action.disabledBackground,
                },
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>
      <Dialog
        open={!!currentHtmlContent}
        onClose={handleCloseHtmlDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            Details
            <IconButton onClick={handleCloseHtmlDialog}>
              <X />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {currentHtmlContent && componentMap[currentHtmlContent] ? (
            componentMap[currentHtmlContent]() // Call the function to render the component
          ) : (
            <Typography>No content available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHtmlDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatbotPage;
