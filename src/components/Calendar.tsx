import React, { CSSProperties, useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  getYear,
  getMonth,
  subYears,
  addYears,
} from "date-fns";

type ViewMode = "date" | "month" | "year";

interface Props {
  date?: Date | null;
  onSelect?: (date: Date) => void;
}

const styles: { [key: string]: CSSProperties } = {
  calendar: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "350px",
    margin: "auto",
    border: "1px solid #ccc",
    overflow: "hidden",
    padding: "10px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  headerMonthYearLabel: {
    width: "100%",
    backgroundColor: "#eeeeee",
    padding: "8px"
  },
  headerButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
  },
  days: {
    display: "flex",
    fontWeight: "bold",
  },
  day: {
    flex: 1,
    textAlign: "center",
    padding: "10px 0",
  },
  body: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
  },
  cell: {
    flex: 1,
    padding: "10px",
    textAlign: "center",
    cursor: "pointer",
  },
  cellMonth: {
    flex: 1,
    padding: "30px 20px",
    textAlign: "center",
    cursor: "pointer",
  },
  cellYear: {
    flex: 1,
    padding: "30px 20px",
    textAlign: "center",
    cursor: "pointer",
  },
  disabled: {
    color: "#eeeeee",
  },
  selected: {
    backgroundColor: "#db3d44",
    color: "white",
    borderRadius: "50%",
    fontWeight: "bold",
  },
  today: {
    color: "#db3d44",
    borderRadius: "50%",
  },
  pastYear: {
    color: "#eeeeee",
  },
};

const Calendar: React.FC<Props> = ({ date = null, onSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(date);
  const [viewMode, setViewMode] = useState<ViewMode>("date");

  const onClickHeaderView = () => {
    if (viewMode === "date") {
      setViewMode("month");
    } else {
      setViewMode("year");
    }
  };

  const onClickHeaderPrev = () => {
    if (viewMode === "date") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(subYears(currentDate, 1));
    } else {
      setCurrentDate(subYears(currentDate, 12));
    }
  };

  const onClickHeaderNext = () => {
    if (viewMode === "date") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === "month") {
      setCurrentDate(addYears(currentDate, 1));
    } else {
      setCurrentDate(addYears(currentDate, 12));
    }
  };

  const renderHeader = () => {
    let headerLabel;

    const defaultDateFormat = "MMMM yyyy";
    const yearDateFormat = "yyyy";

    const startYear = getYear(currentDate) - 4;
    const endYear = getYear(currentDate) + 7;

    if (viewMode === "date") {
      headerLabel = format(currentDate, defaultDateFormat);
    } else if (viewMode === "month") {
      headerLabel = format(currentDate, yearDateFormat);
    } else {
      headerLabel = `${startYear}-${endYear}`;
    }

    return (
      <div style={styles.header}>
        <button style={styles.headerButton} onClick={onClickHeaderPrev}>
          {"<"}
        </button>
        <div onClick={onClickHeaderView} style={styles.headerMonthYearLabel}>
          {headerLabel}
        </div>
        <button style={styles.headerButton} onClick={onClickHeaderNext}>
          {">"}
        </button>
      </div>
    );
  };

  const onClickCellsDate = (day: Date) => {
    setSelectedDate(day);
    if (onSelect) {
      onSelect(day);
    }
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div style={styles.day} key={i}>
          {format(addDays(startDate, i), "EEEEEE")}
        </div>
      );
    }
    return <div style={styles.days}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(addDays(startDate, 41));

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        days.push(
          <div
            style={{
              ...styles.cell,
              ...(isSameDay(day, new Date()) && styles.today),
              ...(isSameDay(day, selectedDate as Date) && styles.selected),
              ...(!isSameMonth(day, monthStart) && styles.disabled),
            }}
            key={day.toString()}
            onClick={() => onClickCellsDate(cloneDay)}
          >
            <span>{format(day, "d")}</span>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div style={styles.row} key={day.toString()}>
          {days}
        </div>
      );

      days = [];
    }

    return <div style={styles.body}>{rows}</div>;
  };

  const onClickMonth = (month: number) => {
    const newDate = new Date(getYear(currentDate), month, 1);
    setCurrentDate(newDate);
    setViewMode("date");
  };

  const renderMonths = () => {
    const months = [];
    const dateFormat = "MMM";
    const currentYear = getYear(currentDate);
    const selectedYear = getYear(selectedDate || currentDate);

    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentYear, month, 1);

      months.push(
        <div
          style={{
            ...styles.cellMonth,
            ...(getYear(currentDate) === selectedYear &&
              getMonth(currentDate) === month &&
              styles.selected),
          }}
          key={month}
          onClick={() => onClickMonth(month)}
        >
          <span>{format(monthDate, dateFormat)}</span>
        </div>
      );
    }

    return (
      <div style={styles.body}>
        <div style={styles.row}>{months.slice(0, 4)}</div>
        <div style={styles.row}>{months.slice(4, 8)}</div>
        <div style={styles.row}>{months.slice(8, 12)}</div>
      </div>
    );
  };

  const onClickYear = (year: number) => {
    const newDate = new Date(year, getMonth(currentDate), 1);
    setCurrentDate(newDate);
    setViewMode("month");
  };

  const renderYears = () => {
    const years = [];
    const startYear = getYear(currentDate) - 4;
    const endYear = getYear(currentDate) + 7;

    for (let year = startYear; year <= endYear; year++) {
      const isStartYear = startYear === year;
      const isEndYear = endYear === year;

      years.push(
        <div
          style={{
            ...styles.cellYear,
            ...((isStartYear || isEndYear) && styles.pastYear),
            ...(getYear(currentDate) === year && styles.selected),
          }}
          key={year}
          onClick={() => onClickYear(year)}
        >
          <span>{year}</span>
        </div>
      );
    }

    return (
      <div style={styles.body}>
        <div style={styles.row}>{years.slice(0, 4)}</div>
        <div style={styles.row}>{years.slice(4, 8)}</div>
        <div style={styles.row}>{years.slice(8, 12)}</div>
      </div>
    );
  };

  const renderContent = () => {
    switch (viewMode) {
      case "month":
        return renderMonths();
      case "year":
        return renderYears();
      default:
        return (
          <>
            {renderDays()}
            {renderCells()}
          </>
        );
    }
  };

  return (
    <div style={styles.calendar}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default Calendar;
