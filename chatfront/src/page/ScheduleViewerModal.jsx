import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./ScheduleViewerModal.css";
import NoScheduleImage from "../NoScheduleImage.jpg";

const ScheduleViewerModal = ({
  isScheduleOpen,
  handelScheduleClick,
  onClose,
  filteredSchedule,
  deleteSchedule,
  setSelectedEventId,
  scheduleDate,
  setIsModalOpen,
  setSelectedEvent,
  setEventTitle,
  setEventPlace,
  setEventContent,
  setStartDate,
  setEndDate,
}) => {
  if (!isScheduleOpen) return null;

  const handleEdit = (schedule) => {
    setSelectedEvent(schedule);
    setSelectedEventId(schedule.id);
    setEventTitle(schedule.title);
    setEventPlace(schedule.place);
    setEventContent(schedule.content || "");
    setStartDate(new Date(schedule.start));
    setEndDate(new Date(schedule.end));
    setIsModalOpen(true);
    onClose();
  };

  const handleAddEventClick = () => {
    handelScheduleClick(scheduleDate);

    onClose();
    setIsModalOpen(true);
  };

  const sortedSchedule = [...filteredSchedule].sort(
    (a, b) => new Date(a.start) - new Date(b.start)
  );

  return (
    <div className="schedule-modal-overlay">
      <div className="schedule-modal">
        <h2>오늘의 일정</h2>
        {filteredSchedule && filteredSchedule.length > 0 ? (
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
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(schedule)}
                      >
                        수정
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schedule-message">
            <img
              src={NoScheduleImage}
              className="write-image"
              alt="일정 추가 이미지"
            />
            <p>등록된 일정이 없습니다. 새 일정을 추가해보세요 !!</p>
          </div>
        )}
        <div className="modal_buttons">
          <button className="close-button" onClick={handleAddEventClick}>
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
