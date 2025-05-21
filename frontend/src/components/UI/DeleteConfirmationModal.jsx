import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({
    isOpen,
    closeModal,
    onDelete,
    isDeleting,
    title = "سڕینەوەی ئەندام",
    message = "ئایا دڵنیایت لە سڕینەوەی ئەم ئەندامە؟ ئەم کردارە ناگەڕێتەوە.",
    confirmButtonText = "سڕینەوە",
    cancelButtonText = "پەشیمان بوونەوە"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                <div
                    className="fixed inset-0 transition-opacity bg-opacity-75"
                    onClick={closeModal}
                ></div>

                <div className="relative z-20 w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl">
                    <div className="absolute top-0 left-0 pt-4 pl-4">
                        <button
                            onClick={closeModal}
                            className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>

                    <div className="mt-3 text-center">
                        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                        <button
                            onClick={closeModal}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={isDeleting}
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 ml-2 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    سڕینەوە...
                                </span>
                            ) : (
                                confirmButtonText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;