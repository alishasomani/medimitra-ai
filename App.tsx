
import { useState } from "react";
import "./App.css";

const content = {
  en: {
    title: "Your health, better understood.",
    subtitle: "Meet MediMitra AI, your medicine information companion.",
    symptoms: "What symptoms are you experiencing?",
    hint: "Describe how you feel...",
    prescription: "Your prescription",
    upload: "Choose a prescription photo or PDF",
    button: "Review my information",
    note: "For information only. Always consult your doctor.",
  },
  gu: {
    title: "તમારું સ્વાસ્થ્ય, વધુ સારી રીતે સમજો.",
    subtitle: "મેડીમિત્ર AI — દવાઓની માહિતી માટે તમારો સાથી.",
    symptoms: "તમને કયા લક્ષણો અનુભવાય છે?",
    hint: "તમને કેવું લાગે છે તે જણાવો...",
    prescription: "તમારું પ્રિસ્ક્રિપ્શન",
    upload: "પ્રિસ્ક્રિપ્શનનો ફોટો અથવા PDF પસંદ કરો",
    button: "મારી માહિતી તપાસો",
    note: "માત્ર માહિતી માટે. હંમેશાં ડૉક્ટરની સલાહ લો.",
  },
  hi: {
    title: "अपने स्वास्थ्य को बेहतर समझें।",
    subtitle: "मेडीमित्र AI — दवाओं की जानकारी के लिए आपका साथी.",
    symptoms: "आपको कौन से लक्षण महसूस हो रहे हैं?",
    hint: "बताएँ कि आप कैसा महसूस कर रहे हैं...",
    prescription: "आपका प्रिस्क्रिप्शन",
    upload: "प्रिस्क्रिप्शन की फोटो या PDF चुनें",
    button: "मेरी जानकारी देखें",
    note: "केवल जानकारी के लिए। हमेशा डॉक्टर से सलाह लें।",
  },
};

type Language = keyof typeof content;

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [symptoms, setSymptoms] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const t = content[lang];

  
async function handleSubmit() {
  if (!symptoms.trim() && !file) {
    setMessage("Please enter symptoms or select a prescription first.");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    if (symptoms.trim()) {
      const response = await fetch(
        "http://127.0.0.1:8000/api/symptoms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            symptoms,
            language: lang,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Symptoms request failed.");
      }

      const data = await response.json();
      setMessage(data.message);
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/prescription",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "File upload failed.");
      }

      const data = await response.json();

      setMessage((previous) =>
        previous
          ? `${previous} ${data.message}`
          : data.message
      );
    }
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
