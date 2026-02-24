import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Send, Bot, User, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { cn } from '../utils/cn';
import { useTypewriter } from '../hooks/useTypewriter';
import ReactMarkdown from 'react-markdown';

// Helper to format disease names (e.g. "Corn_(maize)___Common_rust_" -> "Corn (maize) - Common rust")
const formatDiseaseName = (rawName) => {
    if (!rawName) return "Unknown";
    // Replace triple underscore with separator
    let formatted = rawName.replace(/___/g, ' - ');
    // Replace remaining underscores with spaces
    formatted = formatted.replace(/_/g, ' ');
    return formatted;
};

// Custom Markdown Components for consistent, premium styling
const MarkdownComponents = {
    h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-emerald-400 mt-6 mb-3 tracking-wide" {...props} />,
    p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-gray-200" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 space-y-2 mb-4 text-gray-300" {...props} />,
    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-bold text-emerald-300" {...props} />,
};

// Internal component for Typewriter effect with Markdown
const TypewriterMessage = ({ content }) => {
    // Speed up: 1ms delay is fast.
    const text = useTypewriter(content, 1);

    return (
        <div className="w-full">
            <ReactMarkdown components={MarkdownComponents}>{text}</ReactMarkdown>
        </div>
    );
};

// Static message component
const StaticMessage = ({ content }) => (
    <div className="w-full">
        <ReactMarkdown components={MarkdownComponents}>{content}</ReactMarkdown>
    </div>
);

