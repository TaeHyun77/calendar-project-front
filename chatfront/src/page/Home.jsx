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
import "react-datepicker/dist/react-datepicker.css";

import EventModal from "./EventModal";
import Header from "./Header";
import "./Home.css";
import caImage from "../ca.jpg";
import { HiArrowSmRight } from "react-icons/hi";

const Home = () => {
  const navigate = useNavigate();

  const { isLogin, userInfo } = useContext(LoginContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [eventContent, setEventContent] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);

  const [selectedEventId, setSelectedEventId] = useState(null);

  // 로그인 사용자의 일정 리스트
  const getScheduleList = async () => {
    try {
      const response = await axios.get("/api/all/schedule");
      const data = response.data;

      setScheduleList(data);

      // fullCalendar의 데이터 형식에 맞춰 형태 변경
      const formattedEvents = data.map((event) => ({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        place: event.place,
        content: event.content,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch post list:", error);
    }
  };

  const deleteSchedule = async () => {
    if (!selectedEventId) {
      alert("삭제할 일정이 선택되지 않았습니다.");
      return;
    }

    const check = window.confirm("일정을 삭제 하시겠습니까 ?");

    try {
      if (check) {
        const response = await axios.delete(`/api/delete/schedule/${selectedEventId}`);

        if (response.status == 200) {
          alert("일정 삭제 성공 !");
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== selectedEventId)
          );
          getScheduleList();
          setSelectedEventId(null);
          setIsModalOpen(false)
          navigate("/");
        }
      }
    } catch (error) {
      console.log("일정 삭제 중 에러 발생", error);
      alert("일정 삭제 중 에러 발생");
    }
  };

  const handleDateClick = (info) => {
    const { date } = info; // 클릭된 날짜 정보

    setSelectedEvent(null);

    setStartDate(date);
    setEndDate(null);
    setEventTitle("");
    setEventPlace("");
    setEventContent("");

    setIsModalOpen(true); // 모달 열기
  };

  // 특정 날짜의 이벤트 출력
  const handleEvent = async (info) => {
    const eventId = info.event.id;
    console.log(eventId);

    setSelectedEventId(eventId);

    try {
      const response = await axios.get(`/api/schedule/${eventId}`);
      const data = response.data;

      setSelectedEvent({
        title: data.title,
        start: data.start,
        end: data.end,
        place: data.place,
        content: data.content,
      });

      setEventTitle(data.title);
      setEventPlace(data.place);
      setEventContent(data.content);
      setStartDate(data.start);
      setEndDate(data.end);
      setIsModalOpen(true);
    } catch (error) {
      console.error("일정 정보를 불러오지 못했습니다.:", error);
      alert("일정 정보를 불러오지 못했습니다.");
    }
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
        getScheduleList();
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
    getScheduleList();
  }, []);

  useEffect(() => {
    console.log("Event Title:", eventTitle);
    console.log("Event Place:", eventPlace);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  }, [eventTitle, eventPlace, startDate, endDate]);

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
                eventContent={(eventInfo) => {
                  // 달력에 표시되는 일정 커스텀

                  return (
                    <div>
                      <b>{eventInfo.timeText}</b> &nbsp;
                      <span>{eventInfo.event.title}</span>
                    </div>
                  );
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

            <EventModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={handleAddEvent}
              selectedEvent={selectedEvent}
              eventTitle={eventTitle}
              setEventTitle={setEventTitle}
              eventPlace={eventPlace}
              setEventPlace={setEventPlace}
              eventContent={eventContent}
              setEventContent={setEventContent}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              deleteSchedule={deleteSchedule}
              selectedEventId={selectedEventId}
            />
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
