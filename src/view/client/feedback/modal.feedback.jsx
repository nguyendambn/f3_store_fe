// // import { useState } from 'react';
// // import { Star, X, User, Calendar, Edit3, CheckCircle } from 'lucide-react';
// // import { Button, Flex, Modal, Rate } from 'antd';

// // export default function FeedbackModal() {
// //     const [open, setOpen] = useState(false);
// //     const [loading, setLoading] = useState(true);
// //     const desc = ['Rất kém', 'Kém', 'Trung bình', 'Tốt', 'Xuất sắc'];
// //     const [value, setValue] = useState(3);
// //     const [review, setReview] = useState('');

// //     const showLoading = () => {
// //         setOpen(true);
// //         setLoading(true);
// //         setTimeout(() => {
// //             setLoading(false);
// //         }, 1000);
// //     };
// //     return (
// //         <>
// //             <div onClick={showLoading}>Đánh giá</div>
// //             <Modal
// //                 title={<p>Loading Modal</p>}
// //                 footer={
// //                     <Button type="primary" onClick={showLoading}>
// //                         Reload
// //                     </Button>
// //                 }
// //                 loading={loading}
// //                 open={open}
// //                 onCancel={() => setOpen(false)}
// //             >
// //                 <div>
// //                     <div>Điểm đánh giá</div>
// //                     <Flex gap="middle" vertical>
// //                         <Rate tooltips={desc} onChange={setValue} value={value} />

// //                     </Flex>
// //                 </div>
// //                 <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-3">
// //                         Nhận xét chi tiết
// //                     </label>
// //                     <textarea
// //                         value={review}
// //                         onChange={(e) => setReview(e.target.value)}
// //                         placeholder="Chia sẻ trải nghiệm cụ thể của bạn..."
// //                         rows={4}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition-all"
// //                         maxLength={400}
// //                     />
// //                     <div className="text-right text-xs text-gray-500 mt-1">
// //                         {review.length}/400
// //                     </div>
// //                 </div>
// //             </Modal>
// //         </>
// //     )
// // }

// import { useState } from 'react';
// import { Star, CheckCircle, MessageSquare, Sparkles } from 'lucide-react';
// import { Button, Flex, Modal, Rate } from 'antd';

// export default function FeedbackModal() {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [value, setValue] = useState(3);
//     const [review, setReview] = useState('');
//     const desc = ['Rất kém', 'Kém', 'Trung bình', 'Tốt', 'Xuất sắc'];

//     const showModal = () => {
//         setOpen(true);
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//         }, 600);
//     };

//     const handleSubmit = () => {
//         console.log('Đánh giá:', value, 'Nhận xét:', review);
//         setOpen(false);
//     };

//     return (
//         <>
//             <button
//                 onClick={showModal}
//                 className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-sm"
//             >
//                 <div className="relative flex items-center gap-2">
//                     <MessageSquare size={14} />
//                     Đánh giá
//                 </div>
//             </button>

//             <Modal
//                 title={
//                     <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
//                         <CheckCircle className="text-green-600" size={20} />
//                         Gửi đánh giá của bạn
//                     </div>
//                 }
//                 open={open}
//                 onCancel={() => setOpen(false)}
//                 onOk={handleSubmit}
//                 okText="Đánh giá"
//                 cancelText="Hủy"
//                 centered
//             >
//                 <div className="space-y-6">
//                     {/* Đánh giá sao */}
//                     <div className='mx-auto w-fullx'>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Mức độ hài lòng
//                         </label>
//                         <Flex gap="middle" vertical>
//                             <Rate
//                                 tooltips={desc}
//                                 onChange={setValue}
//                                 value={3}
//                             />
//                             {value ? (
//                                 <span className="text-sm text-gray-600">
//                                     {desc[value - 1]}
//                                 </span>
//                             ) : null}
//                         </Flex>
//                     </div>

//                     {/* Nhận xét chi tiết */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Nhận xét chi tiết
//                         </label>
//                         <textarea
//                             value={review}
//                             onChange={(e) => setReview(e.target.value)}
//                             placeholder="Chia sẻ trải nghiệm cụ thể của bạn..."
//                             rows={4}
//                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none transition-all"
//                             maxLength={400}
//                         />
//                         <div className="text-right text-xs text-gray-500 mt-1">
//                             {review.length}/400 ký tự
//                         </div>
//                     </div>
//                 </div>
//             </Modal>
//         </>
//     );
// }

import { useState } from 'react';
import { CheckCircle, MessageSquare } from 'lucide-react';
import { Button, Flex, Modal, Rate } from 'antd';
import { toast } from 'react-toastify';
import { notification } from '../../../helpers/toast';
import { createFeedback } from "../../../services/Client/feedback.service";

export default function FeedbackModal({ product }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [review, setReview] = useState('');
    const desc = ['Rất kém', 'Kém', 'Trung bình', 'Tốt', 'Xuất sắc'];

    const handleCancle = () => {
        setReview("");
        setValue(0);
        setOpen(false);
    }

    const handleSubmit = async () => {
        if(value == 0 || review.trim() == ""){
            notification(toast, "Vui lòng nhập đủ thông tin");
            return;
        }
        const res = await createFeedback({productId:product.id, rate: value, description: review});
        if(res.status === 200){
            notification(toast, "Đánh giá thành công", "success");
            handleCancle();
        }
    };

    // Hàm chọn màu theo mức độ sao
    const getDescColor = (val) => {
        if (val == 1) return 'text-red-900';
        if (val == 2) return 'text-red-500';
        if (val === 3) return 'text-yellow-500';
        if (val === 4) return 'text-blue-500';
        return 'text-green-600';
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="group relative px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-sm"
            >
                <div className="relative flex items-center gap-2">
                    <MessageSquare size={14} />
                    Đánh giá
                </div>
            </button>

            <Modal
                title={
                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        <CheckCircle className="text-green-600" size={20} />
                        Gửi đánh giá của bạn
                    </div>
                }
                open={open}
                onCancel={handleCancle}
                onOk={handleSubmit}
                footer={
                    <div className="flex justify-end gap-2">
                        <Button onClick={handleCancle}>Hủy</Button>
                        <Button type="primary" onClick={handleSubmit}>
                            Gửi đánh giá
                        </Button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Đánh giá sao */}
                    <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mức độ hài lòng
                        </label>
                        <Flex vertical align="center">
                            <Rate
                                tooltips={desc}
                                onChange={setValue}
                                value={value}
                            />
                            {value ? (
                                <span className={`mt-2 text-sm font-medium ${getDescColor(value)}`}>
                                    {desc[value - 1]}
                                </span>
                            ) : null}
                        </Flex>
                    </div>

                    {/* Nhận xét chi tiết */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhận xét chi tiết
                        </label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm cụ thể của bạn..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
                            maxLength={400}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {review.length}/400 ký tự
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
