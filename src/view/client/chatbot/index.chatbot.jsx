import { Bot, MessageCircle, Reply, Send, Trash, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStompClient } from '../../../helpers/stompClient';
import { sendQuestion } from '../../../services/Client/chatbot.service';
import { createChatRoom } from '../../../services/Client/chatRoom.service';

export default function Chatbot() {
    const chatbotRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const subscriptionRef = useRef(null);
    const [needSupport, setNeedSupport] = useState(false);

    const [messageWithAI, setMessageWithAI] = useState([
        { role: 'bot', content: 'Xin chào! Tôi có thể giúp gì cho bạn?', timestamp: new Date() },
    ]);
    const [messageWithAdmin, setMessageWithAdmin] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mode, setMode] = useState('AI');
    const [chatRoomId, setChatRoomId] = useState(null);

    const profile = useSelector(state => state.infor);
    const stomp = getStompClient();

    // WebSocket Subscription
    useEffect(() => {
        if (!stomp.connected || !chatRoomId) return;

        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = stomp.subscribe(`/topic/room/${chatRoomId}`, (message) => {
            const data = JSON.parse(message.body);
            setMessageWithAdmin(prev => [...prev, data]);
        });

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
        };
    }, [stomp.connected, chatRoomId]);

    // Auto scroll
    useEffect(() => {
        if (isChatOpen) {
            scrollToBottom();
            setUnreadCount(0);
        } else if (messageWithAI.at(-1)?.role === 'bot') {
            setUnreadCount(prev => prev + 1);
        }
    }, [messageWithAI, isChatOpen]);

    useEffect(() => {
        if (isChatOpen && mode === 'admin') {
            scrollToBottom();
        }
    }, [messageWithAdmin, isChatOpen, mode]);


    useEffect(() => {
        if (isChatOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isChatOpen]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isChatOpen && chatbotRef.current && !chatbotRef.current.contains(e.target)) {
                setIsChatOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isChatOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (date) =>
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const clearChat = () => {
        setMessageWithAI([
            { role: 'bot', content: 'Lịch sử chat đã được xóa. Tôi có thể giúp gì cho bạn?', timestamp: new Date() },
        ]);
    };

    const handleCreateChatRoom = async () => {
        const res = await createChatRoom();
        if (res.status === 200) {
            const { messages, chatRoomId } = res.data.result;
            setMessageWithAdmin(messages);
            setChatRoomId(chatRoomId);
            setMode('admin');
        }
    };

    const handleSendMessageWithAI = async () => {
        const question = inputValue.trim();
        if (!question) return;

        const userMessage = { role: 'user', content: question, timestamp: new Date() };
        setMessageWithAI(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            let botMessage;
            const res = await sendQuestion({ question });
            if (!res.data.result.needAdminSupport) {
                botMessage = {
                    role: 'bot',
                    content: res.data.result.answer,
                    timestamp: new Date(),
                };
                setMessageWithAI(prev => [...prev, botMessage]);
            } else {
                botMessage = {
                    role: 'bot',
                    content: res.data.result.answer,
                    timestamp: new Date(),
                };
                setMessageWithAI(prev => [...prev, botMessage]);
            }
            setNeedSupport(res.data.result.needAdminSupport)
        } catch {
            setMessageWithAI(prev => [
                ...prev,
                { role: 'bot', content: 'Xin lỗi, tôi không thể trả lời ngay lúc này.', timestamp: new Date() },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessageWithAdmin = () => {
        const message = inputValue.trim();
        if (stomp.connected && message) {
            stomp.publish({
                destination: `/app/room/${chatRoomId}`,
                body: JSON.stringify({
                    message,
                    senderId: profile.id,
                    receiverId: profile.id,
                    createdAt: new Date(),
                }),
            });
            setInputValue('');
        }
    };

    const handleInputKeyPress = (e) => {
        if (e.key === 'Enter') {
            mode === 'AI' ? handleSendMessageWithAI() : handleSendMessageWithAdmin();
        }
    };

    return (
        <div className="fixed bottom-16 right-6 flex flex-col items-end z-50">
            {/* Chat button */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="relative bg-gradient-to-r bg-[#00ADEF] text-white rounded-full shadow-lg p-4 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                    {/* Hiệu ứng viền rung */}
                    {unreadCount > 0 && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-[#00abefb4] opacity-75 z-0"></span>
                    )}

                    {/* Nội dung nút */}
                    <div className="relative z-10 flex items-center">
                        <MessageCircle size={24} />
                    </div>

                    {/* Badge số tin nhắn */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center z-20">
                            {unreadCount}
                        </span>
                    )}
                </button>

            )}

            {/* Chat popup */}
            {isChatOpen && (
                <div
                    ref={chatbotRef}
                    className="flex flex-col bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-[500px] sm:h-128 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 flex justify-between items-center">
                        <div className="flex items-center">
                            <Bot className="mr-2" size={20} />
                            <h2 className="font-semibold">Chuyên viên tư vấn</h2>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={clearChat}
                                className="p-1 rounded-full hover:bg-blue-600 transition"
                                title="Xóa lịch sử chat"
                            >
                                <Trash size={16} />
                            </button>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="p-1 rounded-full hover:bg-blue-600 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    {
                        mode == 'AI' ? (
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                                {messageWithAI.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs rounded-lg p-3 ${message.role === 'user'
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none shadow-md'
                                                : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-100'
                                                }`}
                                        >
                                            <p className="text-sm whitespace-pre-wrap" >{message.content}</p>
                                            {index == messageWithAI.length - 1 && needSupport && (
                                                <button
                                                    onClick={handleCreateChatRoom}
                                                    className="mt-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium text-sm
                                                        border-0 shadow-lg shadow-green-500/25 
                                                        hover:from-green-600 hover:to-emerald-700 hover:shadow-green-500/40 hover:-translate-y-0.5
                                                        active:translate-y-0 active:shadow-green-500/20
                                                        transition-all duration-200 ease-out
                                                        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                                                >
                                                    Chat với nhân viên hỗ trợ
                                                </button>
                                            )}
                                            <div
                                                className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                                    }`}
                                            >
                                                {formatTime(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 shadow-md border border-gray-100 flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.4s' }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                        ) : (
                            <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-3">
                                {messageWithAdmin.length > 0 && messageWithAdmin.map((m, i) => {
                                    const isOwn = m.senderId === profile.id;
                                    return (
                                        <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-xs p-3 rounded-lg shadow-md ${isOwn
                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                                                <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {m.createdAt}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )
                    }
                    {/* Input Area */}
                    <div className="p-3 border-t border-gray-200 bg-white">
                        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            {
                                needSupport && <button
                                    onClick={() => {
                                        setNeedSupport(false);
                                        setMode("AI")
                                    }}
                                    className={`p-2 rounded-full text-blue-500 hover:bg-blue-100 transition-colors`}
                                >
                                    <Reply size={18} />
                                </button>
                            }
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleInputKeyPress}
                                placeholder="Nhập tin nhắn của bạn..."
                                className="flex-1 bg-transparent border-none focus:outline-none py-2 px-1 text-sm"
                            />
                            <button
                                onClick={mode == "AI" ? handleSendMessageWithAI : handleSendMessageWithAdmin}
                                disabled={inputValue.trim() === ''}
                                className={`p-2 rounded-full ${inputValue.trim() === ''
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-blue-500 hover:bg-blue-100'
                                    } transition-colors`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add styles for animation */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}