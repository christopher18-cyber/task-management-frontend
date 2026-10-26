import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import {
    LogOut,
    LayoutDashboard,
    Plus,
    Activity,
    History,
    Trash2,
    ChevronDown,
    FolderPlus,
    UserPlus,
    KeyRound,
    AlertTriangle,
    X,
} from "lucide-react";
import type { Board, Column, Card, ActivityLog } from "../types/kanbas";
import { getBoardsApi, createBoardApi, deleteBoardApi } from "../services/boardServices";
import {
    getColumnsByBoardApi,
    createColumnApi,
    deleteColumnApi,
} from "../services/columnServices";
import { getCardsByBoardApi, updateCardApi } from "../services/cardServices";
import { getBoardActivitiesApi } from "../services/activityServices";

import CreateTaskModal from "../components/CreateTaskModal";
import CreateColumnModal from "../components/CreateColumnModal";
import CreateBoardModal from "../components/CreateBoardModal";
import TaskDetailModal from "../components/TaskDetailModal";
import InviteMemberModal from "../components/InviteMemberModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

interface DeleteBoardModalProps {
    isOpen: boolean;
    boardTitle: string;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteBoardModal({ isOpen, boardTitle, onClose, onConfirm }: DeleteBoardModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" /> Delete Board
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                    Are you sure you want to delete <span className="font-bold text-white">"{boardTitle}"</span>? This will permanently remove all associated columns, task cards, and activity logs.
                </p>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold transition-colors"
                    >
                        Delete Board
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [boards, setBoards] = useState<Board[]>([]);
    const [activeBoard, setActiveBoard] = useState<Board | null>(null);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [showActivityDrawer, setShowActivityDrawer] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false);
    const [isDeleteBoardModalOpen, setIsDeleteBoardModalOpen] = useState<boolean>(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
    const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);

    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchInitialBoards();
    }, []);

    useEffect(() => {
        if (activeBoard?._id) {
            fetchBoardContent(activeBoard._id);
            fetchActivities(activeBoard._id);
        }
    }, [activeBoard?._id]);

    const fetchInitialBoards = async () => {
        try {
            setLoading(true);
            const userBoards = await getBoardsApi();
            setBoards(userBoards || []);
            if (userBoards && userBoards.length > 0) {
                setActiveBoard(userBoards[0]);
            }
        } catch (err) {
            console.error("Error fetching boards:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBoardContent = async (boardId: string) => {
        try {
            setLoading(true);
            const [columnsData, cardsData] = await Promise.all([
                getColumnsByBoardApi(boardId),
                getCardsByBoardApi(boardId),
            ]);

            const columnsWithCards = (columnsData || []).map((col: Column) => ({
                ...col,
                cards: (cardsData || []).filter(
                    (card: any) =>
                        card.columnId === col._id || card.columnId?._id === col._id
                ),
            }));

            setActiveBoard((prev) =>
                prev ? { ...prev, columns: columnsWithCards } : null
            );
        } catch (err) {
            console.error("Error fetching board content:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async (boardId: string) => {
        try {
            const logs = await getBoardActivitiesApi(boardId);
            setActivities(Array.isArray(logs) ? logs : []);
        } catch (err) {
            console.error("Error fetching activities:", err);
        }
    };

    // Drag-and-Drop Handler
    const handleDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination || !activeBoard) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceColIndex = activeBoard.columns.findIndex((c) => c._id === source.droppableId);
        const destColIndex = activeBoard.columns.findIndex((c) => c._id === destination.droppableId);

        if (sourceColIndex === -1 || destColIndex === -1) return;

        const sourceCol = activeBoard.columns[sourceColIndex];
        const destCol = activeBoard.columns[destColIndex];

        const sourceCards = Array.from(sourceCol.cards || []);
        const destCards = sourceColIndex === destColIndex ? sourceCards : Array.from(destCol.cards || []);

        const [movedCard] = sourceCards.splice(source.index, 1);
        const updatedCard = { ...movedCard, columnId: destCol._id };
        destCards.splice(destination.index, 0, updatedCard);

        const updatedColumns = [...activeBoard.columns];
        if (sourceColIndex === destColIndex) {
            updatedColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards };
        } else {
            updatedColumns[sourceColIndex] = { ...sourceCol, cards: sourceCards };
            updatedColumns[destColIndex] = { ...destCol, cards: destCards };
        }

        setActiveBoard({ ...activeBoard, columns: updatedColumns });

        try {
            await updateCardApi(draggableId, {
                columnId: destCol._id,
                order: destination.index,
            });
            fetchActivities(activeBoard._id);
        } catch (err: any) {
            console.error("Failed to persist drag reorder:", err);
            fetchBoardContent(activeBoard._id);
        }
    };

    const handleBoardCreated = (newBoard: Board) => {
        setBoards((prev) => [...prev, newBoard]);
        setActiveBoard(newBoard);
    };

    const handleDeleteBoard = async () => {
        if (!activeBoard) return;
        try {
            await deleteBoardApi(activeBoard._id);
            const remainingBoards = boards.filter((b) => b._id !== activeBoard._id);
            setBoards(remainingBoards);
            setActiveBoard(remainingBoards.length > 0 ? remainingBoards[0] : null);
        } catch (err: any) {
            alert(err.message || "Failed to delete board.");
        }
    };

    const handleCreateDefaultBoard = async () => {
        try {
            const newBoard = await createBoardApi({
                title: "My First Project Board",
                description: "Created from Kanban workspace",
            });
            handleBoardCreated(newBoard);
        } catch (err: any) {
            alert(err.message || "Failed to create default board.");
        }
    };

    const handleCreateDefaultColumns = async () => {
        if (!activeBoard) return;
        try {
            setLoading(true);
            await createColumnApi({ title: "To Do", boardId: activeBoard._id });
            await createColumnApi({ title: "In Progress", boardId: activeBoard._id });
            await createColumnApi({ title: "Done", boardId: activeBoard._id });
            await fetchBoardContent(activeBoard._id);
            fetchActivities(activeBoard._id);
        } catch (err: any) {
            alert(err.message || "Failed to create default columns.");
            setLoading(false);
        }
    };

    const handleDeleteColumn = async (columnId: string) => {
        if (!activeBoard || !confirm("Are you sure you want to delete this column?")) return;
        try {
            await deleteColumnApi(columnId);
            setActiveBoard({
                ...activeBoard,
                columns: activeBoard.columns.filter((c) => c._id !== columnId),
            });
            fetchActivities(activeBoard._id);
        } catch (err: any) {
            alert(err.message || "Failed to delete column.");
        }
    };

    const handleOpenAddTaskModal = (columnId: string) => {
        setSelectedColumnId(columnId);
        setIsTaskModalOpen(true);
    };

    const handleCardCreated = (newCard: Card) => {
        if (!activeBoard) return;
        const updatedColumns = activeBoard.columns.map((col) => {
            if (col._id === newCard.columnId) {
                return { ...col, cards: [...(col.cards || []), newCard] };
            }
            return col;
        });
        setActiveBoard({ ...activeBoard, columns: updatedColumns });
        fetchActivities(activeBoard._id);
    };

    const handleCardUpdated = (updatedCard: Card) => {
        if (!activeBoard) return;
        const updatedColumns = activeBoard.columns.map((col) => ({
            ...col,
            cards: col.cards?.map((card) => (card._id === updatedCard._id ? updatedCard : card)) || [],
        }));
        setActiveBoard({ ...activeBoard, columns: updatedColumns });
        fetchActivities(activeBoard._id);
    };

    const handleCardDeleted = (cardId: string) => {
        if (!activeBoard) return;
        const updatedColumns = activeBoard.columns.map((col) => ({
            ...col,
            cards: col.cards?.filter((card) => card._id !== cardId) || [],
        }));
        setActiveBoard({ ...activeBoard, columns: updatedColumns });
        fetchActivities(activeBoard._id);
    };

    const handleColumnCreated = (newColumn: Column) => {
        if (!activeBoard) return;
        setActiveBoard({
            ...activeBoard,
            columns: [...(activeBoard.columns || []), { ...newColumn, cards: [] }],
        });
        fetchActivities(activeBoard._id);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const getPriorityBadge = (priority: Card["priority"]) => {
        switch (priority) {
            case "high":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            case "medium":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            default:
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col w-full overflow-x-hidden">
            {/* Header Navbar */}
            <header className="flex flex-col md:flex-row justify-between items-stretch md:items-center p-4 border-b border-slate-800 bg-slate-900 px-4 md:px-6 gap-4">
                {/* Left section: Logo & Boards */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1 md:pb-0">
                    <div className="p-2 bg-purple-600/10 border border-purple-500/20 rounded-xl text-purple-400 shrink-0">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>

                    {boards.length > 0 && (
                        <div className="relative shrink-0">
                            <select
                                value={activeBoard?._id || ""}
                                onChange={(e) => {
                                    const selected = boards.find((b) => b._id === e.target.value);
                                    if (selected) setActiveBoard(selected);
                                }}
                                className="bg-slate-950 border border-slate-800 text-white font-bold text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-purple-500 cursor-pointer appearance-none pr-8"
                            >
                                {boards.map((b) => (
                                    <option key={b._id} value={b._id}>
                                        {b.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
                        </div>
                    )}

                    <button
                        onClick={() => setIsBoardModalOpen(true)}
                        className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-purple-400 transition-colors shrink-0"
                        title="Create New Board"
                    >
                        <FolderPlus className="w-4 h-4" />
                    </button>

                    {activeBoard && (
                        <button
                            onClick={() => setIsDeleteBoardModalOpen(true)}
                            className="p-2 bg-slate-950 hover:bg-slate-800 border border-red-500/20 rounded-xl text-red-400 transition-colors shrink-0"
                            title="Delete Current Board"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Right section: Action Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    {activeBoard && (
                        <>
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-xs md:text-sm text-purple-400 transition-colors shrink-0"
                            >
                                <UserPlus className="w-4 h-4" /> Invite
                            </button>

                            <button
                                onClick={() => setIsColumnModalOpen(true)}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors shrink-0"
                            >
                                <Plus className="w-4 h-4" /> Add Column
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-xs md:text-sm text-slate-300 transition-colors shrink-0"
                        title="Change Password"
                    >
                        <KeyRound className="w-4 h-4 text-purple-400" /> <span className="hidden sm:inline">Password</span>
                    </button>

                    <button
                        onClick={() => setShowActivityDrawer(!showActivityDrawer)}
                        className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-xs md:text-sm text-slate-300 transition-colors shrink-0"
                    >
                        <History className="w-4 h-4 text-purple-400" /> <span className="hidden sm:inline">Activity Log</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-2 rounded-xl text-xs md:text-sm text-slate-300 transition-colors shrink-0"
                    >
                        <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            {/* Main Content View with DragDropContext */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 p-6 overflow-x-auto flex flex-col items-center justify-center">
                    {loading ? (
                        <div className="text-slate-400 text-sm">Loading workspace...</div>
                    ) : !activeBoard ? (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md space-y-4 shadow-xl">
                            <h3 className="text-lg font-bold text-white">No Boards Found</h3>
                            <p className="text-xs text-slate-400">
                                Create your first board to get started!
                            </p>
                            <button
                                onClick={handleCreateDefaultBoard}
                                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors"
                            >
                                Create First Board
                            </button>
                        </div>
                    ) : !activeBoard.columns || activeBoard.columns.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center max-w-md space-y-4 shadow-xl">
                            <h3 className="text-lg font-bold text-white">Board is Empty</h3>
                            <p className="text-xs text-slate-400">
                                This board doesn't have any columns yet.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCreateDefaultColumns}
                                    className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Default Columns
                                </button>
                                <button
                                    onClick={() => setIsColumnModalOpen(true)}
                                    className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Custom Column
                                </button>
                            </div>
                        </div>
                    ) : (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <div className="flex gap-6 items-start min-h-full w-full">
                                {activeBoard.columns.map((col: Column) => (
                                    <Droppable key={col._id} droppableId={col._id}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-160px)] min-h-[350px]"
                                            >
                                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
                                                    <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                                                        {col.title}
                                                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                                                            {col.cards?.length || 0}
                                                        </span>
                                                    </h3>
                                                    <button
                                                        onClick={() => handleDeleteColumn(col._id)}
                                                        className="text-slate-500 hover:text-red-400 transition-colors"
                                                        title="Delete Column"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-[150px]">
                                                    {col.cards?.map((card: Card, index: number) => (
                                                        <Draggable key={card._id} draggableId={card._id} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => {
                                                                        setSelectedCard(card);
                                                                        setIsDetailModalOpen(true);
                                                                    }}
                                                                    className={`bg-slate-950 border border-slate-800/80 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-grab active:cursor-grabbing shadow-sm space-y-3 ${
                                                                        snapshot.isDragging ? "ring-2 ring-purple-500 opacity-90 scale-[1.02]" : ""
                                                                    }`}
                                                                >
                                                                    <div className="flex justify-between items-start">
                                                                        <h4 className="text-sm font-medium text-white">{card.title}</h4>
                                                                        <span
                                                                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${getPriorityBadge(
                                                                                card.priority
                                                                            )}`}
                                                                        >
                                                                            {card.priority}
                                                                        </span>
                                                                    </div>
                                                                    {card.description && (
                                                                        <p className="text-xs text-slate-400 line-clamp-2">
                                                                            {card.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>

                                                <button
                                                    onClick={() => handleOpenAddTaskModal(col._id)}
                                                    className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-medium text-purple-400 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" /> Add Card
                                                </button>
                                            </div>
                                        )}
                                    </Droppable>
                                ))}
                            </div>
                        </DragDropContext>
                    )}
                </div>

                {/* Activity Log Drawer Sidebar */}
                {showActivityDrawer && (
                    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col h-full shrink-0">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                            <h2 className="text-sm font-bold flex items-center gap-2 text-white">
                                <Activity className="w-4 h-4 text-purple-400" /> Activity History
                            </h2>
                            <button
                                onClick={() => setShowActivityDrawer(false)}
                                className="text-slate-500 hover:text-slate-300 text-xs"
                            >
                                Close
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {activities.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-4">No recent activity.</p>
                            ) : (
                                activities.map((act) => (
                                    <div key={act._id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                                        <p className="text-slate-300 font-medium">{act.action}</p>
                                        {act.details && <p className="text-slate-400 text-[11px]">{act.details}</p>}
                                        <p className="text-[10px] text-slate-500">
                                            {new Date(act.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>
                )}
            </div>

            {/* Modals */}
            <CreateBoardModal
                isOpen={isBoardModalOpen}
                onClose={() => setIsBoardModalOpen(false)}
                onBoardCreated={handleBoardCreated}
            />

            <DeleteBoardModal
                isOpen={isDeleteBoardModalOpen}
                boardTitle={activeBoard?.title || ""}
                onClose={() => setIsDeleteBoardModalOpen(false)}
                onConfirm={handleDeleteBoard}
            />

            <ChangePasswordModal
                isOpen={isChangePasswordOpen}
                onClose={() => setIsChangePasswordOpen(false)}
            />

            {selectedColumnId && activeBoard && (
                <CreateTaskModal
                    columnId={selectedColumnId}
                    boardId={activeBoard._id}
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onCardCreated={handleCardCreated}
                />
            )}

            {activeBoard && (
                <>
                    <CreateColumnModal
                        boardId={activeBoard._id}
                        isOpen={isColumnModalOpen}
                        onClose={() => setIsColumnModalOpen(false)}
                        onColumnCreated={handleColumnCreated}
                    />

                    <InviteMemberModal
                        boardId={activeBoard._id}
                        isOpen={isInviteModalOpen}
                        onClose={() => setIsInviteModalOpen(false)}
                    />
                </>
            )}

            <TaskDetailModal
                card={selectedCard}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedCard(null);
                }}
                onCardUpdated={handleCardUpdated}
                onCardDeleted={handleCardDeleted}
            />
        </div>
    );
}