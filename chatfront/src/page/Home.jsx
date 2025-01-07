import React, { useContext, useState } from "react";
import { LoginContext } from "../state/LoginProvider";
import Header from "./Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import koLocale from "@fullcalendar/core/locales/ko";
import DatePicker from "react-datepicker";
import "./Home.css";
import caImage from "../ca.jpg";
import "react-datepicker/dist/react-datepicker.css";
import { HiArrowSmRight } from "react-icons/hi";

const Login = () => {
  const { isLogin, userInfo } = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventContent, setEventContent] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleDateClick = (info) => {
    setEventDate(info.dateStr);
    setIsModalOpen(true);
  };

  const handleEventClick = (info) => {
  };

  const handleAddEvent = () => {
    if (eventTitle && eventDate) {
      alert(`일정 추가됨: ${eventTitle} - ${eventDate}`);
      setIsModalOpen(false);
    } else {
      alert("일정 제목을 입력하세요.");
    }
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        {isLogin ? (
          <div>
            <p>사용자 이름: {userInfo.username}</p>
            <p>사용자 권한: {userInfo.role}</p>
            <p>사용자 이름: {userInfo.name}</p>
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={koLocale}
                height="900px"
                headerToolbar={{
                  left: "prev,next today addEventButton",
                  center: "title",
                  right: "dayGridMonth,dayGridWeek,dayGridDay",
                }}
                customButtons={{
                  addEventButton: {
                    text: "일정 추가",
                    click: () => {
                      setIsModalOpen(true); // 모달 열기
                    },
                  },
                }}
                navLinks={true} // 일별로 이동
                editable={true}
                selectable={true} // 셀 선택 가능
                dateClick={handleDateClick} // 날짜 클릭 이벤트
                eventClick={handleEventClick} // 이벤트 클릭 이벤트
                events={[
                  // 샘플 일정
                  { title: "회의", date: "2025-01-10" },
                  { title: "여행", date: "2025-01-15" },
                ]}
              />
            </div>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal">
                  <h1>일정 추가</h1>
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
                        dateFormat="yyyy-MM-dd , HH:mm"
                        timeIntervals={60}
                        className="startDate"
                      />
                      <HiArrowSmRight className="arrow-icon" />
                    </div>

                    <div className="calendar-box">
                      <div className="date">종료 날짜</div>
                      <div className="input-with-icon">
                        <DatePicker
                          selected={endDate}
                          showTimeSelect={true}
                          timeFormat="HH:mm"
                          dateFormat="yyyy-MM-dd , HH:mm"
                          timeIntervals={60}
                          onChange={(date) => setEndDate(date)}
                          minDate={new Date()}
                          className="endDate"
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={eventPlace}
                    placeholder="장소"
                    onChange={(e) => setEventPlace(e.target.value)}
                    className="task-place"
                  />
                  <input
                    type="text"
                    value={eventContent}
                    placeholder="인원"
                    onChange={(e) => setEventContent(e.target.value)}
                    className="task-place"
                  />
                  <div>
                    <label className="task-content-title">내용</label>
                    <textarea className="task-content"></textarea>
                  </div>
                  <br />
                  <div className="modal-buttons">
                    <button onClick={handleAddEvent}>추가</button>
                    <button onClick={() => setIsModalOpen(false)}>취소</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="nonLogin-HomePage">
            <p>여러분의 하루 일정을 기록해보세요 !</p>
            <div className="nonLogin-HomePage-content">
              <span>시간별 일정을 만들고 관리해보세요.</span>
              <img src={caImage} className="logoutHome-image" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
