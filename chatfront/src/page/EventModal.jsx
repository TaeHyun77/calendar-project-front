import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { HiArrowSmRight } from "react-icons/hi";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";

const EventModal = ({
  isOpen,
  onClose,
  onSave,
  eventTitle,
  setEventTitle,
  eventPlace,
  setEventPlace,
  eventContent,
  setEventContent,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedEvent,
  deleteSchedule,
  modifyEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h1>{selectedEvent ? "일정 수정" : "일정 추가"}</h1>
        <input
          type="text"
          value={eventTitle}
          placeholder="제목"
          onChange={(e) => setEventTitle(e.target.value)}
          className="task-title"
        />
        <div className="calendar-select-container">
          <div className="calendar-box">
            <div className="date">시작 날짜</div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              minDate={new Date()}
              showTimeSelect={true}
              timeFormat="HH:mm"
              dateFormat="yyyy-MM-dd HH:mm"
              timeIntervals={60}
              className="startDate"
            />
            <HiArrowSmRight className="arrow-icon" />
          </div>
          <div className="calendar-box">
            <div className="date">종료 날짜</div>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate || new Date()}
              showTimeSelect={true}
              timeFormat="HH:mm"
              dateFormat="yyyy-MM-dd HH:mm"
              timeIntervals={60}
              className="endDate"
            />
          </div>
        </div>
        <input
          type="text"
          value={eventPlace}
          placeholder="장소"
          onChange={(e) => setEventPlace(e.target.value)}
          className="task-place"
        />
        <p className="task-content-title">내용</p>
        <textarea
          className="task-content"
          value={eventContent}
          onChange={(e) => setEventContent(e.target.value)}
        ></textarea>
        <div className="modal-buttons">
          {selectedEvent ? (
            <>
              <button onClick={() => modifyEvent()}>수정</button>
              <button
                onClick={() => deleteSchedule()}
                className="delete_button"
              >
                삭제
              </button>
              <button onClick={onClose}>취소</button>
            </>
          ) : (
            <>
              <button onClick={onSave}>저장</button>
              <button onClick={onClose}>취소</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
