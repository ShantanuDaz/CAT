import { X, Plus, Edit, Trash2 } from "lucide-react";
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
  const [newExam, setNewExam] = useState("");
  const [oldExam, setOldExam] = useState("");

  useEffect(() => {
    if (exams.length === 0) {
      setIsAddingExam(true);
    } else {
      setIsAddingExam(false);
    }
  }, [exams.length]);
  const addNewEaxm = () => {
    const val = newExam.trim();
    if (val === "") return;
    if (store.selectedExam === "" || exams.length === 0)
      store.selectedExam = val;
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
      store.selectedExam = val;
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
      store.selectedExam = Object.keys(updatedContent)[0] || "";
    }
    store.saveTree();
    setIsDeleting(false);
    setOldExam("");
  };
  return (
    <>
      <Modal isOpen={isOpen}>
        <div className="bg-white p-2 rounded-xl">
          <div className="flex justify-end">
            <X onClick={() => closeExams()} />
          </div>
          {isAddingExam || isEditingExam || exams.length === 0 ? (
            <div>
              <input
                type="text"
                placeholder="Exam Name"
                value={newExam}
                onChange={(e) => setNewExam(e.target.value)}
              />
              <button
                onClick={() => (isAddingExam ? addNewEaxm() : EditExamName())}
              >
                {isAddingExam ? "Add" : "Edit"}
              </button>
            </div>
          ) : (
            <div>
              {exams.map((exam) => (
                <div
                  key={exam}
                  className="flex items-center justify-between gap-2"
                >
                  <h4
                    onClick={() => {
                      store.selectedExam = exam;
                      closeExams();
                    }}
                  >
                    {exam}
                  </h4>
                  <div>
                    <button
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                      title="Edit topic"
                      onClick={() => EditingExamName(exam)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete topic"
                      onClick={() => DeletingExam(exam)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {exams.length !== 0 && (
            <Plus onClick={() => setIsAddingExam("adding")} />
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
        message={`Are you sure you want to delete the exam "${oldExam}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default Exams;
