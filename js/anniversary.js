// anniversary.js

function initializeAnniversary() {
    function LunarDate(Year, Month, Day) {
        try {
            let solar = Lunar.fromYmdHms(Year, Month, Day, 0, 0, 0).getSolar();
            return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
        } catch (error) {
            return LunarDate(Year, Month, Day - 1);
        }
    }
    // 计算两个日期之间的天数差
    function daysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000;
        return Math.floor((date2 - date1) / oneDay);
    }
    // 计算两个日期之间的周数和天数差
    function weeksAndDaysBetween(date1, date2) {
        const totalDays = daysBetween(date1, date2);
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        return { weeks, days };
    }
    // 计算两个日期之间的月数和天数差
    function monthsAndDaysBetween(date1, date2) {
        let years = date2.getFullYear() - date1.getFullYear();
        let months = date2.getMonth() - date1.getMonth() + years * 12;
        let days = date2.getDate() - date1.getDate();

        if (days < 0) {
            months -= 1;
            let previousMonth = new Date(date2.getFullYear(), date2.getMonth(), 0);
            days += previousMonth.getDate();
        }

        return { months, days };
    }
    // 剩余天数
    function daysLeft(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        return daysBetween(now, anniversaryDate);
    }
    // 经过天数
    function totalDays(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let startDate;
        if (isLunar) {
            startDate = LunarDate(Year, Month, Day);
        } else {
            startDate = new Date(Year, Month - 1, Day);
        }
        return daysBetween(startDate, now);
    }
    // 返回目标或起始日期以及星期几
    function targetDate(dateStr, isLunar) {
        const [Year, Month, Day] = dateStr.split("-").map(Number);
        let now = new Date();
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let anniversaryDate;
        if (isLunar) {
            anniversaryDate = LunarDate(now.getFullYear(), Month, Day);
            if (anniversaryDate < now) {
                anniversaryDate = LunarDate(now.getFullYear() + 1, Month, Day);
            }
        } else {
            anniversaryDate = new Date(now.getFullYear(), Month - 1, Day);
            if (anniversaryDate < now) {
                anniversaryDate = new Date(now.getFullYear() + 1, Month - 1, Day);
            }
        }
        // 获取星期几
        const weekDay = anniversaryDate.toLocaleDateString('zh-CN', { weekday: 'long' });
        // 返回年月日加星期几
        const year = anniversaryDate.getFullYear();
        const month = (anniversaryDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需要加1
        const day = anniversaryDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day} (${weekDay})`; // 使用'-'作为分隔符
        //   return anniversaryDate.toDateString();  // 直接返回斜杆日期
        // return anniversaryDate.toLocaleDateString('zh-CN');
    }
    // 返回目标或起始日期（根据 displayMode）
    function targetOrStartDate(dateStr, isLunar, displayMode) {
        if (displayMode === "elapsed") {
            return dateStr; // 如果是elapsed模式，直接返回配置的日期（起始日）
        } else {
            return targetDate(dateStr, isLunar); // 否则，显示目标日期和星期几
        }
    }

    const countdownElements = document.querySelectorAll(".countdown");
    // const totalDaysElements = document.querySelectorAll(".total-days");
    // const targetDateElements = document.querySelectorAll(".target-date");

    countdownElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        // let daysText;
        if (displayMode === "elapsed") {
            // 初始化显示状态为0（天数）
            elem.dataset.displayState = '0';
            // 更新显示
            updateElapsedDisplay(elem, dateStr, isLunar, 0);
            // 添加点击事件监听器
            elem.addEventListener('click', function () {
                let currentState = parseInt(elem.dataset.displayState);
                currentState = (currentState + 1) % 3; // 在0、1、2之间循环
                elem.dataset.displayState = currentState.toString();
                updateElapsedDisplay(elem, dateStr, isLunar, currentState);
            });
        } else {
            // 显示剩余天数
            let daysText = daysLeft(dateStr, isLunar);
            elem.textContent = daysText;
            elem.nextElementSibling.textContent = "天后"; // 显示“天后”
        }
    });

    // 更新elapsed模式下的显示内容
    function updateElapsedDisplay(elem, dateStr, isLunar, displayState) {
        if (displayState === 0) {
            // 显示已经过去的天数
            let days = totalDays(dateStr, isLunar);
            elem.textContent = days;
            elem.nextElementSibling.textContent = "天了";
        } else if (displayState === 1) {
            // 显示已经过去的周数和天数
            const [Year, Month, Day] = dateStr.split("-").map(Number);
            let now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let startDate;
            if (isLunar) {
                startDate = LunarDate(Year, Month, Day);
            } else {
                startDate = new Date(Year, Month - 1, Day);
            }

            let { weeks, days } = weeksAndDaysBetween(startDate, now);
            if (days === 0) {
                elem.textContent = weeks;
                elem.nextElementSibling.textContent = "周了";
            } else {
                elem.textContent = `${weeks}周${days}天`;
                elem.nextElementSibling.textContent = "了";
            }
        } else if (displayState === 2) {
            // 显示已经过去的月数和天数
            const [Year, Month, Day] = dateStr.split("-").map(Number);
            let now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let startDate;
            if (isLunar) {
                startDate = LunarDate(Year, Month, Day);
            } else {
                startDate = new Date(Year, Month - 1, Day);
            }

            let { months, days } = monthsAndDaysBetween(startDate, now);
            elem.textContent = `${months}月${days}天`;
            elem.nextElementSibling.textContent = "了";
        }
    }

    // 显示目标或起始日期
    const targetDateElements = document.querySelectorAll(".target-date");
    targetDateElements.forEach(function (elem) {
        const dateStr = elem.getAttribute("data-date");
        const isLunar = elem.hasAttribute("data-lunar");
        const displayMode = elem.getAttribute("data-display-mode"); // 获取 display_mode
        elem.textContent = targetOrStartDate(dateStr, isLunar, displayMode);
    });
}

// 初始页面加载
document.addEventListener("DOMContentLoaded", initializeAnniversary);

// 适配 pjax
document.addEventListener("pjax:complete", initializeAnniversary);