"use client"; // This directive marks the component as a Client Component

// This code is designed to be placed in a `page.tsx` file within a Next.js App Router project.
// Ensure you have installed React and Tailwind CSS.
// For ShadCN UI, you would normally import components from your configured path (e.g., "@/components/ui/button").
// The mock components included here are for demonstration purposes in this environment.

import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';

// Define Prop Types for Mock ShadCN components
interface InputProps {
    id?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    className?: string;
}

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

interface TextareaProps {
    placeholder?: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    readOnly?: boolean;
    style?: React.CSSProperties;
}

interface LabelProps {
    children: React.ReactNode;
    htmlFor?: string;
    className?: string;
}

interface CopyButtonProps {
    textToCopy: string;
}

const Input = ({ id, placeholder, value, onChange, className }: InputProps) => (
    <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`flex h-10 w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500
            dark:border-sky-700 dark:bg-sky-900 dark:text-sky-100 dark:placeholder:text-sky-400 dark:focus-visible:ring-cyan-400
            transition-all duration-300 ease-in-out ${className}`}
    />
);

const Button = ({ children, onClick, disabled, className }: ButtonProps) => {
    const [ripple, setRipple] = useState<{ key: number; style: React.CSSProperties }[]>([]);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        const button = event.currentTarget;
        const size = Math.max(button.offsetWidth, button.offsetHeight);
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const newRipple = {
            key: Date.now(),
            style: {
                width: size,
                height: size,
                left: x,
                top: y,
            },
        };
        setRipple((prev) => [...prev, newRipple]);
        setTimeout(() => {
            setRipple((prev) => prev.filter((r) => r.key !== newRipple.key));
        }, 600); // Ripple duration

        if (onClick) onClick(event);
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 overflow-hidden
                bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500
                dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus-visible:ring-cyan-500
                h-10 px-4 py-2 ${className}`}
        >
            {children}
            {ripple.map((r) => (
                <span
                    key={r.key}
                    className="absolute rounded-full bg-white opacity-40 animate-ripple"
                    style={{
                        ...r.style,
                        transform: 'scale(0)',
                        animation: 'ripple 0.6s linear forwards',
                    }}
                ></span>
            ))}
            <style jsx>{`
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `}</style>
        </button>
    );
};

const Card = ({ children, className }: CardProps) => (
    <div className={`rounded-xl border shadow-2xl transition-all duration-500 ease-in-out hover:shadow-sky-500/30
        border-gray-200 bg-white text-gray-900
        dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100
        ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ children, className }: CardHeaderProps) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
        {children}
    </div>
);

const CardTitle = ({ children, className }: CardTitleProps) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
        {children}
    </h3>
);

const CardContent = ({ children, className }: CardContentProps) => (
    <div className={`p-6 pt-0 ${className}`}>
        {children}
    </div>
);

const Textarea = ({ placeholder, value, onChange, className, readOnly, style }: TextareaProps) => (
    <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`flex min-h-[80px] w-full rounded-md border text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500
            dark:border-sky-700 dark:bg-sky-800 dark:text-sky-100 dark:placeholder:text-sky-400 dark:focus-visible:ring-cyan-400
            transition-all duration-300 ease-in-out ${className}`}
        style={style}
    />
);

const Label = ({ children, htmlFor, className }: LabelProps) => (
    <label
        htmlFor={htmlFor}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
        {children}
    </label>
);

