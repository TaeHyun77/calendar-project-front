import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../state/LoginProvider";

// fullCalendar + datePicker 관련
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import koLocale from "@fullcalendar/core/locales/ko";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Header from "./Header";
import "./Home.css";
import caImage from "../ca.jpg";
import { HiArrowSmRight } from "react-icons/hi";

const Home = () => {
  const navigate = useNavigate();

  const { isLogin, userInfo } = useContext(LoginContext);
  console.log(userInfo?.username)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventContent, setEventContent] = useState("");
  const [eventDate, setEventDate] = useState("");

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [events, setEvents] = useState([]);

  // 특정 날짜 클릭 시 모달 창 open
  const handleDateClick = (info) => {
    setIsModalOpen(true);
  };

  // 특정 날짜의 이벤트 출력 (test)
  const handleEvent = (info) => {
    const { title, start, end, extendedProps } = info.event;

    alert(
      `제목: ${title || "x"}\n
      시작 시간: ${start.toLocaleString() || "x"}\n
      종료 시간: ${end.toLocaleString() || "x"}\n
      내용 : ${extendedProps.content || "x"}`
    );
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !startDate) {
      alert("일정 제목과 시작 날짜를 입력하세요.");
      return;
    }

    const formatDateToLocal = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    // 작성된 일정 데이터
    const newEvent = {
      title: eventTitle,
      place: eventPlace,
      start: formatDateToLocal(startDate),
      end: formatDateToLocal(endDate),
      content: eventContent,
    };

    try {
      const response = await axios.post("/api/write/schedule", newEvent);

      if (response.status === 200) {
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        alert("일정이 추가되었습니다.");
        setIsModalOpen(false);
        setEventTitle("");
        setEventPlace("");
        setEventContent("");
        navigate("/");
      } else {
        alert("일정 추가 실패");
      }
    } catch (error) {
      console.error("일정 추가 중 오류 발생:", error);
      alert("일정 추가에 실패했습니다.");
    }
  };

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await axios.get("/api/all/schedule");
        if (response.status === 200) {
          const getEvents = response.data.map((event) => ({
            title: event.title,
            start: event.start,
            end: event.end,
            place: event.place,
            content: event.content,
          }));
          setEvents(getEvents);
        }
      } catch (error) {
        console.error("일정 데이터 불러오기 실패:", error);
      }
    };

    getEvents();
  }, []);

  // 디버깅용
  // useEffect(() => { 
  //   console.log("현재 이벤트 상태:", events);
  // }, [events]);

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
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
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
                // 특정 날의 텍스트 선택 가능하게 하는 것
                navLinks={true}
                // 특정 날 텍스트 선택시 이벤트
                navLinkDayClick={handleDateClick}
                // 특정 날짜 쉘 클릭 시
                dateClick={handleDateClick}
                // 특정 날짜의 이벤트 클릭 시
                eventClick={handleEvent}
                events={events}
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
                        dateFormat="yyyy-MM-dd-HH:mm"
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
                          dateFormat="yyyy-MM-dd-HH:mm"
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

export default Home;
