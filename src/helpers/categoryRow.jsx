import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, Pencil, Trash, Plus } from "lucide-react";
import CreateCategory from "../view/admin/category/create.category";
import UpdateCategory from "../view/admin/category/update.category";

function CategoryRow({ category, level = 0, categoryId, reload, parentCategoryName }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Thêm trạng thái modal
    const hasChildren = category.children && category.children.length > 0;

    function getFolderColor(level) {
        const colors = [
            "text-yellow-500",
            "text-green-500",
            "text-blue-500",
            "text-purple-500",
            "text-pink-500",
            "text-red-500",
        ];
        return colors[level % colors.length];
    }

    const handleOpenModal = () => {
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <tr className="group hover:bg-gray-50 transition">
                <td className="px-4 py-2" colSpan={2}>
                    <div style={{ marginLeft: `${level * 16}px` }}>
                        <div className="flex items-center mb-1">
                            {hasChildren ? (
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="text-gray-600 hover:text-black focus:outline-none mr-2"
                                >
                                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                            ) : (
                                <div className="w-4 mr-2" />
                            )}
                            <Folder size={16} className={`mr-2 ${getFolderColor(level)}`} />
                            <span className="text-sm text-gray-800">{category.name}</span>
                        </div>

                        <div className="hidden group-hover:flex gap-3 text-xs text-blue-600 ml-6">
                            <UpdateCategory categoryId={categoryId} reload={reload}/>
                            <button
                                onClick={handleOpenModal}
                                className="flex items-center gap-1 hover:underline text-green-600"
                            >
                                <Plus size={14} /> Thêm
                            </button>
                            <button className="flex items-center gap-1 text-red-600 hover:underline">
                                <Trash size={14} /> Xoá
                            </button>
                        </div>
                    </div>
                </td>
            </tr>

            {isModalOpen && (
                <CreateCategory categoryId={categoryId} reload={reload} onClose={handleCloseModal} parentCategoryName={parentCategoryName}/>
            )}

            {hasChildren && isOpen && category.children.map((child) => (
                <CategoryRow key={child.id} category={child} level={level + 1} categoryId={child.id} reload={reload} parentCategoryName={child.name}/>
            ))}
        </>
    );
}

export default CategoryRow;