// Custom Copy Button Component
const CopyButton = ({ textToCopy }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        try {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy'); // Deprecated but widely supported in iframes
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`absolute top-2 right-2 p-1 rounded-md text-xs transition-all duration-300
                ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                dark:${copied ? 'bg-emerald-600 text-white' : 'bg-sky-700 text-sky-300 hover:bg-sky-600'}`}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

function BlogSummarizerPage() {
    const [url, setUrl] = useState<string>('');
    const [originalText, setOriginalText] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [urduSummary, setUrduSummary] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showResults, setShowResults] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('dark'); // Default to dark theme

    // Apply theme class to HTML element
    useEffect(() => {
        if (typeof window !== 'undefined') { // Ensure this runs only in the browser
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    // Simulated Urdu Dictionary (used for frontend translation if no API is called)
    const urduDictionary: { [key: string]: string } = {
        "This is a simulated blog content.": "یہ ایک فرضی بلاگ کا مواد ہے۔",
        "It covers various topics including technology, science, and daily life.": "اس میں ٹیکنالوجی، سائنس، اور روزمرہ کی زندگی سمیت مختلف موضوعات شامل ہیں۔",
        "For a real application, you would implement actual web scraping and AI summarization.": "ایک حقیقی ایپلیکیشن کے لیے، آپ اصل ویب سکریپنگ اور AI خلاصہ سازی کا نفاذ کریں گے۔",
        "This content is designed to be long enough for a summary.": "یہ مواد خلاصہ کے لیے کافی لمبا ہے۔",
        "It might discuss the latest advancements in AI, the impact of climate change, or perhaps a personal reflection on productivity tips.": "اس میں AI میں تازہ ترین پیشرفت، موسمیاتی تبدیلی کے اثرات، یا پیداواری تجاویز پر ذاتی عکاسی شامل ہو سکتی ہے۔",
        "The goal is to provide a comprehensive overview without being too verbose.": "مقصد بہت زیادہ الفاظ استعمال کیے بغیر ایک جامع جائزہ فراہم کرنا ہے۔",
        "Thank you for using the Blog Summarizer!": "بلاگ سمرائزر استعمال کرنے کا شکریہ!",
        "This is a simulated summary of the blog content.": "یہ بلاگ کے مواد کا ایک فرضی خلاصہ ہے۔",
        "It highlights the main points and gives a brief overview.": "یہ اہم نکات کو اجاگر کرتا ہے اور ایک مختصر جائزہ پیش کرتا ہے۔",
        "The full text would be stored in MongoDB and the summary in Supabase.": "مکمل متن MongoDB میں اور خلاصہ Supabase میں محفوظ کیا جائے گا۔",
        "Please enter a valid URL.": "براہ کرam ایک درست URL درج کریں۔",
        "Failed to summarize the blog.": "بلاگ کا خلاصہ کرنے میں ناکامی۔",
        "Failed to save summary to Supabase.": "خلاصہ Supabase میں محفوظ کرنے میں ناکامی۔",
        "Failed to save full text to MongoDB.": "مکمل متن MongoDB میں محفوظ کرنے میں ناکامی۔",
        "Failed to scrape blog content.": "بلاگ کا مواد سکریپ کرنے میں ناکامی۔",
        "Failed to generate AI summary.": "AI خلاصہ بنانے میں ناکامی۔",
        "Failed to translate text.": "متن کا ترجمہ کرنے میں ناکامی۔"
    };

    // Function to translate to Urdu (now primarily used for error messages, as main translation is via API)
    const translateToUrdu = (text: string): string => {
        let translatedText: string = text;
        for (const [english, urdu] of Object.entries(urduDictionary)) {
            translatedText = translatedText.replace(new RegExp(english, 'g'), urdu);
        }
        return translatedText;
    };

    const handleSummarize = async () => {
        setError('');
        setOriginalText('');
        setSummary('');
        setUrduSummary('');
        setShowResults(false); // Hide results before new summary

        if (!url) {
            setError(translateToUrdu('Please enter a valid URL.'));
            return;
        }

        setLoading(true);

        try {
            // Step 1: Call your scraping API route
            const scrapeResponse = await fetch('/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!scrapeResponse.ok) {
                const errorData = await scrapeResponse.json();
                throw new Error(errorData.message || 'Failed to scrape blog content.');
            }
            const { originalContent } = await scrapeResponse.json();
            setOriginalText(originalContent);

            // Step 2: Call your AI summarization API route
            const summarizeResponse = await fetch('/api/summarize-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ textToSummarize: originalContent }),
            });

            if (!summarizeResponse.ok) {
                const errorData = await summarizeResponse.json();
                throw new Error(errorData.message || 'Failed to generate AI summary.');
            }
            const { summary: aiSummary } = await summarizeResponse.json();
            setSummary(aiSummary);

            // Step 3: Call your Urdu translation API route
            const translateResponse = await fetch('/api/translate-urdu', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ textToTranslate: aiSummary }),
            });

            if (!translateResponse.ok) {
                const errorData = await translateResponse.json();
                throw new Error(errorData.message || 'Failed to translate text.');
            }
            const { translatedText: urduTranslatedSummary } = await translateResponse.json();
            setUrduSummary(urduTranslatedSummary);

            // Step 4: Save full text to MongoDB via API route
            const saveFullTextResponse = await fetch('/api/save-full-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, content: originalContent }),
            });
            if (!saveFullTextResponse.ok) {
                const errorData = await saveFullTextResponse.json();
                throw new Error(errorData.message || 'Failed to save full text to MongoDB.');
            }

            // Step 5: Save summary to Supabase via API route
            const saveSummaryResponse = await fetch('/api/save-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, summary: aiSummary, urduSummary: urduTranslatedSummary }),
            });
            if (!saveSummaryResponse.ok) {
                const errorData = await saveSummaryResponse.json();
                throw new Error(errorData.message || 'Failed to save summary to Supabase.');
            }

            // Small delay before showing results for smoother animation
            await new Promise(resolve => setTimeout(resolve, 500));
            setShowResults(true);

        } catch (err: any) {
            console.error("Summarization process failed:", err);
            // Translate the error message for the user
            setError(translateToUrdu(err.message || 'Failed to summarize the blog.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        // Main container with dark blue background and subtle radial gradient
        <div className={`min-h-screen flex items-center justify-center p-4 font-inter transition-colors duration-500
            bg-white text-gray-900
            dark:bg-slate-950 dark:text-slate-100 relative overflow-hidden`}
            style={{
                background: theme === 'dark'
                    ? 'radial-gradient(circle at center, rgba(30,58,138,0.2) 0%, rgba(15,23,42,1) 70%), linear-gradient(to bottom right, #0F172A, #1E293B)'
                    : 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(243,244,246,1) 70%)'
            }}
        >
            {/* Animated background circles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob top-0 left-0"></div>
                <div className="absolute w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 bottom-0 right-0"></div>
                <div className="absolute w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="w-full max-w-4xl z-10 relative"> {/* Ensure content is above background */}
                <Card className="shadow-lg rounded-xl">
                    <CardHeader className="relative">
                        <CardTitle className="text-center text-4xl font-extrabold bg-clip-text text-transparent pb-2
                            bg-gradient-to-r from-blue-600 to-purple-600
                            dark:bg-gradient-to-r dark:from-indigo-400 dark:to-cyan-400">
                            AI Blog Summarizer
                        </CardTitle>
                        <p className={`text-center text-md
                            text-gray-600
                            dark:text-slate-400`}>
                            Summarize and translate blog content with a touch of AI magic.
                        </p>

                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-300
                                bg-gray-100 hover:bg-gray-200 text-gray-700
                                dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                // Sun icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M3 12h1m15.325-4.275l-.707-.707M4.372 19.372l-.707-.707M18.921 18.921l-.707-.707M5.071 5.071l-.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z" />
                                </svg>
                            ) : (
                                // Moon icon
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Label htmlFor="blog-url" className="sr-only">Blog URL</Label>
                            <Input
                                id="blog-url"
                                placeholder="Enter blog URL (e.g., https://example.com/blog-post)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="flex-grow rounded-lg p-3"
                            />
                            <Button
                                onClick={handleSummarize}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Summarizing...
                                    </div>
                                ) : (
                                    'Summarize Blog'
                                )}
                            </Button>
                        </div>

                        {error && (
                            <div className="text-red-500 text-center text-sm mt-2 animate-fade-in">
                                {error}
                            </div>
                        )}

                        {showResults && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-slide-up-fade-in">
                                {originalText && (
                                    <Card className="p-4 rounded-lg shadow-md relative
                                        bg-white
                                        dark:bg-sky-800">
                                        <CardTitle className="text-lg font-semibold mb-2
                                            text-gray-800
                                            dark:text-sky-200">Original Blog Content (Simulated)</CardTitle>
                                        <Textarea
                                            value={originalText}
                                            readOnly
                                            className="w-full h-48 border rounded-md p-3 text-sm resize-y"
                                        />
                                        <CopyButton textToCopy={originalText} />
                                    </Card>
                                )}

                                {summary && (
                                    <Card className="p-4 rounded-lg shadow-md relative
                                        bg-white
                                        dark:bg-sky-800">
                                        <CardTitle className="text-lg font-semibold mb-2
                                            text-gray-800
                                            dark:text-sky-200">AI Summary (Simulated)</CardTitle>
                                        <Textarea
                                            value={summary}
                                            readOnly
                                            className="w-full h-48 border rounded-md p-3 text-sm resize-y"
                                        />
                                        <CopyButton textToCopy={summary} />
                                    </Card>
                                )}

                                {urduSummary && (
                                    <Card className="p-4 rounded-lg shadow-md col-span-1 md:col-span-2 relative
                                        bg-white
                                        dark:bg-sky-800">
                                        <CardTitle className="text-lg font-semibold mb-2
                                            text-gray-800
                                            dark:text-sky-200">اردو خلاصہ (Urdu Summary - Simulated)</CardTitle>
                                        <Textarea
                                            value={urduSummary}
                                            readOnly
                                            className="w-full h-48 border rounded-md p-3 text-sm text-right font-['Noto_Nastaliq_Urdu'] resize-y"
                                            style={{ direction: 'rtl' }} // Ensure right-to-left for Urdu
                                        />
                                        <CopyButton textToCopy={urduSummary} />
                                    </Card>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Tailwind CSS keyframes for animations */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9);
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                @keyframes slideUpFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up-fade-in {
                    animation: slideUpFadeIn 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default BlogSummarizerPage;










