import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleViewerModal.css";

const ScheduleViewerModal = ({ isOpen, onClose, filteredSchedule }) => {
  if (!isOpen) return null;

  const sortedSchedule = [...filteredSchedule].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );
  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal">
        <h2>오늘의 일정</h2>
        <div className="schedule-content">
          {sortedSchedule.map((schedule) => (
            <div key={schedule.id} className="schedule-item">
              
              <div className="schedule-info">
                <p>제목 : {schedule.title}</p>
                <p>장소 : {schedule.place}</p>
                <p>내용 : {schedule.content || "내용 없음"}</p>
                <div className="schedule-details">
                <div className="schedule-date">
                  <p>
                    {new Date(schedule.start).toLocaleString()} ~{" "}
                    {new Date(schedule.end).toLocaleString()}
                  </p>
                </div>
                <div className="schedule-actions">
                  <button className="edit-button">수정</button>
                  <button className="delete-button">삭제</button>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal_buttons">
        <button className="close-button" onClick={onClose}>
          일정 추가
        </button>
        <button className="close-button" onClick={onClose}>
          닫기
        </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewerModal;
