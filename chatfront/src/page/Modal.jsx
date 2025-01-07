import React, { useState } from "react";

const Modal = ({ selectedDate, onClose, onAddEvent }) => {
  const [title, setTitle] = useState(""); // 입력 필드 상태

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    if (title.trim()) {
      onAddEvent(title); // 부모 컴포넌트에 이벤트 추가 요청
      setTitle(""); // 입력 필드 초기화
    } else {
      alert("일정 제목을 입력해주세요!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>일정 추가</h2>
        <p>선택한 날짜: {selectedDate}</p>
        <input
          type="text"
          placeholder="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>저장</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
