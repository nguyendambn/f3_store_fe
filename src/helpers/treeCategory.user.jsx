import { Popover, Transition } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { Fragment } from "react";

// Component đệ quy để render cây danh mục
const RenderCategoryTree = ({ categories, handleChange }) => {
    return categories.map((category) => (
        <Popover key={category.id} className="relative">
            {({ open: subOpen }) => (
                <>
                    <Popover.Button
                        name="categoryId"
                        onClick={() => handleChange({ target: { name: 'categoryId', value: category.id } })}
                        className="w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-gray-100 transition-colors focus:outline-none">
                        <div className="flex items-center">
                            {category.icon && <span className="mr-2">{category.icon}</span>}
                            <span className="text-sm">{category.name}</span>
                        </div>
                        {category.children?.length > 0 && (
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${subOpen ? "rotate-180" : ""
                                    }`}
                            />
                        )}
                    </Popover.Button>

                    {category.children?.length > 0 && (
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Popover.Panel className="px-3 py-2">
                                <div className="pl-6 space-y-1 border-l border-gray-200">
                                    <RenderCategoryTree categories={category.children} handleChange={handleChange}/>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    )}
                </>
            )}
        </Popover>
    ));
};


export default RenderCategoryTree;
