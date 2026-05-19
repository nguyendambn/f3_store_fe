import { Clock, MessageCircle, Send, User, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getChatRooms } from '../../../services/admin/chatRoom.service';
import { getMessage } from '../../../services/admin/chatMessage.service';
import { useSelector } from 'react-redux';
import { getStompClient } from '../../../helpers/stompClient';

const ChatRoomComponent = () => {
  const stomp = getStompClient();
  const listChatRef = useRef(null);
  const profile = useSelector((state) => state.infor);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRoomListOpen, setIsRoomListOpen] = useState(false);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    const fetchApi = async () => {
      setLoading(true);
      const res = await getChatRooms();
      if (res.status === 200) {
        setChatRooms(res.data.result);
      }
      setLoading(false);
    };
    fetchApi();
  }, []);

  useEffect(() => {
    if (!selectedRoom || !stomp.connected) return;

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    subscriptionRef.current = stomp.subscribe(`/topic/room/${selectedRoom.chatRoomId}`, (message) => {
      const data = JSON.parse(message.body);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [stomp.connected, selectedRoom]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isRoomListOpen && listChatRef.current && !listChatRef.current.contains(event.target)) {
        setIsRoomListOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRoomListOpen]);

  const handleRoomSelect = async (room) => {
    setLoading(true);
    const res = await getMessage({ roomId: room.chatRoomId, userId: room.userId });
    setSelectedRoom(room);
    setMessages(res.data.result || []);
    setIsRoomListOpen(false);
    setLoading(false);
  };

  const handleSendMessage = () => {
    if (stomp.connected && newMessage.trim() && selectedRoom) {
      stomp.publish({
        destination: `/app/room/${selectedRoom.chatRoomId}`,
        body: JSON.stringify({
          message: newMessage,
          senderId: profile.id,
          receiverId: selectedRoom.userId,
          createdAt: new Date().toISOString(),
        }),
      });
      setNewMessage('');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (

    <>
      {/* Mobile Menu Toggle Button */}

      <div className="flex flex-col md:flex-row h-full bg-gray-50 relative overflow-hidden">
        <button
         
          onClick={() => setIsRoomListOpen(!isRoomListOpen)}
        >
          {isRoomListOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Chat Rooms List */}
        <div 
        ref={listChatRef}
        className={`fixed md:static inset-0 md:w-80 bg-white shadow-2xl border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ${isRoomListOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 md:p-6 bg-gradient-to-r from-gray-800 to-black text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <MessageCircle size={20} />
                </div>
                Phòng Chat
              </h2>
              <p className="text-gray-300 text-xs md:text-sm mt-1">Kết nối với mọi người</p>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-2">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRoomSelect(room)}
                  className={`group p-3 md:p-4 m-2 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${selectedRoom?.id === room.id
                    ? 'bg-gray-100 border-2 border-gray-300 shadow-lg transform scale-[1.02]'
                    : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative">
                      <img
                        src={room.avatar}
                        alt={room.name}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-lg ring-2 ring-white group-hover:ring-gray-300 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-800 truncate text-base md:text-lg group-hover:text-gray-900 transition-colors">
                          {room.name}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2"></span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 truncate">Tin nhắn cuối cùng...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 flex flex-col bg-white shadow-xl relative">
          {selectedRoom ? (
            <>
              <div className="p-4 md:p-6 bg-white border-b border-gray-100 shadow-sm backdrop-blur-sm relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-gray-600 to-black rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
                        {selectedRoom.name?.charAt(0) || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-base md:text-lg">{selectedRoom.name}</h3>
                      <p className="text-xs md:text-sm text-green-500 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Đang hoạt động
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Clock size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6 space-y-4 md:space-y-6 relative scrollbar-thin">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.3) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-gray-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-4 border-gray-800 border-t-transparent absolute top-0 left-0"></div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === profile.id ? 'justify-end' : 'justify-start'} mb-3 md:mb-4`}
                      >
                        <div
                          className={`max-w-[80%] md:max-w-md px-4 md:px-6 py-3 md:py-4 rounded-3xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${message.senderId === profile.id
                            ? 'bg-gradient-to-r from-gray-700 to-black text-white ml-auto'
                            : 'bg-white/80 text-gray-800 border border-gray-100 mr-auto'
                            }`}
                        >
                          <p className="text-sm md:text-base leading-relaxed font-medium">{message.message}</p>
                          <div
                            className={`flex items-center gap-2 mt-2 md:mt-3 text-xs ${message.senderId === profile.id ? 'text-white/70' : 'text-gray-500'}`}
                          >
                            <Clock size={10} />
                            <span>{message.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 md:p-6 shadow-2xl">
                <div className="flex gap-3 md:gap-4 items-end">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleInputKeyPress}
                      placeholder="Nhập tin nhắn của bạn..."
                      className="w-full border-2 border-gray-200 rounded-3xl px-4 md:px-6 py-3 md:py-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 shadow-lg bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 text-sm md:text-base"
                    />
                    <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-gray-700 to-black text-white px-6 md:px-8 py-3 md:py-4 rounded-3xl hover:from-gray-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-xl font-semibold hover:scale-105 active:scale-95"
                  >
                    <Send size={16} />
                    Gửi
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>

              <div className="text-center p-8 md:p-12 relative z-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-gray-600 to-black rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-2xl animate-bounce">
                  <MessageCircle size={48} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">Chọn một phòng chat</h3>
                <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                  Chọn phòng chat từ danh sách để bắt đầu cuộc trò chuyện
                </p>
                <div className="mt-6 md:mt-8 flex justify-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-700 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

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
          
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 10px;
          }
          
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.8);
          }
  
          @media (max-width: 768px) {
            .fixed {
              z-index: 40;
              height: 100vh;
              width: 80%;
              max-width: 300px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default ChatRoomComponent;