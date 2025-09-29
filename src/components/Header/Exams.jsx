import { X, Plus, Edit, Trash2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal } from "react-simplicity-lib";
import { store } from "../../store/store";
import { useSnapshot } from "valtio";
import ConfirmDialog from "../common/ConfirmDialog";

const Exams = ({ isOpen = false, closeExams = () => {} }) => {
  const snap = useSnapshot(store);
  const exams = Object.keys(snap.content);
  const [isAddingExam, setIsAddingExam] = useState(exams.length === 0);
  const [isEditingExam, setIsEditingExam] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [newExam, setNewExam] = useState("");
  const [oldExam, setOldExam] = useState("");

  useEffect(() => {
    if (exams.length === 0) {
      setIsAddingExam(true);
    } else {
      setIsAddingExam(false);
    }
  }, [exams.length]);

  const addNewEaxm = (addDuplicate = false) => {
    const val = newExam.trim();
    if (val === "") return;
    if (store.selectedExam === "" || exams.length === 0)
      store.setSelectedExam(val);
    if (exams.includes(val) && !addDuplicate) {
      setIsDuplicate(true);
      return;
    }
    store.content = {
      ...store.content,
      [val]: {
        name: val,
        description: "",
        created_at: new Date().toISOString(),
        topics: [],
        contentItems: { notes: [], questions: [], tricks: [] },
      },
    };
    setNewExam("");
    setIsAddingExam(false);
    store.saveTree();
  };

  const EditingExamName = (exam) => {
    setIsEditingExam(true);
    setNewExam(exam);
    setOldExam(exam);
  };

  const EditExamName = () => {
    const val = newExam.trim();
    if (val === "") return;
    const updatedContent = { ...store.content };
    if (val !== oldExam) {
      // Rename the exam key
      updatedContent[val] = { ...updatedContent[oldExam], name: val };
      delete updatedContent[oldExam];
      store.content = updatedContent;
      store.saveTree();
    }
    if (oldExam === store.selectedExam) {
      store.setSelectedExam(val);
    }
    setNewExam("");
    setOldExam("");
    setIsEditingExam(false);
  };

  const DeletingExam = (exam) => {
    setIsDeleting(true);
    setOldExam(exam);
  };

  const DeleteExam = () => {
    const updatedContent = { ...store.content };
    delete updatedContent[oldExam];
    store.content = updatedContent;
    if (store.selectedExam === oldExam) {
      store.setSelectedExam(Object.keys(updatedContent)[0] || "");
    }
    store.saveTree();
    setIsDeleting(false);
    setOldExam("");
  };

  const stopEditing = () => {
    setIsEditingExam(false);
    setIsAddingExam(false);
    setNewExam("");
    setOldExam("");
  };
  return (
    <>
      <Modal isOpen={isOpen} onModalClose={() => closeExams()}>
        <div className="bg-white p-2 rounded-xl min-h-[50vh] min-w-[50vw] grid grid-rows-[max-content_1fr_max-content] gap-1">
          <div className="flex justify-end border-b-2 border-gray-200">
            {(isAddingExam || isEditingExam) && (
              <Undo2
                onClick={() => stopEditing()}
                className="cursor-pointer mr-2"
              />
            )}
            <X onClick={() => closeExams()} className="cursor-pointer" />
          </div>
          <div className="overflow-auto grid">
            {isAddingExam || isEditingExam || exams.length === 0 ? (
              <div className="grid gap-5 m-auto place-content-center place-items-center w-full">
                <input
                  type="text"
                  id="examName"
                  placeholder="Exam Name"
                  value={newExam}
                  onChange={(e) => setNewExam(e.target.value)}
                  className="border-2 border-gray-200 rounded-md p-2 w-full"
                />
                <button
                  onClick={() => (isAddingExam ? addNewEaxm() : EditExamName())}
                  className="bg-blue-500 text-white rounded-md p-2 px-3 w-fit hover:bg-blue-600 transition-colors"
                >
                  {isAddingExam ? "Add" : "Edit"}
                </button>
              </div>
            ) : (
              <div className="h-fit grid gap-2">
                {exams.map((exam) => (
                  <div
                    key={exam}
                    onClick={() => {
                      store.setSelectedExam(exam);
                      closeExams();
                    }}
                    className={`h-fit flex items-center justify-between gap-2 p-2 rounded-xl border-1 border-gray-200 hover:bg-gray-100 cursor-pointer ${
                      snap.selectedExam === exam ? "bg-blue-100" : "bg-gray-50"
                    }`}
                  >
                    <h4>{exam}</h4>
                    <div>
                      <button
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit topic"
                        onClick={(e) => {
                          e.stopPropagation();
                          EditingExamName(exam);
                        }}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete topic"
                        onClick={(e) => {
                          e.stopPropagation();
                          DeletingExam(exam);
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {exams.length !== 0 && (
            <div
              onClick={() => setIsAddingExam(true)}
              className="w-full p-1 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center text-gray-500 hover:text-gray-600"
            >
              <Plus />
            </div>
          )}
        </div>
      </Modal>
      <ConfirmDialog
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setOldExam("");
        }}
        onConfirm={DeleteExam}
        title="Delete Exam"
        message={`Are you sure you want to delete the exam <strong>${oldExam}</strong>? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <ConfirmDialog
        isOpen={isDuplicate}
        onClose={() => {
          setIsDuplicate(false);
        }}
        onConfirm={() => addNewEaxm(true)}
        title="Duplicate Value Found"
        message={`Are you sure you want to replace the exam <strong>${newExam}</strong>? This will remove all the previous content and this action cannot be undone.`}
        confirmText="Duplicate"
        cancelText="Cancel"
      />
    </>
  );
};

export default Exams;
