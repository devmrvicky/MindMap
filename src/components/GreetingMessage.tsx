import { useEffect, useState } from "react";

const greetingMessages = [
  "Hi there! What can I help you explore today?",
  "Welcome! What's your question?",
  "Hello! Your AI assistant is ready - ask me anything.",
  "How can I assist your curiosity today?",
  "Greetings! What knowledge shall we uncover?",
  "Hey! What's on your mind?",
  "Ready when you are - what's your query?",
  "Welcome back! What shall we discuss today?",
  "AI at your service - how can I help?",
  "What fascinating topic brings you here today?",
  "Hello! Let's tackle your questions together.",
  "How may I assist your learning journey today?",
  "Hi! What problem shall we solve?",
  "Your query is my command - ask away!",
  "Welcome to the conversation! What's first?",
  "Hello! Let's turn your questions into answers.",
  "What wisdom shall we pursue today?",
  "Hi! Your personal think tank is online.",
  "Ready to explore ideas - what's your starting point?",
  "How can I make your day more productive?",
  "Welcome! Your digital brainstorming partner is here.",
  "Hello! Let's turn curiosity into knowledge.",
  "What's the question of the hour?",
  "Hi! Let's dive into your inquiries.",
  "How may I accelerate your discovery today?",
  "Welcome! Your questions, my answers.",
  "Hello! What knowledge can I unlock for you?",
  "What challenge shall we tackle first?",
  "Hi! Let's make complex things simple.",
  "Your AI co-pilot is ready - destination?",
  "Hello! Let's turn your 'what if' into 'here's how'.",
  "What's keeping you curious right now?",
  "Welcome! Let's decode your questions.",
  "Hi! Your personal knowledge engine is online.",
  "How can I help you connect the dots today?",
  "Hello! Let's explore the realm of possibilities.",
  "What puzzle shall we solve together?",
  "Hi! Ready to turn queries into clarity.",
  "Welcome! Your ideas meet instant expertise.",
  "How may I be your cognitive extension today?",
  "Hello! Let's make abstract concepts concrete.",
  "What's the first step in our knowledge journey?",
  "Hi! Your question is my mission.",
  "Ready to analyze, explain, and explore - your move!",
  "Hello! Let's break down complex topics.",
  "What insight can I help you discover?",
  "Welcome! Your digital Socrates is here.",
  "Hi! Let's turn questions into understanding.",
  "How can I amplify your learning today?",
  "Hello! Your gateway to knowledge is open.",
];

const GreetingMessageComp = () => {
  const [randomGreetingMessage, setRandomGreetingMessage] =
    useState<string>("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetingMessages.length);
    setRandomGreetingMessage(greetingMessages[randomIndex]);
  }, []);
  return (
    <h1 className="text-2xl py-4 font-medium italic text-center">
      {randomGreetingMessage}
    </h1>
  );
};

export default GreetingMessageComp;