export default function AnalysisNew() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [result, setResult] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory, chatInput]); // Scroll on history change or input (typing)

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null);
            setChatHistory([]);
        }
    };

    const formatAdvice = (data) => {
        const keys = [
            "1. Explanation",
            "2. Preventive Actions",
            "3. Recommended Treatments",
            "4. Environmental and Watering Advice"
        ];

        let headerIndex = 1;

        // Filter and join only the advice keys
        return keys
            .filter(key => data[key])
            .map(key => {
                let val = data[key];

                // Robustness: If the backend returns a stringified array (e.g. "['a', 'b']"), parse it.
                if (typeof val === 'string') {
                    val = val.trim();
                    if (val.startsWith('[') && val.endsWith(']')) {
                        try {
                            val = JSON.parse(val.replace(/'/g, '"'));
                        } catch (e) {
                            // Fallback for Python lists with apostrophes
                            const inner = val.slice(1, -1);
                            val = inner.split(/',\s*'|",\s*"/).map(item => item.replace(/^['"]|['"]$/g, ''));
                        }
                    }
                }

                const content = Array.isArray(val)
                    ? val.map(item => `* ${item}`).join('\n')
                    : `${val}`;

                // User Request: Omit header for Explanation, just show content.
                if (key.includes("Explanation")) {
                    return `${content}`;
                }

                const title = key.replace(/^\d+\.\s*/, '');
                const header = `## ${headerIndex}. ${title}`;
                headerIndex++;

                return `${header}\n${content}`;
            })
            .join('\n\n');
    };

    const handlePredict = async () => {
        if (!file) return;

        setLoading(true);
        setLoadingStep('Uploading image...');

        // Simulate steps for UX
        setTimeout(() => setLoadingStep('Analyzing leaf texture...'), 800);
        setTimeout(() => setLoadingStep('Identifying pathogens...'), 2000);

        const formData = new FormData();
        formData.append('file', file);
        if (symptoms) {
            formData.append('symptoms', symptoms);
        }

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${API_BASE_URL}/predict/`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Prediction failed');

            const data = await response.json();
            setResult(data);

            // Structure the Initial Advice nicely
            const adviceText = formatAdvice(data);
            const initialMessage = adviceText || "I've analyzed the image. What would you like to know?";

            setChatHistory([{ role: 'assistant', content: initialMessage }]);

        } catch (error) {
            console.error(error);
            alert('Error analyzing image. Ensure backend is running.');
        } finally {
            setLoading(false);
            setLoadingStep('');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setChatLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${API_BASE_URL}/chat/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    symptoms: userMsg,
                    disease: result?.class || "Unknown",
                }),
            });

            const data = await response.json();
            let reply = "";

            // Start check: is it a structured advice object or a simple string?
            // The chatbot usually returns the same JSON structure.
            if (data["1. Explanation"] || data["2. Preventive Actions"]) {
                reply = formatAdvice(data);
            } else if (typeof data === 'string') {
                reply = data;
            } else {
                // Fallback if structure is different (e.g. error) or conversational response
                // trying to avoid printing raw json or undefined
                reply = data.message || data.error || Object.values(data).filter(v => typeof v === 'string').join('\n');
            }

            setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);

        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the garden expert. Please try again." }]);
        } finally {
            setChatLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>
            <Navbar />

            <PageWrapper className="relative z-10 container mx-auto px-4 pt-24 pb-12">
                <div className="grid gap-8 lg:grid-cols-12 lg:h-[85vh]">

                    {/* Left Column: Image Upload & Preview (Smaller) */}
                    <div className="lg:col-span-4 flex flex-col space-y-4 h-full">
                        <Card className="flex-1 flex flex-col items-center justify-center border-dashed border-2 border-white/20 bg-white/5 relative group hover:border-emerald-500/50 transition-colors overflow-hidden">
                            {!preview ? (
                                <div className="text-center p-12">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                                        <Upload size={32} />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Upload Plant Image</h3>
                                    <p className="text-gray-400 mb-6 text-sm">Drag & drop or click to select</p>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        id="image-upload"
                                        onChange={handleFileChange}
                                    />
                                    <Button onClick={() => document.getElementById('image-upload').click()}>
                                        Select File
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center bg-black/50 p-4">
                                    <img src={preview} alt="Upload" className="max-h-[300px] lg:max-h-[400px] w-auto object-contain rounded-lg shadow-2xl" />

                                    <button
                                        onClick={() => { setFile(null); setPreview(null); setResult(null); setSymptoms(''); }}
                                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/50 rounded-full text-white backdrop-blur-md transition-colors"
                                    >
                                        <X size={20} />
                                    </button>

                                    {loading && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                                                <div className="h-full bg-emerald-500 animate-progress"></div>
                                            </div>
                                            <p className="text-emerald-400 font-mono animate-pulse">{loadingStep}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Symptoms (Optional)</label>
                            <Textarea
                                placeholder="Describe what you see: e.g., yellow spots, drooping leaves..."
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="bg-black/20"
                            />
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-lg animate-border-glow border-2 border-emerald-500/50"
                            onClick={handlePredict}
                            disabled={!file || loading}
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                            {loading ? 'Analyzing...' : 'Analyze Plant'}
                        </Button>
                    </div>

                    {/* Right Column: Results & Chat (Larger) */}
                    <div className="lg:col-span-8 flex flex-col h-full space-y-4 lg:max-h-[85vh]">
                        {!result && !loading ? (
                            <Card className="flex-1 flex items-center justify-center border-white/5 bg-white/5">
                                <div className="text-center text-gray-500 max-w-sm px-6">
                                    <Bot size={48} className="mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-medium mb-2">AI Assistant Waiting</h3>
                                    <p>Upload an image and describe symptoms. I'll identify the disease and help you treat it.</p>
                                </div>
                            </Card>
                        ) : (
                            <>
                                {result && (
                                    <Card className="border-emerald-500/30 bg-emerald-500/10 shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-emerald-400 font-medium uppercase tracking-wider">Diagnosis</p>
                                                <h2 className="text-3xl font-bold text-white mt-1 tracking-wide">{formatDiseaseName(result.class)}</h2>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-right">
                                                    <p className="text-sm text-emerald-400">Confidence</p>
                                                    <p className="text-2xl font-bold">{result.confidence ? `${result.confidence > 1 ? result.confidence.toFixed(1) : (result.confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                                                </div>
                                                <CheckCircle2 size={32} className="text-emerald-500" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <Card className="flex-1 flex flex-col border-white/10 bg-black/40 overflow-hidden">
                                    <CardHeader className="border-b border-white/5 py-4 shrink-0">
                                        <CardTitle className="flex items-center text-lg">
                                            <Bot className="mr-2 text-emerald-500" size={20} />
                                            Plant Doctor
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="flex-1 overflow-y-auto p-4 pr-6 space-y-4 custom-scrollbar">
                                        {chatHistory.map((msg, idx) => (
                                            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                                <div className={cn(
                                                    "w-full rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                                    msg.role === 'user'
                                                        ? "bg-emerald-600/20 text-emerald-100 rounded-tr-sm border border-emerald-500/20"
                                                        : "bg-white/10 text-gray-100 rounded-tl-sm border border-white/5"
                                                )}>
                                                    {msg.role === 'assistant' ? (
                                                        <TypewriterMessage content={msg.content} />
                                                    ) : (
                                                        <StaticMessage content={msg.content} />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {chatLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </CardContent>


                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </PageWrapper>
        </div>
    );
}
